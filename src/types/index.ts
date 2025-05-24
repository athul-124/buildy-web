
export interface Expert {
  id: string;
  name: string;
  specialty: string;
  rating: number;
  reviewCount: number;
  avatarUrl?: string;
  projectPhotos: { id: string, url: string, caption: string, dataAiHint: string }[];
  bio: string;
  servicesOffered: string[];
  tags?: string[]; // Added for tag-based filtering
  availability?: string; // Could be more complex, e.g., array of time slots
  contact: {
    phone?: string;
    whatsapp?: string;
    email?: string;
  };
  location?: string; // e.g. "Thrissur East"
}

export interface Service {
  id: string;
  name: string;
  description: string;
  category: string; // e.g., "Electrical", "Plumbing"
  basePrice: number;
  priceRange?: { min: number; max: number };
  priceExplanation?: string;
  imageUrl?: string;
  dataAiHint?: string;
  expertsAvailable?: number; // Number of experts offering this service
}

export interface MaterialTip {
  id:string;
  title: string;
  materialName: string;
  content: string;
  expertName: string;
  expertAvatarUrl?: string;
  mediaType: 'video' | 'audio' | 'text';
  mediaUrl?: string; // URL for video/audio, or null for text
  dataAiHint?: string; // for placeholder image if media is visual
}

export interface OnboardingStep {
  id: string;
  title: string;
  description?: string;
  question: string;
  options?: { label: string; value: string; icon?: React.ElementType }[];
  inputType: 'radio' | 'select' | 'text' | 'textarea' | 'checkbox';
  fieldName: string; // field name for react-hook-form
  icon?: React.ElementType; // Icon for the step title in header
}

export interface OnboardingData {
  serviceNeed?: string;
  problemDescription?: string;
  preferredTime?: string;
  urgency?: 'low' | 'medium' | 'high';
  [key: string]: any; // For additional dynamic fields
}

