export type UserRole = 'CUSTOMER' | 'INSTRUCTOR' | 'ADMIN' | 'SUPER_ADMIN';

export type YogaStyle = 
  | 'Vinyasa Flow'
  | 'Yin & Sound'
  | 'Ashtanga Primary'
  | 'Restorative & Nidra'
  | 'Hatha Foundation'
  | 'Kundalini & Breathwork'
  | 'Power Vinyasa';

export type DifficultyLevel = 'All Levels' | 'Beginner' | 'Intermediate' | 'Advanced';

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  role: UserRole;
  phone?: string;
  avatarUrl?: string;
  preferences?: {
    experienceLevel?: DifficultyLevel;
    preferredStyles?: YogaStyle[];
    goals?: string[];
  };
  membershipId?: string;
  membershipName?: string;
  remainingCredits?: number;
  createdAt: string;
  accountStatus: 'ACTIVE' | 'SUSPENDED';
}

export interface YogaClass {
  id: string;
  title: string;
  slug: string;
  description: string;
  longDescription?: string;
  style: YogaStyle;
  level: DifficultyLevel;
  durationMinutes: number;
  price: number; // in cents
  currency: string;
  instructorIds: string[];
  imageUrl: string;
  isPublished: boolean;
  benefits: string[];
  whatToBring: string[];
  cancellationPolicyHours: number;
  createdAt: string;
  updatedAt: string;
}

export interface YogaSession {
  id: string;
  classId: string;
  classTitle?: string;
  instructorId: string;
  instructorName?: string;
  instructorAvatar?: string;
  startsAt: string; // ISO 8601
  endsAt: string; // ISO 8601
  timeZone: string;
  location: string;
  room: string;
  capacity: number;
  bookedCount: number;
  price: number; // in cents
  currency: string;
  status: 'SCHEDULED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  createdAt: string;
}

export type BookingStatus = 
  | 'CONFIRMED'
  | 'CANCELLED'
  | 'COMPLETED'
  | 'NO_SHOW'
  | 'WAITLISTED'
  | 'PENDING_PAYMENT';

export interface Booking {
  id: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  sessionId: string;
  classId: string;
  classTitle: string;
  instructorName: string;
  sessionStartsAt: string;
  sessionEndsAt: string;
  bookingReference: string; // e.g., PRN-938210
  status: BookingStatus;
  paymentStatus: 'PAID' | 'COMPLIMENTARY' | 'PENDING' | 'REFUNDED';
  priceSnapshot: number; // in cents
  currency: string;
  idempotencyKey?: string;
  cancellationReason?: string;
  createdAt: string;
  updatedAt: string;
  cancelledAt?: string;
}

export interface Instructor {
  id: string;
  name: string;
  title: string;
  bio: string;
  shortBio: string;
  specialties: YogaStyle[];
  certifications: string[];
  experienceYears: number;
  imageUrl: string;
  isActive: boolean;
  rating: number;
  reviewsCount: number;
}

export interface MembershipPlan {
  id: string;
  name: string;
  description: string;
  price: number; // in cents
  currency: string;
  billingPeriod: 'SINGLE' | 'MONTHLY' | 'ANNUAL' | 'PACK';
  classCredits: number; // 0 for unlimited, or specific number like 1, 5, 10
  isUnlimited: boolean;
  popular?: boolean;
  features: string[];
  terms: string;
  isActive: boolean;
}

export interface StudioSettings {
  studioName: string;
  tagline: string;
  address: string;
  phone: string;
  email: string;
  whatsapp: string;
  businessHours: string;
  defaultTimeZone: string;
  currency: string;
  cancellationWindowHours: number;
  aiAssistantEnabled: boolean;
  aiModelName: string;
  aiSystemInstruction: string;
  announcementBanner?: {
    enabled: boolean;
    message: string;
  };
}

export interface AIRecommendationRequest {
  experienceLevel?: string;
  styles?: string[];
  durationMinutes?: number;
  goals?: string[];
  preferredTimeOfDay?: 'morning' | 'afternoon' | 'evening';
  budgetMax?: number;
}

export interface AIChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  structuredData?: {
    type: 'class_card' | 'session_list' | 'booking_draft';
    data: any;
  };
}
