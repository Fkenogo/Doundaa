
export type Page = 'welcome' | 'auth' | 'onboarding' | 'discover' | 'matches' | 'messages' | 'interests' | 'profile' | 'createPost' | 'admin';

export interface Location {
  name: string;
  description?: string;
  mapUrl?: string;
  googleMapsUrl?: string;
}

export interface Provider {
  id: string;
  name: string;
  avatarUrl: string;
  isVerified: boolean;
  verificationLevel: number;
  rating: number;
  following: boolean;
}

export interface Activity {
  id: string;
  title: string;
  description?: string;
  provider: Provider;
  category: string;
  location: Location;
  distance: number;
  dateTime: string;
  price: { amount: number; currency: string };
  interestedCount: number;
  matchCount: number;
  groupSize: { min: number; max: number };
  images: string[];
  interestIds: string[];
  isTimeSensitive?: boolean;
  isRecurring?: boolean;
  createdAt: number;
  comments?: Comment[];
}

export interface User {
  id: string;
  name: string;
  username?: string;
  avatarUrl: string;
  bio?: string;
  isVerified: boolean;
  verificationLevel: number;
  interestIds?: string[];
  age?: number;
  gender?: string;
  matchGenderPreference?: string;
  friendIds?: string[];
  preferredDates?: string[];
  languages?: string[];
  matchPreferences?: { ageRange: [number, number] };
  activityHistory?: { attended: { activityId: string; rating: number }[] };
  viewedActivities?: string[];
  discoveryMode?: 'yes' | 'no';
}

export interface Comment {
  id: string;
  user: User;
  text: string;
  timestamp: string;
  replies: Comment[];
  attachment?: { type: 'image' | 'video'; url: string };
  location?: Location;
}

export interface Message {
  id: string;
  senderId: string;
  text: string;
  timestamp: number;
  status: 'sent' | 'delivered' | 'read';
  location?: Location;
}

export interface Conversation {
  id: string;
  participants: (User | Provider)[];
  unreadCount: number;
  messages: Message[];
}
