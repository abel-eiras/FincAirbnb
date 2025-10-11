# Messaging System - FincAirbnb

## Overview

The Messaging System enables communication between guests and property owners throughout the booking process and during stays. Planned for Phase 5 of development.

---

## User Stories

### As a Guest, I want to:
1. Ask questions about a property before booking
2. Communicate with the owner after booking
3. Receive automated messages (booking confirmations, reminders)
4. Get check-in instructions
5. Report issues during my stay
6. Receive timely responses from owners

### As a Property Owner, I want to:
1. Answer guest inquiries quickly
2. Send check-in instructions automatically
3. Use message templates for common questions
4. Manage conversations in one place
5. Receive notifications for new messages
6. Maintain professional communication history

---

## Message Types

### 1. Pre-Booking Inquiries

**Purpose**: Guests ask questions before committing to book

**Characteristics**:
- Not attached to a booking
- 48-hour response expectation
- Can convert to booking conversation

**Common Questions**:
- Availability clarification
- Property details
- Special requirements
- Accessibility
- Pets policy
- Amenities confirmation

### 2. Booking Conversations

**Purpose**: Communication about a confirmed booking

**Characteristics**:
- Attached to specific booking
- Urgent response expectation (24 hours)
- Preserved after check-out (for reviews, disputes)
- Both parties can message

**Common Topics**:
- Check-in arrangements
- House rules clarification
- Special requests
- Key exchange
- Problem reporting
- Check-out instructions

### 3. Automated Messages

**Purpose**: System-generated notifications and reminders

**Types**:
- Booking confirmation
- Check-in reminder (24 hours before)
- Check-out reminder
- Review request
- Important updates

---

## Data Model

### Conversation Schema

```typescript
interface Conversation {
  id: string;
  type: 'inquiry' | 'booking';
  
  // Participants
  guestId: string;
  ownerId: string;
  propertyId: string;
  bookingId?: string; // If type === 'booking'
  
  // Status
  status: 'active' | 'archived';
  
  // Metadata
  lastMessageAt: string;
  lastMessagePreview: string;
  unreadCount: {
    guest: number;
    owner: number;
  };
  
  createdAt: string;
  updatedAt: string;
}

interface Message {
  id: string;
  conversationId: string;
  
  // Sender
  senderId: string;
  senderType: 'guest' | 'owner' | 'system';
  
  // Content
  content: string;
  type: 'text' | 'system' | 'automated';
  
  // Attachments
  attachments?: Attachment[];
  
  // Status
  read: boolean;
  readAt?: string;
  
  // Metadata
  metadata?: {
    templateId?: string;
    automationType?: string;
  };
  
  createdAt: string;
}

interface Attachment {
  id: string;
  type: 'image' | 'pdf' | 'document';
  url: string;
  filename: string;
  size: number;
  mimeType: string;
}

interface MessageTemplate {
  id: string;
  ownerId: string;
  name: string;
  content: string;
  variables: string[]; // e.g., ['guestName', 'checkInTime']
  category: 'checkin' | 'welcome' | 'rules' | 'custom';
  createdAt: string;
}
```

---

## Messaging Features

### 1. Inbox

**URL**: `/taboleiro/mensaxes`

**Layout**:
```
┌────────────────────────────────────────────────┐
│  📨 Mensaxes                                   │
│                                                │
│  [Tabs: Todas | Sen ler | Arquivadas]         │
│                                                │
│  ┌──────────────────┐  ┌────────────────────┐ │
│  │ Conversations    │  │ Message Thread     │ │
│  │                  │  │                    │ │
│  │ ┌──────────────┐│  │ [Property Header] │ │
│  │ │ [Avatar]     ││  │                    │ │
│  │ │ Xosé Manuel  ││  │ [Message 1]        │ │
│  │ │ Finca do Val ││  │ [Message 2]        │ │
│  │ │ Ola! Teño... ││  │ [Message 3]        │ │
│  │ │ 2h ago  •    ││  │                    │ │
│  │ └──────────────┘│  │ [Input Box]        │ │
│  │                  │  │ [Send Button]      │ │
│  │ ┌──────────────┐│  │                    │ │
│  │ │ [Avatar]     ││  └────────────────────┘ │
│  │ │ María...     ││                         │
│  │ └──────────────┘│                         │
│  └──────────────────┘                         │
└────────────────────────────────────────────────┘
```

**Features**:
- Conversation list (left sidebar)
- Message thread (right panel)
- Unread count badges
- Search conversations
- Filter by property
- Archive conversations
- Mark as read/unread

---

### 2. Conversation List

**Sort Order**:
- Unread first
- Most recent message first

**Conversation Card**:
```
┌─────────────────────────────────────────┐
│ [Avatar] María do Campo         • 2     │
│          Finca Santa Eulalia           │
│          Ola! Cando podo facer...      │
│          Hai 3 horas                   │
└─────────────────────────────────────────┘
```

**Information Displayed**:
- Participant name and avatar
- Property name
- Last message preview (100 chars)
- Time since last message
- Unread count badge
- Booking status (if booking conversation)

---

### 3. Message Thread

**Message Bubble**:

**Outgoing** (right-aligned):
```
                          ┌──────────────────┐
                          │ Ola! Si, está    │
                          │ dispoñible.      │
                          │                  │
                          │           15:30  │
                          └──────────────────┘
```

**Incoming** (left-aligned):
```
┌──────────────────┐
│ [Avatar]         │
│ Perfecto, grazas!│
│                  │
│ 15:32            │
└──────────────────┘
```

**System Message** (centered, muted):
```
        ─── Reserva confirmada ───
            15 Nov, 10:00
```

---

### 4. Message Input

**Features**:
- Rich text input
- Emoji picker
- File attachments (images, PDFs)
- Character count (max 2000)
- Send button (or Enter key)
- Template quick-insert (for owners)

**Input Box**:
```
┌─────────────────────────────────────────┐
│ [📎] [😀] Escribe unha mensaxe...     │
│                                  [Enviar]│
└─────────────────────────────────────────┘
```

---

### 5. Message Templates (Owners)

**Purpose**: Quick responses for common questions

**Template Categories**:
- Welcome message
- Check-in instructions
- House rules
- Check-out instructions
- FAQ responses
- Thank you message

**Example Templates**:

```
Template: Benvida
─────────────────────────────────────
Ola {{guestName}}!

Benvido/a á {{propertyName}}! Estamos 
encantados de que escolliches a nosa finca.

O check-in é a partir das {{checkInTime}}.
Enviaréiche as instrucións detalladas un día
antes da túa chegada.

Se tes algunha dúbida, non dubides en preguntar!

Saúdos,
{{ownerName}}
```

**Variable Placeholders**:
- `{{guestName}}`
- `{{ownerName}}`
- `{{propertyName}}`
- `{{checkInTime}}`
- `{{checkOutTime}}`
- `{{address}}`
- `{{bookingId}}`

**Template Management**:
```
/taboleiro/mensaxes/modelos
├─ Create new template
├─ Edit existing
├─ Preview with sample data
└─ Delete
```

---

### 6. Automated Messages

**Trigger Events**:

#### Booking Confirmation
**Sent**: Immediately after booking confirmed
**To**: Guest
**Content**:
```
Reserva confirmada! ✓

Ola {{guestName}},

A túa reserva na {{propertyName}} foi confirmada.

📅 Check-in: {{checkInDate}} ás {{checkInTime}}
📅 Check-out: {{checkOutDate}} ás {{checkOutTime}}
👥 Hóspedes: {{guestCount}}

Código de reserva: {{bookingId}}

[Ver detalles da reserva]

O propietario enviaráche máis información 
pronto.
```

#### Check-in Reminder
**Sent**: 24 hours before check-in
**To**: Guest
**Content**: Check-in instructions + property details

#### Check-out Reminder
**Sent**: Morning of check-out day
**To**: Guest
**Content**: Check-out instructions + review request

#### Review Request
**Sent**: 24 hours after check-out
**To**: Guest and Owner
**Content**: Link to review form

---

### 7. Notifications

**Push Notifications** (web, mobile):
- New message received
- Response from owner/guest
- Booking-related messages

**Email Notifications**:
- New inquiry
- Unread messages (daily digest)
- Booking messages (immediate)

**In-App Notifications**:
- Badge on messaging icon
- Desktop notifications (if enabled)

**Notification Settings**:
```
/taboleiro/configuracion/notificacions

✓ Email for new messages
✓ Push notifications
✓ SMS for urgent messages (optional)
✓ Daily digest of unread messages
□ Promotional messages
```

---

## Technical Implementation

### Real-Time Messaging

**Technology Options**:

#### Option 1: WebSockets
- Real-time bidirectional communication
- Low latency
- Maintains persistent connection

**Implementation**:
```typescript
// Server: Socket.io
import { Server } from 'socket.io';

const io = new Server(server);

io.on('connection', (socket) => {
  const userId = socket.handshake.auth.userId;
  
  // Join user's room
  socket.join(`user:${userId}`);
  
  // Send message
  socket.on('send_message', async (data) => {
    const message = await createMessage(data);
    
    // Emit to recipient
    io.to(`user:${data.recipientId}`).emit('new_message', message);
  });
  
  // Mark as read
  socket.on('mark_read', async (conversationId) => {
    await markConversationAsRead(conversationId, userId);
    io.to(`conversation:${conversationId}`).emit('messages_read');
  });
});

// Client: Socket.io-client
import { io } from 'socket.io-client';

const socket = io('wss://api.fincairbnb.com', {
  auth: { userId, token },
});

socket.on('new_message', (message) => {
  // Update UI with new message
  addMessageToThread(message);
  showNotification(message);
});
```

#### Option 2: Server-Sent Events (SSE)
- One-way communication (server to client)
- Simpler than WebSockets
- Auto-reconnect

#### Option 3: Polling
- Fallback option
- HTTP requests every 5-10 seconds
- Higher latency, more resource intensive

---

### API Endpoints

```
# Conversations
GET    /api/conversations              # List user's conversations
GET    /api/conversations/:id          # Get conversation details
POST   /api/conversations              # Create inquiry
PATCH  /api/conversations/:id/archive  # Archive conversation
DELETE /api/conversations/:id          # Delete conversation

# Messages
GET    /api/conversations/:id/messages # Get messages (paginated)
POST   /api/conversations/:id/messages # Send message
PATCH  /api/messages/:id/read          # Mark as read
DELETE /api/messages/:id               # Delete message (soft)

# Templates
GET    /api/message-templates          # List user's templates
POST   /api/message-templates          # Create template
PUT    /api/message-templates/:id      # Update template
DELETE /api/message-templates/:id      # Delete template

# Automated messages
POST   /api/automated-messages/send    # Trigger automated message
```

---

### Database Schema

```sql
-- Conversations table
CREATE TABLE conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type VARCHAR(20) NOT NULL, -- 'inquiry', 'booking'
  
  guest_id UUID NOT NULL REFERENCES users(id),
  owner_id UUID NOT NULL REFERENCES users(id),
  property_id UUID NOT NULL REFERENCES properties(id),
  booking_id UUID REFERENCES bookings(id),
  
  status VARCHAR(20) DEFAULT 'active',
  
  last_message_at TIMESTAMP,
  last_message_preview TEXT,
  
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  
  CONSTRAINT valid_type CHECK (type IN ('inquiry', 'booking'))
);

-- Messages table
CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  
  sender_id UUID NOT NULL REFERENCES users(id),
  sender_type VARCHAR(10) NOT NULL, -- 'guest', 'owner', 'system'
  
  content TEXT NOT NULL,
  type VARCHAR(20) DEFAULT 'text', -- 'text', 'system', 'automated'
  
  read BOOLEAN DEFAULT false,
  read_at TIMESTAMP,
  
  metadata JSONB,
  
  created_at TIMESTAMP DEFAULT NOW(),
  
  CONSTRAINT valid_sender_type CHECK (sender_type IN ('guest', 'owner', 'system'))
);

-- Message attachments
CREATE TABLE message_attachments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  message_id UUID NOT NULL REFERENCES messages(id) ON DELETE CASCADE,
  
  type VARCHAR(20) NOT NULL, -- 'image', 'pdf', 'document'
  url VARCHAR(500) NOT NULL,
  filename VARCHAR(255) NOT NULL,
  size INT NOT NULL,
  mime_type VARCHAR(100),
  
  created_at TIMESTAMP DEFAULT NOW()
);

-- Message templates
CREATE TABLE message_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id UUID NOT NULL REFERENCES users(id),
  
  name VARCHAR(100) NOT NULL,
  content TEXT NOT NULL,
  variables JSONB, -- Array of variable names
  category VARCHAR(50),
  
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_conversations_guest ON conversations(guest_id);
CREATE INDEX idx_conversations_owner ON conversations(owner_id);
CREATE INDEX idx_conversations_booking ON conversations(booking_id);
CREATE INDEX idx_messages_conversation ON messages(conversation_id);
CREATE INDEX idx_messages_created ON messages(created_at);
```

---

## Security & Moderation

### Message Security

**Encryption**:
- TLS/HTTPS for transport
- Optional: End-to-end encryption for sensitive info

**Access Control**:
- Users can only see their own conversations
- Messages visible only to participants
- Admins can view for moderation

**Rate Limiting**:
- Max 10 messages per minute per user
- Max 100 messages per day to new contacts
- Prevents spam

### Content Moderation

**Automated Filters**:
- Profanity filter
- Spam detection
- Link validation
- Image content moderation (future)

**Reporting**:
- Users can report inappropriate messages
- Admin review queue
- Actions: Warning, suspension, ban

**Prohibited Content**:
- Off-platform transactions
- Personal contact info sharing (before booking)
- Spam or scams
- Harassment
- Illegal activity

---

## User Experience

### Response Time Expectations

**Owners**:
- Inquiries: 48-hour response window
- Booking messages: 24-hour response window
- "Response Rate" metric displayed on profile

**Metrics Tracked**:
- Average response time
- Response rate (% of messages answered)
- Displayed as badges: ⚡ Fast responder

### Mobile Experience

**Mobile-Optimized**:
- Full-screen message view
- Swipe gestures
- Push notifications
- Voice input support
- Image upload from camera

---

## Analytics & Insights

### Owner Dashboard Metrics

**Messaging Stats**:
- Total inquiries received
- Response rate
- Average response time
- Inquiry-to-booking conversion rate
- Most common questions (AI analysis)

### Platform Metrics

**Overall Health**:
- Total messages sent
- Average response time (platform-wide)
- Conversation completion rate
- Spam/abuse reports

---

## Future Enhancements

### Phase 6+
- [ ] Voice messages
- [ ] Video calls (for virtual tours)
- [ ] Translation (automatic, for international guests)
- [ ] Smart replies (AI-suggested responses)
- [ ] Read receipts with timestamp
- [ ] Typing indicators
- [ ] Message reactions (emoji)
- [ ] Scheduled messages
- [ ] Group conversations (multiple properties/guests)
- [ ] Integration with WhatsApp/Telegram
- [ ] Chatbot for common questions (FAQ)
- [ ] Message search with filters
- [ ] Message bookmarks/stars

---

**Status**: Specification Phase  
**Target Release**: Phase 5  
**Dependencies**: User authentication, Property listings, Booking system  
**Priority**: High

