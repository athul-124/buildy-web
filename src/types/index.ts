
import type { Timestamp } from 'firebase/firestore';

export type UserRole = 'customer' | 'expert';

// Document stored in the 'users' collection in Firestore
export interface UserDocument {
  uid: string;
  email: string | null;
  name: string;
  phone?: string;
  role: UserRole;
  createdAt: Timestamp;
  address?: string; // Primarily for customers
  // For experts, most details will be in the 'experts' collection
}

// Document stored in the 'experts' collection in Firestore, linked by UID
export interface ExpertProfile {
  uid: string; // Should match the uid in the 'users' collection
  displayName: string; // Can be different from UserDocument.name, e.g., a business name
  bio?: string;
  specialties?: string[]; // Array of service categories they specialize in
  servicesOffered?: string[]; // Specific services
  projectPhotos?: { id: string, url: string, caption: string, dataAiHint: string }[]; // URLs from Firebase Storage
  rating?: number; // Could be an aggregated rating
  reviewCount?: number;
  availability?: Record<string, string[]>; // e.g., { "mon": ["9-12", "3-6"] }
  location?: string; // General area of operation
  avatarUrl?: string; // URL from Firebase Storage
  tags?: string[];
}

// This is the existing Expert type, might need to be merged or reconciled
// with UserDocument + ExpertProfile for display purposes.
export interface Expert {
  id: string; // This would be the UID
  name: string;
  specialty: string;
  rating: number;
  reviewCount: number;
  avatarUrl?: string;
  projectPhotos: { id: string, url: string, caption: string, dataAiHint: string }[];
  bio: string;
  servicesOffered: string[];
  tags?: string[];
  availability?: string | Record<string, string[]>; // Adjusted for new structure
  contact: {
    phone?: string;
    whatsapp?: string;
    email?: string;
  };
  location?: string;
}


export interface Service {
  id: string; // e.g., "electrician-basic-fan-installation"
  name: string; // e.g., "Fan Installation"
  category: string; // e.g., "Electrical"
  description: string;
  basePrice: number;
  priceRange?: [number, number]; // [min, max]
  priceExplanation?: string; // Kept from previous version
  imageUrl?: string;
  dataAiHint?: string;
  expertsAvailable?: number;
}

export interface Booking {
  id: string; // Firestore document ID
  userId: string; // UID of the customer
  expertId: string; // UID of the expert
  serviceId?: string; // ID of the service from the 'services' collection
  serviceName?: string; // Denormalized for quick display
  status: 'pending' | 'accepted' | 'completed' | 'cancelled' | 'rejected';
  scheduledFor: Timestamp;
  notes?: string;
  confirmedOnWhatsApp?: boolean;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  customerName?: string; // Denormalized
  expertName?: string; // Denormalized
  customerPhone?: string; // Denormalized
  expertPhone?: string; // Denormalized
  address?: string; // Booking specific address
}


export interface MaterialTip {
  id:string;
  title: string;
  materialName: string;
  content: string;
  expertName: string;
  expertAvatarUrl?: string;
  mediaType: 'video' | 'audio' | 'text';
  mediaUrl?: string;
  dataAiHint?: string;
}

export interface OnboardingStep {
  id: string;
  title: string;
  description?: string;
  question: string;
  options?: { label: string; value: string; icon?: React.ElementType }[];
  inputType: 'radio' | 'select' | 'text' | 'textarea' | 'checkbox';
  fieldName: string;
  icon?: React.ElementType;
}

export interface OnboardingData {
  serviceNeed?: string;
  problemDescription?: string;
  preferredTime?: string;
  urgency?: 'low' | 'medium' | 'high';
  [key: string]: any;
}
