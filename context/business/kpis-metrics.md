# KPIs & Metrics - FincAirbnb

## Overview

This document defines the key performance indicators (KPIs) and metrics used to measure FincAirbnb's business health, growth, and success. Metrics are organized by category and priority.

---

## 📊 North Star Metric

### Monthly Recurring Revenue (MRR)
**Definition**: Total subscription revenue per month

**Why it matters**: As a subscription-based business, MRR is the primary indicator of business health and growth.

**Target**:
- Month 3: €1,500
- Month 6: €5,000
- Month 12: €20,000
- Month 24: €60,000

**Formula**: 
```
MRR = Σ (Active Subscriptions × Monthly Price)
```

---

## 💰 Revenue Metrics

### 1. Annual Recurring Revenue (ARR)
**Definition**: MRR × 12

**Target**: €240,000 by Year 1 end

**Calculation**:
```
ARR = MRR × 12
```

### 2. Average Revenue Per User (ARPU)
**Definition**: Average monthly revenue per paying customer

**Target**: €50/month (blended across all tiers)

**Formula**:
```
ARPU = Total MRR / Total Active Subscribers
```

**Tracking by Tier**:
- Basic: €29/month
- Professional: €79/month
- Enterprise: €199/month

### 3. Customer Lifetime Value (LTV)
**Definition**: Average revenue generated per customer over their lifetime

**Target**: €1,200 (24-month lifetime)

**Formula**:
```
LTV = ARPU × Average Customer Lifetime (months)
```

**Benchmark**: LTV should be at least 3x CAC (ideally 5x+)

### 4. Revenue Growth Rate
**Definition**: Month-over-month MRR growth percentage

**Target**: 15-20% monthly in first year

**Formula**:
```
Growth Rate = ((MRR this month - MRR last month) / MRR last month) × 100
```

### 5. Net Revenue Retention (NRR)
**Definition**: Revenue retention including upgrades and downgrades

**Target**: >100% (expansion revenue exceeds churn)

**Formula**:
```
NRR = ((Starting MRR + Expansion - Contraction - Churn) / Starting MRR) × 100
```

---

## 👥 User Acquisition Metrics

### 6. Total Active Property Owners
**Definition**: Number of paying subscribers

**Target**:
- Month 3: 50
- Month 6: 150
- Month 12: 400
- Month 24: 1,000

**Segmentation**:
- By plan tier (Basic, Professional, Enterprise)
- By property count
- By geography (Galicia regions)

### 7. Customer Acquisition Cost (CAC)
**Definition**: Average cost to acquire one paying customer

**Target**: €100 per property owner

**Formula**:
```
CAC = Total Sales & Marketing Spend / New Customers Acquired
```

**Tracking by Channel**:
- Organic (SEO, content): €50
- Paid advertising: €150
- Referrals: €25
- Events/partnerships: €75

### 8. CAC Payback Period
**Definition**: Time to recover customer acquisition cost

**Target**: 2 months

**Formula**:
```
Payback Period = CAC / (ARPU - Cost to Serve)
```

### 9. LTV:CAC Ratio
**Definition**: Ratio of lifetime value to customer acquisition cost

**Target**: 12:1 (minimum 3:1)

**Formula**:
```
LTV:CAC = Customer Lifetime Value / Customer Acquisition Cost
```

### 10. Conversion Rate (Visitor to Subscriber)
**Definition**: Percentage of website visitors who become paying customers

**Target**: 2-5%

**Funnel**:
- Website visitor → Sign-up: 10%
- Sign-up → Free trial: 50%
- Free trial → Paid: 40%
- **Overall**: 2%

---

## 🔄 Retention & Engagement Metrics

### 11. Monthly Churn Rate
**Definition**: Percentage of customers who cancel per month

**Target**: <5% monthly

**Formula**:
```
Churn Rate = (Customers Lost / Total Customers at Start) × 100
```

**Types of Churn**:
- **Customer churn**: Lost customers
- **Revenue churn**: Lost MRR

### 12. Retention Rate
**Definition**: Percentage of customers retained over time

**Target**: >95% monthly, >70% at 12 months

**Formula**:
```
Retention Rate = ((Customers at End - New Customers) / Customers at Start) × 100
```

### 13. Active Property Listings
**Definition**: Number of properties actively listed on platform

**Target**: 70% of subscribed properties actively listed

**Formula**:
```
Active Listing Rate = (Active Listings / Total Possible Listings) × 100
```

**Why it matters**: Indicates platform utility and engagement

### 14. Average Bookings per Property
**Definition**: Average number of bookings per property per month

**Target**: 2-3 bookings/month (Phase 3+)

**Formula**:
```
Avg Bookings = Total Bookings / Active Properties
```

### 15. Daily Active Users (DAU) / Monthly Active Users (MAU)
**Definition**: Unique users who log in

**Target**: 
- DAU: 15% of total users
- MAU: 60% of total users

**Stickiness Ratio**: DAU/MAU = 25%

---

## 📈 Growth Metrics

### 16. Sign-up Rate
**Definition**: New account registrations per day/week/month

**Target**: 
- Month 1-3: 20/month
- Month 4-6: 60/month
- Month 7-12: 120/month

### 17. Activation Rate
**Definition**: Percentage of sign-ups who complete first property listing

**Target**: 60%

**Formula**:
```
Activation Rate = (Users Who List Property / Total Sign-ups) × 100
```

### 18. Time to First Listing
**Definition**: Average time from sign-up to first property listed

**Target**: <24 hours

**Why it matters**: Faster activation = higher retention

### 19. Viral Coefficient
**Definition**: Number of new users acquired through referrals per existing user

**Target**: 0.5+ (Phase 2)

**Formula**:
```
Viral Coefficient = (Invites Sent × Conversion Rate) / Inviting User
```

### 20. Net Promoter Score (NPS)
**Definition**: Likelihood users would recommend FincAirbnb

**Target**: >50 (excellent), >30 (good)

**Scale**: -100 to +100

**Calculation**:
- Promoters (9-10): Happy customers
- Passives (7-8): Satisfied but not enthusiastic
- Detractors (0-6): Unhappy customers

```
NPS = % Promoters - % Detractors
```

---

## 💻 Product & Technical Metrics

### 21. Platform Uptime
**Definition**: Percentage of time platform is operational

**Target**: 99.9% (no more than 43 minutes downtime/month)

**Monitoring**: Real-time uptime monitoring

### 22. Page Load Time
**Definition**: Average time for pages to load

**Target**: <2 seconds

**Measure**: Google PageSpeed Insights, Lighthouse scores

### 23. Mobile vs Desktop Usage
**Definition**: Percentage of traffic by device type

**Expected**:
- Mobile: 60-70%
- Desktop: 30-40%

**Why it matters**: Prioritize mobile experience

### 24. Feature Adoption Rate
**Definition**: Percentage of users using specific features

**Key Features to Track**:
- Calendar management: 90%+
- Booking acceptance: 85%+
- Analytics dashboard: 60%+
- Mobile app usage: 40%+ (when available)

### 25. Error Rate
**Definition**: Percentage of sessions with errors

**Target**: <1%

**Types**:
- JavaScript errors
- Failed API calls
- Payment failures

---

## 👤 User Satisfaction Metrics

### 26. Customer Satisfaction Score (CSAT)
**Definition**: User satisfaction with specific interactions

**Target**: >4.5/5.0

**Measured after**:
- Onboarding completion
- Support interactions
- Key feature usage

**Question**: "How satisfied are you with [feature/interaction]?"

### 27. Customer Effort Score (CES)
**Definition**: Ease of completing tasks

**Target**: <2/7 (very easy)

**Question**: "How easy was it to [complete task]?"

**Scale**: 1 (very easy) to 7 (very difficult)

### 28. Support Ticket Volume
**Definition**: Number of support requests per month

**Target**: <10% of active users need support/month

**Tracking**:
- By category (technical, billing, how-to)
- By resolution time
- By satisfaction rating

### 29. First Response Time
**Definition**: Time to first support response

**Target**: <2 hours (business hours)

### 30. Resolution Time
**Definition**: Time to fully resolve support issue

**Target**: <24 hours (80% of tickets)

---

## 🎯 Business Health Dashboard

### Weekly Metrics Review
- New sign-ups
- New paying customers
- MRR change
- Churn (customers + revenue)
- Active listings
- Top cancellation reasons

### Monthly Metrics Review
- All revenue metrics
- Customer acquisition and retention
- Product usage metrics
- Support metrics
- NPS survey results

### Quarterly Business Review
- OKR progress
- Cohort analysis
- Unit economics
- Competitive analysis
- Strategic adjustments

---

## 📊 Metrics by Development Phase

### Phase 1: Authentication & Dashboard (Current)
**Focus**:
- Sign-up rate
- Activation rate (profile completion)
- Daily active users
- Platform uptime

### Phase 2: Property Listings
**Focus**:
- Time to first listing
- Active property listings
- Listing completion rate
- Photo upload rate

### Phase 3: Booking System
**Focus**:
- Bookings per property
- Booking conversion rate
- Cancellation rate
- Revenue per booking

### Phase 4: Payment Integration
**Focus**:
- Payment success rate
- Subscription conversion rate
- MRR
- Churn rate

---

## 🎨 Cohort Analysis

### Monthly Cohorts
Track each month's new users:
- Retention at 1, 3, 6, 12 months
- Revenue contribution over time
- Feature adoption patterns
- Churn reasons

### Subscription Tier Cohorts
Compare behavior by plan:
- Retention by tier
- Upgrade/downgrade patterns
- Feature usage differences
- Support needs

---

## 🚨 Alert Thresholds

### Critical Alerts (Immediate Action)
- Platform uptime <99%
- Churn rate >10% in any month
- Payment processing failure rate >5%
- NPS drops below 0

### Warning Alerts (Monitor Closely)
- Churn rate 5-10%
- CAC payback period >4 months
- Activation rate <40%
- Support tickets increasing >20% MoM

---

## 📈 Reporting Structure

### Daily Dashboard (Internal Team)
- Active users
- New sign-ups
- Revenue (MRR)
- Critical errors
- Platform uptime

### Weekly Report (Team)
- Sign-ups and conversions
- New paying customers
- Churn events
- Top support issues
- Feature usage highlights

### Monthly Report (Stakeholders)
- MRR and growth rate
- Customer acquisition and retention
- Key product metrics
- NPS results
- Strategic insights

---

## 🎯 Success Criteria by Milestone

### Milestone 1 Success (Auth & Dashboard)
- [ ] 50+ registered users
- [ ] 90% uptime
- [ ] <2s page load time
- [ ] 0 critical bugs

### Milestone 2 Success (Property Listings)
- [ ] 100+ property listings
- [ ] 70% activation rate
- [ ] <24h time to first listing

### Milestone 3 Success (Booking System)
- [ ] 500+ bookings processed
- [ ] 90% booking success rate
- [ ] <5% cancellation rate

---

## 🔍 Data Collection & Tools

### Analytics Stack (Planned)
- **Google Analytics**: Web traffic, user behavior
- **Mixpanel/PostHog**: Product analytics, funnels
- **Stripe**: Subscription and revenue metrics
- **Zendesk/Intercom**: Support metrics
- **Custom Dashboard**: Business-specific KPIs

### Privacy & Compliance
- GDPR compliant
- Cookie consent
- Data anonymization
- User data export/deletion

---

**Last Updated**: October 2024  
**Next Review**: Monthly  
**Owner**: Product & Growth Team

