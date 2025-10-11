# Calendar Synchronization - FincAirbnb

## Overview

Calendar synchronization enables property owners to sync their FincAirbnb availability with external calendars and other booking platforms, preventing double bookings and streamlining property management.

---

## Integration Goals

### Primary Goals
1. **Prevent double bookings** across multiple platforms
2. **Automate calendar updates** without manual intervention
3. **Support industry-standard** iCal format
4. **Two-way sync** where possible

### Supported Integrations
- Google Calendar
- Apple Calendar (iCal)
- Airbnb (import only)
- Booking.com (import only)
- Other iCal-compatible services

---

## iCal Standard

### What is iCal?

**iCalendar (iCal)** is an industry-standard format for calendar data exchange (RFC 5545).

**File extension**: `.ics`  
**MIME type**: `text/calendar`  
**Format**: Text-based

**Advantages**:
- Universal support
- Easy to parse
- Human-readable
- No authentication required for read-only

---

## Export Calendar (FincAirbnb → External)

### Use Case
Property owner wants to import FincAirbnb bookings into their Google Calendar or block dates on Airbnb.

### Implementation

#### Generate iCal Feed URL

**URL Pattern**:
```
https://api.fincairbnb.com/ical/properties/{propertyId}?token={secretToken}
```

**Example**:
```
https://api.fincairbnb.com/ical/properties/abc-123/calendar.ics?token=xyz789
```

#### Generate Secret Token

```typescript
// api/properties/[id]/calendar/export
export async function generateCalendarToken(propertyId: string, ownerId: string) {
  // Verify ownership
  const property = await getProperty(propertyId);
  if (property.ownerId !== ownerId) {
    throw new Error('Unauthorized');
  }
  
  // Generate secure token
  const token = crypto.randomBytes(32).toString('hex');
  
  // Save token
  await saveCalendarToken({
    propertyId,
    token,
    type: 'export',
    createdAt: new Date(),
  });
  
  const feedUrl = `${process.env.API_URL}/ical/properties/${propertyId}/calendar.ics?token=${token}`;
  
  return {
    feedUrl,
    token,
  };
}
```

#### Generate iCal File

```typescript
// api/ical/properties/[id]/calendar.ics
import ical from 'ical-generator';

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  const propertyId = params.id;
  const token = new URL(req.url).searchParams.get('token');
  
  // Verify token
  const isValid = await verifyCalendarToken(propertyId, token, 'export');
  if (!isValid) {
    return Response.json({ error: 'Invalid token' }, { status: 401 });
  }
  
  // Get property and bookings
  const property = await getProperty(propertyId);
  const bookings = await getPropertyBookings(propertyId, {
    status: ['confirmed', 'paid'],
  });
  
  // Create calendar
  const calendar = ical({
    name: property.title,
    description: `Calendario de ${property.title}`,
    timezone: 'Europe/Madrid',
    ttl: 3600, // Refresh every hour
  });
  
  // Add events for each booking
  for (const booking of bookings) {
    calendar.createEvent({
      start: new Date(booking.checkInDate),
      end: new Date(booking.checkOutDate),
      summary: `Reservado - ${booking.guest.name}`,
      description: `Reserva #${booking.id}\nHóspede: ${booking.guest.name}`,
      status: 'CONFIRMED',
      busyStatus: 'BUSY',
      transparency: 'OPAQUE',
    });
  }
  
  // Add blocked dates (owner-blocked)
  const blockedDates = await getBlockedDates(propertyId);
  for (const blocked of blockedDates) {
    calendar.createEvent({
      start: blocked.startDate,
      end: blocked.endDate,
      summary: 'Non dispoñible',
      status: 'CONFIRMED',
      busyStatus: 'BUSY',
    });
  }
  
  return new Response(calendar.toString(), {
    headers: {
      'Content-Type': 'text/calendar; charset=utf-8',
      'Content-Disposition': 'attachment; filename="calendar.ics"',
    },
  });
}
```

#### iCal Event Format

```ics
BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//FincAirbnb//Calendar//EN
CALSCALE:GREGORIAN
METHOD:PUBLISH
X-WR-CALNAME:Finca do Val
X-WR-TIMEZONE:Europe/Madrid
X-PUBLISHED-TTL:PT1H

BEGIN:VEVENT
UID:booking-abc123@fincairbnb.com
DTSTAMP:20241015T120000Z
DTSTART:20241115
DTEND:20241120
SUMMARY:Reservado - María do Campo
DESCRIPTION:Reserva #abc123\nHóspede: María do Campo
STATUS:CONFIRMED
TRANSP:OPAQUE
END:VEVENT

END:VCALENDAR
```

---

## Import Calendar (External → FincAirbnb)

### Use Case
Property owner lists on multiple platforms (Airbnb, Booking.com) and wants to automatically block those dates on FincAirbnb.

### Implementation

#### Add Calendar Import

**UI Flow**:
```
1. Owner navigates to /taboleiro/fincas/:id/calendario
2. Clicks "Importar calendario externo"
3. Enters calendar URL and name
4. Saves
5. System immediately syncs and schedules periodic sync
```

**Backend**:

```typescript
// api/properties/[id]/calendar/import
export async function addCalendarImport(
  propertyId: string,
  ownerId: string,
  calendarUrl: string,
  name: string
) {
  // Verify ownership
  const property = await getProperty(propertyId);
  if (property.ownerId !== ownerId) {
    throw new Error('Unauthorized');
  }
  
  // Validate URL
  if (!calendarUrl.startsWith('http')) {
    throw new Error('Invalid calendar URL');
  }
  
  // Test fetch
  try {
    await fetchCalendar(calendarUrl);
  } catch (error) {
    throw new Error('Cannot access calendar. Check URL and permissions.');
  }
  
  // Save import config
  const calendarImport = await createCalendarImport({
    propertyId,
    name,
    url: calendarUrl,
    syncFrequency: 'hourly',
    lastSyncedAt: null,
    createdAt: new Date(),
  });
  
  // Immediate first sync
  await syncCalendar(calendarImport.id);
  
  return calendarImport;
}
```

#### Fetch and Parse iCal

```typescript
import ical from 'node-ical';

export async function fetchCalendar(url: string) {
  const response = await fetch(url, {
    headers: {
      'User-Agent': 'FincAirbnb Calendar Sync/1.0',
    },
  });
  
  if (!response.ok) {
    throw new Error(`Failed to fetch calendar: ${response.status}`);
  }
  
  const icalData = await response.text();
  const events = ical.parseICS(icalData);
  
  return events;
}

export async function syncCalendar(calendarImportId: string) {
  const calendarImport = await getCalendarImport(calendarImportId);
  
  try {
    // Fetch calendar
    const events = await fetchCalendar(calendarImport.url);
    
    // Extract blocked dates
    const blockedDates: BlockedDate[] = [];
    
    for (const event of Object.values(events)) {
      if (event.type !== 'VEVENT') continue;
      
      // Skip if in the past
      if (event.end < new Date()) continue;
      
      // Extract dates
      blockedDates.push({
        startDate: event.start,
        endDate: event.end,
        source: 'imported',
        calendarImportId: calendarImportId,
        summary: event.summary || 'Bloqueado',
      });
    }
    
    // Update blocked dates (idempotent)
    await updateImportedBlockedDates(calendarImport.propertyId, calendarImportId, blockedDates);
    
    // Update sync timestamp
    await updateCalendarImport(calendarImportId, {
      lastSyncedAt: new Date(),
      lastSyncStatus: 'success',
    });
    
  } catch (error) {
    await updateCalendarImport(calendarImportId, {
      lastSyncStatus: 'error',
      lastSyncError: error.message,
    });
    throw error;
  }
}
```

#### Sync Schedule

**Cron Job** (using node-cron or external service):

```typescript
import cron from 'node-cron';

// Sync all calendars every hour
cron.schedule('0 * * * *', async () => {
  const calendars = await getActiveCalendarImports();
  
  for (const calendar of calendars) {
    try {
      await syncCalendar(calendar.id);
    } catch (error) {
      console.error(`Failed to sync calendar ${calendar.id}:`, error);
    }
  }
});
```

**Alternative**: Use queue system (BullMQ, etc.) for better reliability

---

## Google Calendar Integration

### Two-Way Sync (OAuth)

For full two-way sync, use Google Calendar API with OAuth.

#### Setup

1. Create project in Google Cloud Console
2. Enable Google Calendar API
3. Create OAuth 2.0 credentials
4. Configure consent screen

```bash
# Environment variables
GOOGLE_CLIENT_ID=xxx.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=xxx
GOOGLE_REDIRECT_URI=https://fincairbnb.com/api/auth/google/callback
```

#### OAuth Flow

```typescript
import { google } from 'googleapis';

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI
);

// Step 1: Generate auth URL
export function getGoogleAuthUrl() {
  const scopes = [
    'https://www.googleapis.com/auth/calendar',
    'https://www.googleapis.com/auth/calendar.events',
  ];
  
  return oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: scopes,
    prompt: 'consent',
  });
}

// Step 2: Handle callback
export async function handleGoogleCallback(code: string, userId: string) {
  const { tokens } = await oauth2Client.getToken(code);
  oauth2Client.setCredentials(tokens);
  
  // Save tokens
  await saveGoogleTokens(userId, {
    accessToken: tokens.access_token!,
    refreshToken: tokens.refresh_token!,
    expiryDate: tokens.expiry_date!,
  });
  
  return tokens;
}

// Step 3: Use API
export async function createGoogleCalendarEvent(
  userId: string,
  booking: Booking
) {
  const tokens = await getGoogleTokens(userId);
  oauth2Client.setCredentials(tokens);
  
  const calendar = google.calendar({ version: 'v3', auth: oauth2Client });
  
  const event = await calendar.events.insert({
    calendarId: 'primary',
    requestBody: {
      summary: `Reserva: ${booking.property.title}`,
      description: `Hóspede: ${booking.guest.name}`,
      start: {
        date: booking.checkInDate,
        timeZone: 'Europe/Madrid',
      },
      end: {
        date: booking.checkOutDate,
        timeZone: 'Europe/Madrid',
      },
    },
  });
  
  return event.data;
}
```

---

## Calendar UI

### Owner Dashboard

**Features**:
- View all bookings in calendar format
- Block/unblock dates manually
- View imported blocked dates (color-coded by source)
- Manage calendar imports
- Download/copy iCal feed URL

**Calendar View**:

```
┌────────────────────────────────────────────┐
│  Novembro 2024                             │
│  [Mes anterior] [Mes seguinte]             │
│                                            │
│   D   L   M   M   X   V   S                │
│                   1   2   3                │
│   4   5   6   7   8   9  10                │
│  11  12  13  14 [15][16][17]               │
│ [18][19][20] 21  22  23  24                │
│  25  26  27  28  29  30                    │
│                                            │
│  Lenda:                                    │
│  🟦 Reservado (FincAirbnb)                │
│  🟨 Bloqueado (manual)                     │
│  🟧 Bloqueado (Airbnb)                     │
│  🟥 Bloqueado (Booking.com)                │
│                                            │
│  [+ Bloquear datas] [+ Importar calendario]│
└────────────────────────────────────────────┘
```

### Import Management

```
┌────────────────────────────────────────────┐
│  Calendarios importados                    │
│                                            │
│  ┌──────────────────────────────────────┐ │
│  │ 📅 Airbnb Calendar                   │ │
│  │    Última sincronización: hai 2h     │ │
│  │    Estado: ✓ Activo                  │ │
│  │    [Editar] [Sincronizar] [Eliminar]│ │
│  └──────────────────────────────────────┘ │
│                                            │
│  ┌──────────────────────────────────────┐ │
│  │ 📅 Booking.com                       │ │
│  │    Última sincronización: hai 30min  │ │
│  │    Estado: ✓ Activo                  │ │
│  │    [Editar] [Sincronizar] [Eliminar]│ │
│  └──────────────────────────────────────┘ │
│                                            │
│  [+ Importar novo calendario]              │
└────────────────────────────────────────────┘
```

---

## Database Schema

```sql
-- Calendar imports (external → FincAirbnb)
CREATE TABLE calendar_imports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
  name VARCHAR(100) NOT NULL,
  url VARCHAR(500) NOT NULL,
  sync_frequency VARCHAR(20) DEFAULT 'hourly',
  last_synced_at TIMESTAMP,
  last_sync_status VARCHAR(20),
  last_sync_error TEXT,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Calendar exports (FincAirbnb → external)
CREATE TABLE calendar_exports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
  token VARCHAR(100) UNIQUE NOT NULL,
  type VARCHAR(20) DEFAULT 'export',
  created_at TIMESTAMP DEFAULT NOW(),
  last_accessed_at TIMESTAMP
);

-- Blocked dates
CREATE TABLE blocked_dates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  source VARCHAR(20) NOT NULL, -- 'manual', 'imported', 'booking'
  calendar_import_id UUID REFERENCES calendar_imports(id) ON DELETE CASCADE,
  booking_id UUID REFERENCES bookings(id) ON DELETE CASCADE,
  note TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  CONSTRAINT valid_dates CHECK (end_date >= start_date),
  CONSTRAINT valid_source CHECK (source IN ('manual', 'imported', 'booking'))
);

-- Indexes
CREATE INDEX idx_calendar_imports_property ON calendar_imports(property_id);
CREATE INDEX idx_calendar_exports_property ON calendar_exports(property_id);
CREATE INDEX idx_calendar_exports_token ON calendar_exports(token);
CREATE INDEX idx_blocked_dates_property ON blocked_dates(property_id);
CREATE INDEX idx_blocked_dates_dates ON blocked_dates(start_date, end_date);
```

---

## Error Handling

### Common Errors

```typescript
export const CALENDAR_ERRORS = {
  INVALID_URL: 'URL de calendario non válida',
  FETCH_FAILED: 'Non se puido acceder ao calendario',
  PARSE_ERROR: 'Erro ao analizar o calendario',
  UNAUTHORIZED: 'Acceso non autorizado ao calendario',
  SYNC_FAILED: 'Erro na sincronización',
};

export function handleCalendarError(error: Error): string {
  if (error.message.includes('404')) {
    return CALENDAR_ERRORS.FETCH_FAILED;
  }
  if (error.message.includes('401') || error.message.includes('403')) {
    return CALENDAR_ERRORS.UNAUTHORIZED;
  }
  if (error.message.includes('parse')) {
    return CALENDAR_ERRORS.PARSE_ERROR;
  }
  return CALENDAR_ERRORS.SYNC_FAILED;
}
```

---

## Performance Considerations

### Caching

```typescript
// Cache calendar data
const CACHE_TTL = 3600; // 1 hour

export async function fetchCalendarWithCache(url: string) {
  const cacheKey = `calendar:${hashUrl(url)}`;
  
  // Check cache
  const cached = await redis.get(cacheKey);
  if (cached) {
    return JSON.parse(cached);
  }
  
  // Fetch fresh data
  const events = await fetchCalendar(url);
  
  // Cache
  await redis.setex(cacheKey, CACHE_TTL, JSON.stringify(events));
  
  return events;
}
```

### Rate Limiting

```typescript
// Limit sync frequency per property
const SYNC_MIN_INTERVAL = 300; // 5 minutes

export async function canSync(calendarImportId: string): Promise<boolean> {
  const calendar = await getCalendarImport(calendarImportId);
  
  if (!calendar.lastSyncedAt) {
    return true;
  }
  
  const timeSinceLastSync = Date.now() - calendar.lastSyncedAt.getTime();
  return timeSinceLastSync >= SYNC_MIN_INTERVAL * 1000;
}
```

---

## Future Enhancements

- [ ] Apple Calendar native integration (CalDAV)
- [ ] Outlook/Microsoft Calendar sync
- [ ] Automatic conflict resolution
- [ ] Smart sync (only when changes detected)
- [ ] Calendar sharing with guests
- [ ] Batch import for multiple properties
- [ ] Calendar templates (seasonal pricing, events)
- [ ] Analytics (booking patterns from external calendars)
- [ ] Mobile calendar widget

---

**Last Updated**: October 2024  
**Integration Owner**: Backend Team  
**Related**: Booking system, Property management

