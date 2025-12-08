export interface Provider {
  id: string;
  name:string;
  avatarUrl: string;
  isVerified: boolean;
  verificationLevel: number;
  rating: number;
  following?: boolean;
}

export interface User {
  id:string;
  name: string;
  username?: string;
  avatarUrl: string;
  bio?: string;
  isVerified?: boolean;
  verificationLevel?: number;
  interestIds?: string[];
  age?: number;
  gender?: 'man' | 'woman' | 'non-binary';
  matchGenderPreference?: 'men' | 'women' | 'everyone';
  friendIds?: string[];
  preferredDates?: Array<'weekday-evening' | 'weekend-day' | 'weekend-evening' | 'any'>;
  languages?: string[];
  matchPreferences?: {
    ageRange?: [number, number];
  };
  activityHistory?: {
    attended: { activityId: string; rating: number }[]; // 1-5 star rating
  }
  viewedActivities?: string[];
  discoveryMode?: 'yes' | 'no';
}

export interface Location {
    name: string;
    mapUrl: string;
}

export interface Comment {
  id: string;
  user: User;
  text: string;
  timestamp: string;
  replies: Comment[];
  attachment?: {
    type: 'image' | 'video';
    url:string;
  };
  location?: Location;
}

export interface ActivityLocation {
    name: string;
    description?: string;
}

export interface Activity {
  id: string;
  title: string;
  description?: string;
  provider: Provider;
  category: string;
  location: ActivityLocation;
  distance: number;
  dateTime: string;
  price: {
    amount: number;
    currency: 'RWF' | 'USD';
  };
  interestedCount: number;
  matchCount: number;
  groupSize: {
    min: number;
    max: number;
  };
  images: string[];
  interestIds: string[];
  isTimeSensitive?: boolean;
  isRecurring?: boolean;
  comments?: Comment[];
  createdAt: number; // Timestamp
}

export type MessageStatus = 'sent' | 'delivered' | 'read';

export interface Message {
  id: string;
  senderId: string;
  text: string;
  timestamp: number;
  status: MessageStatus;
  location?: Location;
}

export interface Conversation {
  id: string;
  participants: User[];
  messages: Message[];
  unreadCount: number;
}

export type Page = 'welcome' | 'discover' | 'matches' | 'interests' | 'profile' | 'createPost' | 'messages' | 'auth' | 'onboarding' | 'admin';