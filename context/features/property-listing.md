# Property Listing System - FincAirbnb

## Overview

The Property Listing System allows property owners to create, manage, and showcase their rural properties (fincas) on the FincAirbnb platform. This is a core feature planned for Phase 2 of development.

---

## User Stories

### As a Property Owner, I want to:
1. Create a new property listing with detailed information
2. Upload multiple photos of my property
3. Set availability and pricing
4. Edit my property details anytime
5. Activate/deactivate listings
6. Preview how guests see my listing
7. Duplicate existing listings (for similar properties)
8. Track views and inquiries for my listing

### As a Guest, I want to:
1. Browse available properties
2. Filter by location, price, amenities
3. View detailed property information
4. See high-quality photos
5. Check availability calendar
6. Read reviews from previous guests
7. Save favorite properties
8. Share properties with friends

---

## Data Model

### Property Schema

```typescript
interface Property {
  // Basic Information
  id: string;
  ownerId: string;
  title: string;              // e.g., "Finca do Val en Ponteareas"
  slug: string;               // URL-friendly: "finca-do-val-ponteareas"
  description: string;        // Full description (1000+ chars)
  shortDescription: string;   // Brief description (200 chars)
  
  // Location
  location: {
    address: string;          // Street address
    city: string;             // e.g., "Ponteareas"
    province: string;         // e.g., "Pontevedra"
    region: string;           // Always "Galicia"
    postalCode: string;
    coordinates?: {
      lat: number;
      lng: number;
    };
  };
  
  // Property Details
  propertyType: 'finca' | 'casa_rural' | 'pazo' | 'cortina' | 'horreo';
  size: {
    land: number;             // Hectares
    buildingArea?: number;    // Square meters
    rooms?: number;
    bathrooms?: number;
    capacity: number;         // Max guests
  };
  
  // Amenities
  amenities: {
    // Basic
    wifi: boolean;
    electricity: boolean;
    water: boolean;
    heating: boolean;
    
    // Kitchen
    kitchen: boolean;
    refrigerator: boolean;
    stove: boolean;
    
    // Outdoor
    garden: boolean;
    parking: boolean;
    pool: boolean;
    bbq: boolean;
    
    // Activities
    farmAnimals: boolean;
    cropFields: boolean;
    hiking: boolean;
    fishing: boolean;
    
    // Other
    petFriendly: boolean;
    childFriendly: boolean;
    wheelchairAccessible: boolean;
  };
  
  // Pricing
  pricing: {
    basePrice: number;        // €/night or €/month
    pricingType: 'per_night' | 'per_month';
    weekendPrice?: number;    // Premium for weekends
    minimumStay: number;      // Minimum nights/months
    cleaningFee?: number;
    deposit: number;
  };
  
  // Availability
  availability: {
    calendar: CalendarEntry[];
    instantBook: boolean;
    advanceNotice: number;    // Days in advance required
  };
  
  // Media
  media: {
    photos: Photo[];
    video?: string;           // YouTube/Vimeo URL
    virtualTour?: string;     // 360° tour URL
  };
  
  // Rules & Policies
  rules: {
    smokingAllowed: boolean;
    partiesAllowed: boolean;
    petsAllowed: boolean;
    checkInTime: string;      // e.g., "15:00"
    checkOutTime: string;     // e.g., "11:00"
    cancellationPolicy: 'flexible' | 'moderate' | 'strict';
    houseRules: string[];     // Custom rules
  };
  
  // Status & Metadata
  status: 'draft' | 'active' | 'inactive' | 'pending_review';
  featured: boolean;
  verified: boolean;
  views: number;
  bookings: number;
  rating: number;
  reviewCount: number;
  
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
}

interface Photo {
  id: string;
  url: string;
  thumbnailUrl: string;
  caption?: string;
  order: number;
  isPrimary: boolean;
}

interface CalendarEntry {
  date: string;             // ISO date
  available: boolean;
  price?: number;          // Override base price
  minimumStay?: number;    // Override minimum stay
}
```

---

## Features Breakdown

### 1. Create Property Listing

**Flow**:
```
1. Click "Crear nova finca"
2. Step 1: Basic Info
   ├─ Título
   ├─ Tipo de propiedade
   └─ Localización
3. Step 2: Details
   ├─ Descrición
   ├─ Tamaño
   └─ Capacidade
4. Step 3: Amenities
   └─ Select amenities checklist
5. Step 4: Photos
   ├─ Upload photos (drag & drop)
   ├─ Reorder photos
   └─ Set primary photo
6. Step 5: Pricing
   ├─ Prezo base
   ├─ Política de cancelación
   └─ Estancia mínima
7. Step 6: Availability
   └─ Set blocked dates
8. Step 7: Rules
   └─ House rules and policies
9. Review & Publish
```

**UI Components**:
- Multi-step form wizard
- Progress indicator
- Save draft functionality
- Preview mode
- Image uploader with drag & drop
- Rich text editor for description
- Location picker (map integration)

**Validation**:
```typescript
const propertySchema = z.object({
  title: z.string()
    .min(10, "O título debe ter polo menos 10 caracteres")
    .max(100, "O título non pode superar os 100 caracteres"),
  
  description: z.string()
    .min(200, "A descrición debe ter polo menos 200 caracteres"),
  
  location: z.object({
    city: z.string().min(1, "A cidade é obrigatoria"),
    province: z.enum(['Pontevedra', 'Ourense', 'Lugo', 'A Coruña']),
  }),
  
  pricing: z.object({
    basePrice: z.number()
      .min(20, "O prezo mínimo é 20€")
      .max(10000, "O prezo máximo é 10.000€"),
  }),
  
  photos: z.array(z.object({
    url: z.string().url(),
  })).min(3, "Debes subir polo menos 3 fotos"),
});
```

---

### 2. Photo Management

**Features**:
- Upload multiple photos (max 30)
- Drag & drop reordering
- Set primary photo
- Add captions
- Automatic image optimization
  - Resize to standard dimensions
  - WebP format conversion
  - Thumbnail generation
- Bulk delete
- Photo gallery preview

**Image Requirements**:
- Min resolution: 1920x1080
- Max file size: 10MB
- Formats: JPEG, PNG, WebP
- Aspect ratio: 16:9 or 4:3

**Storage**:
- Phase 1: Mock URLs
- Phase 2: Cloud storage (Cloudinary/AWS S3)

**Upload Component**:
```typescript
<ImageUpload
  maxFiles={30}
  maxSizeMB={10}
  acceptedFormats={['image/jpeg', 'image/png', 'image/webp']}
  onUpload={handleUpload}
  onReorder={handleReorder}
  onDelete={handleDelete}
/>
```

---

### 3. Property Search & Filters

**Search Filters**:

**Location**:
- By province
- By city
- Radius search (km from point)

**Property Type**:
- Finca
- Casa rural
- Pazo
- Cortina
- Horreo

**Capacity**:
- Number of guests
- Bedrooms
- Bathrooms

**Price Range**:
- Min-Max slider
- Per night / Per month toggle

**Amenities** (checkboxes):
- WiFi
- Parking
- Pool
- Kitchen
- Garden
- Pet-friendly
- Farm animals
- Crop fields

**Dates**:
- Check-in / Check-out
- Show only available properties

**Sort By**:
- Price (low to high)
- Price (high to low)
- Recently added
- Most popular
- Highest rated
- Distance

**Search UI**:
```
┌─────────────────────────────────────────────────┐
│  🔍 [Search: location, type...]                │
│                                                 │
│  📅 Check-in  📅 Check-out  👥 Guests [Search] │
└─────────────────────────────────────────────────┘

┌──────────────┐  ┌─────────────────────────────┐
│   Filters    │  │   Search Results            │
│              │  │                             │
│ Localización │  │  [Property Card]            │
│ Tipo         │  │  [Property Card]            │
│ Prezo        │  │  [Property Card]            │
│ Comodidades  │  │  [Property Card]            │
│              │  │                             │
│ [Aplicar]    │  │  Pagination: 1 2 3 ... 10   │
└──────────────┘  └─────────────────────────────┘
```

---

### 4. Property Detail Page

**URL Structure**: `/fincas/[slug]`
Example: `/fincas/finca-do-val-ponteareas`

**Page Sections**:

1. **Hero Section**
   - Primary photo gallery
   - Property title
   - Location
   - Rating & reviews count
   - Share & Save buttons

2. **Quick Info**
   - Property type
   - Capacity
   - Size
   - Price per night/month

3. **Description**
   - Full description
   - "Read more" expandable

4. **Amenities**
   - Icons with labels
   - Organized by category

5. **Location**
   - Map view
   - Address (approximate)
   - Nearby attractions

6. **Calendar**
   - Availability calendar
   - Price calendar

7. **Reviews**
   - Average rating
   - Review list (paginated)
   - Rating breakdown

8. **Host Information**
   - Host name & photo
   - Member since
   - Response rate
   - "Contact Host" button

9. **Booking Widget** (sticky)
   - Date picker
   - Guest counter
   - Price calculation
   - "Reserve" button

10. **Similar Properties**
    - Recommendations

---

### 5. Property Management Dashboard

**Owner Dashboard Sections**:

```
/taboleiro/fincas
├─ All listings overview
├─ Create new listing
├─ Edit listing
├─ Analytics per listing
└─ Bookings per listing
```

**Listing Cards** (in dashboard):
```
┌─────────────────────────────────────────────┐
│ [Photo] │ Finca do Val                      │
│         │ Ponteareas, Pontevedra            │
│         │                                   │
│         │ Status: [Active ▼]               │
│         │ Views: 234 | Bookings: 12        │
│         │                                   │
│         │ [Edit] [Duplicate] [Deactivate]  │
└─────────────────────────────────────────────┘
```

**Quick Actions**:
- Edit details
- Update calendar
- View bookings
- Check analytics
- Respond to inquiries
- Duplicate listing
- Deactivate/Activate
- Delete

---

### 6. Property Verification (Admin)

**Verification Process**:
1. Owner submits property
2. Status: `pending_review`
3. Admin reviews:
   - Photos quality
   - Description accuracy
   - Compliance with policies
   - Contact information
4. Admin decision:
   - ✅ Approve → `verified: true`, status: `active`
   - ❌ Reject → Feedback to owner
   - 🔄 Request changes

**Verification Badge**:
- Displayed on listing
- Builds trust with guests
- Higher visibility in search

---

## Technical Implementation

### API Endpoints (Future)

```
POST   /api/properties              # Create property
GET    /api/properties              # List properties (with filters)
GET    /api/properties/:id          # Get single property
PUT    /api/properties/:id          # Update property
DELETE /api/properties/:id          # Delete property
PATCH  /api/properties/:id/status   # Change status

GET    /api/properties/:id/calendar # Get availability
PUT    /api/properties/:id/calendar # Update availability

POST   /api/properties/:id/photos   # Upload photo
DELETE /api/properties/:id/photos/:photoId  # Delete photo
PUT    /api/properties/:id/photos/order     # Reorder photos
```

### Database Schema

```sql
-- Properties table
CREATE TABLE properties (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id UUID NOT NULL REFERENCES users(id),
  title VARCHAR(100) NOT NULL,
  slug VARCHAR(120) UNIQUE NOT NULL,
  description TEXT NOT NULL,
  short_description VARCHAR(200),
  
  -- Location
  address VARCHAR(255),
  city VARCHAR(100) NOT NULL,
  province VARCHAR(50) NOT NULL,
  postal_code VARCHAR(10),
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  
  -- Details
  property_type VARCHAR(50) NOT NULL,
  land_size DECIMAL(10, 2),
  building_area DECIMAL(10, 2),
  rooms INT,
  bathrooms INT,
  capacity INT NOT NULL,
  
  -- Pricing
  base_price DECIMAL(10, 2) NOT NULL,
  pricing_type VARCHAR(20) NOT NULL,
  weekend_price DECIMAL(10, 2),
  minimum_stay INT DEFAULT 1,
  cleaning_fee DECIMAL(10, 2),
  deposit DECIMAL(10, 2),
  
  -- Status
  status VARCHAR(20) DEFAULT 'draft',
  featured BOOLEAN DEFAULT false,
  verified BOOLEAN DEFAULT false,
  views INT DEFAULT 0,
  bookings INT DEFAULT 0,
  
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  published_at TIMESTAMP,
  
  CONSTRAINT valid_status CHECK (status IN ('draft', 'active', 'inactive', 'pending_review'))
);

-- Photos table
CREATE TABLE property_photos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
  url VARCHAR(500) NOT NULL,
  thumbnail_url VARCHAR(500),
  caption TEXT,
  display_order INT NOT NULL,
  is_primary BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Amenities (many-to-many)
CREATE TABLE property_amenities (
  property_id UUID REFERENCES properties(id) ON DELETE CASCADE,
  amenity_code VARCHAR(50) NOT NULL,
  PRIMARY KEY (property_id, amenity_code)
);

-- Availability calendar
CREATE TABLE property_availability (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  available BOOLEAN DEFAULT true,
  price_override DECIMAL(10, 2),
  minimum_stay_override INT,
  UNIQUE (property_id, date)
);

-- Indexes
CREATE INDEX idx_properties_owner ON properties(owner_id);
CREATE INDEX idx_properties_city ON properties(city);
CREATE INDEX idx_properties_status ON properties(status);
CREATE INDEX idx_properties_featured ON properties(featured);
CREATE INDEX idx_property_photos_property ON property_photos(property_id);
CREATE INDEX idx_availability_property_date ON property_availability(property_id, date);
```

---

## UI/UX Guidelines

### Property Card (Search Results)

```
┌─────────────────────────────────────┐
│  [Primary Photo]         ❤️ Save   │
│                          ⭐ 4.8     │
│                                     │
│  Finca do Val                       │
│  Ponteareas, Pontevedra             │
│                                     │
│  👥 6 guests  🛏️ 3 rooms  🛁 2 bath│
│                                     │
│  desde 150€/noite                   │
│                                     │
│  ✓ WiFi  ✓ Parking  ✓ Piscina      │
└─────────────────────────────────────┘
```

### Property Photos (Detail Page)

- Grid layout with primary photo large
- Click to open full-screen gallery
- Swipe/arrow navigation
- Zoom functionality
- Photo count indicator

---

## Analytics & Metrics

### Owner Dashboard Metrics

**Per Property**:
- Total views
- View-to-inquiry ratio
- Total bookings
- Revenue generated
- Average nightly rate
- Occupancy rate
- Average guest rating

**Time Series**:
- Views over time (chart)
- Bookings over time
- Revenue trend

---

## Future Enhancements

### Phase 3+
- [ ] Map view for search results
- [ ] Street View integration
- [ ] 360° virtual tours
- [ ] Video uploads
- [ ] Automatic pricing suggestions (AI)
- [ ] Bulk calendar updates
- [ ] iCal sync (import/export)
- [ ] Multi-calendar view
- [ ] Property comparison tool
- [ ] Wishlist/Collections for guests
- [ ] Similar property recommendations
- [ ] Property insights (best time to book, demand trends)

---

**Status**: Specification Phase  
**Target Release**: Phase 2  
**Dependencies**: Authentication system, Payment integration  
**Priority**: High

