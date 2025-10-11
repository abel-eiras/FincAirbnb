# Reviews & Ratings System - FincAirbnb

## Overview

The Reviews & Ratings system enables guests to review properties and owners to review guests, building trust and transparency in the FincAirbnb marketplace. Planned for Phase 6 of development.

---

## User Stories

### As a Guest, I want to:
1. Leave a review for a property after my stay
2. Rate different aspects of the property
3. Read reviews from other guests before booking
4. See the owner's response to reviews
5. Edit my review within a reasonable timeframe
6. Report inappropriate reviews

### As a Property Owner, I want to:
1. Receive reviews from guests
2. Review guests who stayed at my property
3. Respond publicly to reviews
4. See my average rating
5. Learn from feedback to improve
6. Report fake or unfair reviews

---

## Review Types

### 1. Property Reviews (by Guests)

**Purpose**: Help future guests make informed decisions

**Rating Categories** (1-5 stars):
- **Overall Rating** (required)
- **Cleanliness**: How clean was the property?
- **Communication**: How responsive was the owner?
- **Accuracy**: Did the listing match reality?
- **Location**: Was the location as described?
- **Value**: Was it worth the price?

**Additional Elements**:
- Written review (optional but encouraged)
- Photos (optional, up to 5)
- Pros/Cons (optional)
- Would recommend? (Yes/No)

### 2. Guest Reviews (by Owners)

**Purpose**: Help owners identify reliable guests

**Rating Categories** (1-5 stars):
- **Overall Rating** (required)
- **Cleanliness**: How did they leave the property?
- **Communication**: Were they responsive?
- **Respect for Rules**: Did they follow house rules?
- **Would Host Again?** (Yes/No)

**Additional Elements**:
- Written review (optional)
- Private feedback to platform (optional)

---

## Data Model

### Review Schema

```typescript
interface Review {
  id: string;
  bookingId: string;
  
  // Parties
  reviewerId: string;      // Who wrote the review
  revieweeId: string;      // Who is being reviewed
  revieweeType: 'property' | 'guest';
  propertyId?: string;     // If reviewing property
  
  // Ratings (1-5 stars)
  ratings: {
    overall: number;       // Required
    cleanliness: number;
    communication: number;
    accuracy?: number;     // Property reviews only
    location?: number;     // Property reviews only
    value?: number;        // Property reviews only
    rulesRespect?: number; // Guest reviews only
  };
  
  // Content
  title?: string;          // Optional summary
  comment: string;         // Main review text
  pros?: string[];         // List of positives
  cons?: string[];         // List of negatives
  
  // Additional
  wouldRecommend: boolean;
  photos?: ReviewPhoto[];
  
  // Response
  response?: {
    content: string;
    respondedAt: string;
  };
  
  // Status
  status: 'draft' | 'published' | 'hidden' | 'flagged';
  publishedAt?: string;
  
  // Moderation
  reportCount: number;
  verified: boolean;       // Verified stay
  helpful: number;         // Helpful votes
  notHelpful: number;
  
  createdAt: string;
  updatedAt: string;
  editedAt?: string;
}

interface ReviewPhoto {
  id: string;
  url: string;
  caption?: string;
}

interface ReviewStats {
  propertyId: string;
  
  totalReviews: number;
  averageRating: number;
  
  ratingBreakdown: {
    overall: number;
    cleanliness: number;
    communication: number;
    accuracy: number;
    location: number;
    value: number;
  };
  
  ratingDistribution: {
    5: number;  // Count of 5-star reviews
    4: number;
    3: number;
    2: number;
    1: number;
  };
  
  recommendationRate: number; // Percentage who would recommend
  
  lastUpdated: string;
}
```

---

## Review Flow

### 1. Review Eligibility

**Requirements**:
- ✓ Booking must be completed (checked out)
- ✓ Check-out was 14+ days ago or less
- ✓ User hasn't already reviewed this booking
- ✓ Booking wasn't cancelled

**Review Window**: 14 days after check-out

```
Check-out date
    │
    ▼
Wait 24 hours (guest settles)
    │
    ▼
Send review request email
    │
    ├─ Guest reviews property
    └─ Owner reviews guest
    │
    ▼
Both parties have 14 days to submit
    │
    ▼
Reviews published simultaneously
    │
    ├─ Both submitted: Publish immediately
    ├─ One submitted: Publish after 14 days
    └─ None submitted: Window closes
```

---

### 2. Submitting a Review

**Guest Review Flow**:

```
1. Receive email: "Valora a túa estadía"
   └─ Click "Escribir valoración"
   
2. Review form page
   │
   ├─ Property summary (photo, name, dates)
   │
   ├─ Star ratings (6 categories)
   │   ├─ Overall (required)
   │   ├─ Cleanliness
   │   ├─ Communication
   │   ├─ Accuracy
   │   ├─ Location
   │   └─ Value
   │
   ├─ Written review (optional)
   │   └─ Min 50 characters if included
   │
   ├─ Photos (optional)
   │   └─ Upload up to 5 photos
   │
   ├─ Pros/Cons (optional)
   │
   └─ Would recommend? (Yes/No)
   
3. Preview review

4. Submit
   └─ Review saved as 'draft' until both parties submit
```

**Review Form UI**:

```
┌────────────────────────────────────────────┐
│ Valora a túa estadía                       │
│                                            │
│ [Property Photo] Finca do Val             │
│                  15-20 Nov 2024            │
│                                            │
│ Valoración xeral *                         │
│ ★★★★★ (5 estrelas)                        │
│                                            │
│ Limpeza                                    │
│ ★★★★☆ (4 estrelas)                        │
│                                            │
│ Comunicación                               │
│ ★★★★★ (5 estrelas)                        │
│                                            │
│ ... (more categories)                      │
│                                            │
│ Conta a túa experiencia (opcional)         │
│ [Text area, min 50 chars]                 │
│                                            │
│ Engade fotos (opcional)                    │
│ [Photo upload area]                        │
│                                            │
│ Recomendarías esta finca? *                │
│ ○ Si  ○ Non                               │
│                                            │
│ [Vista previa] [Enviar valoración]         │
└────────────────────────────────────────────┘
```

---

### 3. Publishing Reviews

**Simultaneous Publishing**:
- Prevents bias
- Both parties submit blindly
- Reviews published at same time

**Scenarios**:

1. **Both submit within 14 days**
   - Publish both immediately upon second submission
   
2. **Only one submits**
   - Wait 14 days from checkout
   - Publish the one submitted
   - Close review window
   
3. **Neither submits**
   - Review window closes after 14 days
   - No reviews published

**Email Notifications**:
- "Nova valoración recibida"
- Link to view review
- Prompt to respond (owners)

---

### 4. Responding to Reviews (Owners)

**Owner Response**:
- Public response visible to all
- 30-day window to respond
- Can only respond once
- Cannot edit after posting
- Optional but recommended

**Response Guidelines**:
- Thank the guest
- Address concerns professionally
- Keep it brief and respectful
- No personal attacks

**Example Response**:
```
Grazas pola túa valoración, María! Alegrámenos
moito que gozases da finca. Sentimos as molestias
co WiFi - xa o arranxamos para futuros hóspedes.

Esperamos verte de novo! 🌻
```

---

## Review Display

### Property Page Reviews Section

**Layout**:

```
┌────────────────────────────────────────────┐
│ ⭐ 4.8 (127 valoracións)                   │
│                                            │
│ ┌─────────────────────────────────────┐   │
│ │ Limpeza      ★★★★★ 4.9             │   │
│ │ Comunicación ★★★★★ 5.0             │   │
│ │ Precisión    ★★★★☆ 4.7             │   │
│ │ Localización ★★★★★ 4.9             │   │
│ │ Calidade-prezo ★★★★☆ 4.6           │   │
│ └─────────────────────────────────────┘   │
│                                            │
│ Rating Distribution:                       │
│ 5★ ████████████████████████ 85% (108)     │
│ 4★ █████░░░░░░░░░░░░░░░░░░░ 10% (13)      │
│ 3★ ██░░░░░░░░░░░░░░░░░░░░░░  3% (4)       │
│ 2★ ░░░░░░░░░░░░░░░░░░░░░░░░  1% (1)       │
│ 1★ ░░░░░░░░░░░░░░░░░░░░░░░░  1% (1)       │
│                                            │
│ [Filtrar: Todas | 5★ | 4★ | 3★ | <3★]    │
│ [Ordenar: Recentes | Útiles | Puntuación]│
│                                            │
│ ┌──────────────────────────────────────┐  │
│ │ [Avatar] María do Campo              │  │
│ │          ⭐⭐⭐⭐⭐ Novembro 2024      │  │
│ │                                      │  │
│ │ Lugar fantástico para desconectar!   │  │
│ │ A finca é tal cal se describe, moi   │  │
│ │ limpa e acolledora. O Xosé foi...    │  │
│ │                                      │  │
│ │ [Ler máis]                           │  │
│ │                                      │  │
│ │ [3 photos]                           │  │
│ │                                      │  │
│ │ Resposta do propietario:             │  │
│ │ Grazas pola túa valoración, María!.. │  │
│ │                                      │  │
│ │ ✓ Útil (12)  Reportar                │  │
│ └──────────────────────────────────────┘  │
│                                            │
│ ... (more reviews)                         │
│                                            │
│ [Cargar máis valoracións]                  │
└────────────────────────────────────────────┘
```

---

### Review Card Components

**Review Header**:
- Reviewer avatar
- Reviewer name
- Overall star rating
- Review date
- "Verified Stay" badge

**Review Body**:
- Title (if provided)
- Full text (with "Read more" expansion)
- Pros/Cons bullets
- Photos (gallery)

**Review Footer**:
- Owner response (if exists)
- Helpful votes
- Report button

---

### Search Filters

**Filter Options**:
- Star rating (5★, 4★, 3★, <3★)
- Date range
- With photos
- Verified stays only
- Keyword search

**Sort Options**:
- Most recent
- Highest rated
- Lowest rated
- Most helpful

---

## Review Guidelines

### Writing Guidelines (displayed to users)

**For Guests**:
1. Be honest and constructive
2. Describe your experience objectively
3. Focus on facts, not emotions
4. Mention both positives and negatives
5. Don't include:
   - Personal contact information
   - Unrelated complaints
   - Offensive language
   - False information

**For Owners**:
1. Be professional and respectful
2. Thank guests for feedback
3. Address concerns constructively
4. Don't:
   - Attack guests personally
   - Make excuses
   - Disclose private information

---

## Moderation & Quality

### Automated Moderation

**Content Filters**:
- Profanity detection
- Personal info redaction (phone, email)
- Spam detection
- Duplicate detection

**Quality Checks**:
- Minimum length (if text included)
- Coherent language
- Suspicious patterns (all 5-star or 1-star)

### Manual Moderation

**Review Flags** (reported by users):
- Fake review
- Offensive content
- Contains personal info
- Unrelated to stay
- Revenge review

**Admin Review Queue**:
- Flagged reviews
- Suspicious patterns
- First-time reviewers

**Actions**:
- Approve
- Edit (remove specific content)
- Hide (but keep for owner)
- Delete (serious violations)
- Contact reviewer for clarification

---

## Review Analytics

### Property Dashboard

**Review Metrics**:
- Average rating (overall)
- Total reviews
- Recent reviews (last 30 days)
- Rating trend (improving/declining)
- Category breakdown
- Common keywords (AI analysis)

**Review Insights**:
```
┌────────────────────────────────────────┐
│ Review Performance                     │
│                                        │
│ Average Rating: 4.8 ⭐ (+0.2 vs. Oct) │
│ Total Reviews: 127                     │
│ Response Rate: 95%                     │
│                                        │
│ Top Mentions (últimos 3 meses):        │
│ ✓ Limpeza (34 mencións)               │
│ ✓ Tranquilidade (28 mencións)         │
│ ✓ Vistas (22 mencións)                │
│                                        │
│ Areas de mellora:                      │
│ • WiFi (5 comentarios)                 │
│ • Acceso (3 comentarios)               │
│                                        │
│ [Ver todas as valoracións]             │
└────────────────────────────────────────┘
```

### Platform Analytics

**Marketplace Health**:
- Average rating across all properties
- % of properties with reviews
- % of bookings resulting in reviews
- Most common complaints
- Best-performing properties

---

## Incentivization

### Encouraging Reviews

**For Guests**:
- Email reminders (3 emails over 14 days)
- In-app notifications
- "Leave first review" badge
- Entry into monthly prize draw (optional)

**For Owners**:
- Response rate displayed on profile
- "Responsive Host" badge for >90% response rate
- Better search ranking for reviewed properties

### Review Badges

**Property Badges**:
- ⭐ Superhost (consistently high ratings)
- 🏆 Guest Favorite (top 10% in area)
- ✨ Spotless (5.0 cleanliness rating)
- 💬 Great Communicator (5.0 communication)

**User Badges**:
- ✍️ Seasoned Reviewer (10+ reviews)
- 🎯 Helpful Reviewer (helpful votes)
- ⚡ Fast Responder (owners)

---

## Technical Implementation

### API Endpoints

```
# Reviews
GET    /api/reviews?propertyId=xxx        # Get property reviews
GET    /api/reviews?userId=xxx&type=given # Get user's given reviews
GET    /api/reviews?userId=xxx&type=received # Get user's received reviews
POST   /api/reviews                       # Submit review
PUT    /api/reviews/:id                   # Edit review (within 48h)
DELETE /api/reviews/:id                   # Delete review (rare)

# Review responses
POST   /api/reviews/:id/response          # Owner responds to review

# Helpful votes
POST   /api/reviews/:id/helpful           # Vote helpful
POST   /api/reviews/:id/not-helpful       # Vote not helpful

# Reporting
POST   /api/reviews/:id/report            # Report review

# Stats
GET    /api/properties/:id/review-stats   # Get aggregated stats
```

---

### Database Schema

```sql
-- Reviews table
CREATE TABLE reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id UUID NOT NULL REFERENCES bookings(id),
  
  reviewer_id UUID NOT NULL REFERENCES users(id),
  reviewee_id UUID NOT NULL REFERENCES users(id),
  reviewee_type VARCHAR(10) NOT NULL, -- 'property', 'guest'
  property_id UUID REFERENCES properties(id),
  
  -- Ratings
  rating_overall INT NOT NULL CHECK (rating_overall BETWEEN 1 AND 5),
  rating_cleanliness INT CHECK (rating_cleanliness BETWEEN 1 AND 5),
  rating_communication INT CHECK (rating_communication BETWEEN 1 AND 5),
  rating_accuracy INT CHECK (rating_accuracy BETWEEN 1 AND 5),
  rating_location INT CHECK (rating_location BETWEEN 1 AND 5),
  rating_value INT CHECK (rating_value BETWEEN 1 AND 5),
  rating_rules_respect INT CHECK (rating_rules_respect BETWEEN 1 AND 5),
  
  -- Content
  title VARCHAR(200),
  comment TEXT,
  pros TEXT[],
  cons TEXT[],
  would_recommend BOOLEAN,
  
  -- Response
  response_content TEXT,
  responded_at TIMESTAMP,
  
  -- Status
  status VARCHAR(20) DEFAULT 'draft',
  published_at TIMESTAMP,
  
  -- Moderation
  report_count INT DEFAULT 0,
  verified BOOLEAN DEFAULT true,
  helpful INT DEFAULT 0,
  not_helpful INT DEFAULT 0,
  
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  edited_at TIMESTAMP,
  
  UNIQUE (booking_id, reviewer_id)
);

-- Review photos
CREATE TABLE review_photos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  review_id UUID NOT NULL REFERENCES reviews(id) ON DELETE CASCADE,
  url VARCHAR(500) NOT NULL,
  caption TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Review helpful votes
CREATE TABLE review_votes (
  review_id UUID NOT NULL REFERENCES reviews(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id),
  vote_type VARCHAR(10) NOT NULL, -- 'helpful', 'not_helpful'
  created_at TIMESTAMP DEFAULT NOW(),
  PRIMARY KEY (review_id, user_id)
);

-- Review reports
CREATE TABLE review_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  review_id UUID NOT NULL REFERENCES reviews(id),
  reporter_id UUID NOT NULL REFERENCES users(id),
  reason VARCHAR(50) NOT NULL,
  description TEXT,
  status VARCHAR(20) DEFAULT 'pending',
  resolved_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_reviews_property ON reviews(property_id);
CREATE INDEX idx_reviews_reviewer ON reviews(reviewer_id);
CREATE INDEX idx_reviews_reviewee ON reviews(reviewee_id);
CREATE INDEX idx_reviews_published ON reviews(published_at);
```

---

## Future Enhancements

### Phase 7+
- [ ] Video reviews
- [ ] AI-generated review summaries
- [ ] Sentiment analysis
- [ ] Multi-language reviews (auto-translate)
- [ ] Review highlights (AI-extracted key points)
- [ ] Comparison with similar properties
- [ ] Review authenticity verification
- [ ] Review rewards program
- [ ] Review templates for guests
- [ ] Review reminders via SMS
- [ ] Anonymous feedback option (to platform only)
- [ ] Reviewer reputation score

---

**Status**: Specification Phase  
**Target Release**: Phase 6  
**Dependencies**: Booking system, User authentication, Messaging system  
**Priority**: High

