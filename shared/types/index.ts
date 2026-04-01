/**
 * Shared Types - FincAirbnb
 * 
 * Index de todos los tipos compartidos
 * Exporta todos los tipos para fácil importación
 */

// User types
export type {
  User,
  UserRole,
  RegisterData,
  LoginData,
  AuthResponse,
  UpdateProfileData,
  NotificationSettings,
  SubscriptionStatus,
  SubscriptionPlan,
} from './user';

// Property types
export type {
  Property,
  PropertyType,
  PropertyStatus,
  PricingType,
  CancellationPolicy,
  Location,
  PropertySize,
  Amenities,
  Pricing,
  Photo,
  HouseRules,
  PropertyFilters,
  CreatePropertyData,
  PropertySearchResult,
} from './property';

// Booking types
export type {
  Booking,
  BookingStatus,
  PaymentStatus,
  GuestDetails,
  PricingBreakdown,
  CancellationDetails,
  CreateBookingData,
  CalendarDay,
  BookingFilters,
} from './booking';

// Message types
export type {
  Conversation,
  Message,
  SenderType,
  ConversationStatus,
  ConversationType,
  CreateConversationData,
  MessageTemplate,
  CreateTemplateData,
  TemplateVariables,
} from './message';

// Review types
export type {
  Review,
  ReviewStatus,
  RevieweeType,
  RatingCategories,
  ReviewPhoto,
  ReviewResponse,
  CreateReviewData,
  ReviewStats,
} from './review';

