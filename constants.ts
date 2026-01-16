
import { Provider, Activity, User, Comment, Conversation } from './types';

export const mockProviders: Provider[] = [
  {
    id: 'p1',
    name: 'KigaliHikers',
    avatarUrl: 'https://images.unsplash.com/photo-1551632432-c735e7a030be?auto=format&fit=crop&q=80&w=150',
    isVerified: true,
    verificationLevel: 3,
    rating: 4.8,
    following: true,
  },
  {
    id: 'p2',
    name: 'Taste of Rwanda',
    avatarUrl: 'https://images.unsplash.com/photo-1556217477-d32525143809?auto=format&fit=crop&q=80&w=150',
    isVerified: true,
    verificationLevel: 2,
    rating: 4.9,
    following: false,
  },
  {
    id: 'p3',
    name: 'Inema Arts',
    avatarUrl: 'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?auto=format&fit=crop&q=80&w=150',
    isVerified: false,
    verificationLevel: 1,
    rating: 4.5,
    following: true,
  },
  {
    id: 'p4',
    name: 'Kivu Kayaking',
    avatarUrl: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&q=80&w=150',
    isVerified: true,
    verificationLevel: 4,
    rating: 5.0,
    following: false,
  },
  {
    id: 'p5',
    name: 'Gorilla Guardians',
    avatarUrl: 'https://images.unsplash.com/photo-1581497396202-5645e76a3a8e?auto=format&fit=crop&q=80&w=150',
    isVerified: true,
    verificationLevel: 5,
    rating: 4.9,
    following: false,
  }
];

export const mockUsers: User[] = [
  { id: 'u1', name: 'Diane Keza', username: 'diane_k', avatarUrl: 'https://i.pravatar.cc/150?u=u1', isVerified: true, verificationLevel: 2, age: 24, bio: 'Lover of art and Kigali sunsets.', interestIds: ['arts_galleries', 'food_coffee_tasting', 'adv_hiking'], preferredDates: ['weekend-day'] },
  { id: 'u2', name: 'Eric Mugisha', username: 'eric_m', avatarUrl: 'https://i.pravatar.cc/150?u=u2', isVerified: false, verificationLevel: 1, age: 30, bio: 'Weekend warrior. Always hiking.', interestIds: ['adv_hiking', 'adv_camping', 'social_new_friends'], preferredDates: ['weekend-day', 'weekend-evening'] },
  { id: 'u3', name: 'Sonia Umutoni', username: 'sonia_u', avatarUrl: 'https://i.pravatar.cc/150?u=u3', isVerified: true, verificationLevel: 3, age: 27, bio: 'Foodie and digital nomad.', interestIds: ['food_street_tours', 'learn_tech_workshops', 'food_coffee_tasting'], preferredDates: ['weekday-evening'] },
  { id: 'u5', name: 'Patrick Shyaka', username: 'pat_s', avatarUrl: 'https://i.pravatar.cc/150?u=u5', isVerified: true, verificationLevel: 4, age: 26, bio: 'Photography enthusiast.', interestIds: ['arts_photography', 'adv_hiking', 'social_new_friends'], preferredDates: ['weekend-day', 'weekday-evening'] },
  { id: 'u6', name: 'Alice Ishimwe', username: 'alice_ish', avatarUrl: 'https://i.pravatar.cc/150?u=u6', isVerified: false, verificationLevel: 1, age: 23, bio: 'Student at UR. Love exploring.', interestIds: ['food_coffee_tasting', 'arts_photography', 'social_new_friends'], preferredDates: ['any'] },
  { id: 'u7', name: 'Kevin Ganza', username: 'kevin_g', avatarUrl: 'https://i.pravatar.cc/150?u=u7', isVerified: true, verificationLevel: 2, age: 31, bio: 'Tech guy by day, hiker by weekend.', interestIds: ['adv_hiking', 'learn_tech_workshops', 'adv_camping'], preferredDates: ['weekend-day'] },
  { id: 'u8', name: 'Nina Uwase', username: 'nina_u', avatarUrl: 'https://i.pravatar.cc/150?u=u8', isVerified: false, verificationLevel: 1, age: 25, bio: 'Art is life.', interestIds: ['arts_galleries', 'arts_photography', 'food_coffee_tasting'], preferredDates: ['weekend-evening'] },
];

export const currentUser: User = {
    id: 'u4',
    name: 'Chris Kayumba',
    username: 'chris_k',
    avatarUrl: 'https://i.pravatar.cc/150?u=u4',
    isVerified: false,
    verificationLevel: 1,
    interestIds: ['adv_hiking', 'food_coffee_tasting', 'arts_photography', 'social_new_friends'],
    age: 29,
    gender: 'man',
    matchGenderPreference: 'everyone',
    friendIds: ['u1', 'u3', 'u5'],
    preferredDates: ['weekend-day', 'weekday-evening'],
    languages: ['en', 'kiny'],
    activityHistory: { attended: [] },
    viewedActivities: [],
};

export const mockActivities: Activity[] = [
  {
    id: 'a1',
    title: 'Mount Kigali Sunrise Hike',
    description: 'Breathtaking views from the top. We meet at 5:30 AM sharp at the entrance. Don\'t forget your water!',
    provider: mockProviders[0],
    category: 'Hiking',
    location: { 
        name: 'Mount Kigali Entrance', 
        googleMapsUrl: 'https://maps.app.goo.gl/ABC123Example' 
    },
    distance: 5,
    dateTime: 'Sat, 5:30 AM',
    price: { amount: 5000, currency: 'RWF' },
    interestedCount: 42,
    matchCount: 8,
    groupSize: { min: 2, max: 15 },
    images: ['https://images.unsplash.com/photo-1551632432-c735e7a030be?auto=format&fit=crop&q=80&w=600'],
    interestIds: ['adv_hiking', 'adv_sunrise_hikes'],
    createdAt: Date.now() - 86400000,
    comments: [
        {
            id: 'c1',
            user: mockUsers[0],
            text: 'I\'ll be there with my camera! 📸',
            timestamp: '1h ago',
            replies: [],
            location: { name: 'Kigali Heights Pick-up', googleMapsUrl: 'https://maps.app.goo.gl/kigaliheights' }
        }
    ]
  },
  {
    id: 'a2',
    title: 'Imigongo Art Workshop',
    description: 'Learn the ancient art of cow dung painting. Hands-on experience at Inema Arts Center.',
    provider: mockProviders[2],
    category: 'Arts',
    location: { 
        name: 'Inema Arts Center', 
        googleMapsUrl: 'https://maps.app.goo.gl/inema_arts' 
    },
    distance: 1.2,
    dateTime: 'Sunday, 2:00 PM',
    price: { amount: 15000, currency: 'RWF' },
    interestedCount: 15,
    matchCount: 2,
    groupSize: { min: 1, max: 8 },
    images: ['https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?auto=format&fit=crop&q=80&w=600'],
    interestIds: ['arts_galleries', 'arts_traditional_crafts'],
    createdAt: Date.now() - 3600000,
  },
  {
    id: 'a3',
    title: 'Specialty Coffee Tasting',
    description: 'Join us for a deep dive into Rwandan coffee beans and brewing techniques.',
    provider: mockProviders[1],
    category: 'Food',
    location: { 
        name: 'Question Coffee Cafe', 
        googleMapsUrl: 'https://maps.app.goo.gl/qcoffee' 
    },
    distance: 2.5,
    dateTime: 'Friday, 4:00 PM',
    price: { amount: 8000, currency: 'RWF' },
    interestedCount: 28,
    matchCount: 5,
    groupSize: { min: 2, max: 10 },
    images: ['https://images.unsplash.com/photo-1559496417-e7f25cb247f3?auto=format&fit=crop&q=80&w=600'],
    interestIds: ['food_coffee_tasting', 'social_new_friends'],
    createdAt: Date.now() - 172800000,
    isTimeSensitive: true, // Happening Now test
  },
  {
    id: 'a4',
    title: 'Kivu Sunset Kayaking',
    description: 'Explore Lake Kivu at the most magical time of day. Open to all skill levels.',
    provider: mockProviders[3],
    category: 'Adventure',
    location: { 
        name: 'Gisenyi Waterfront', 
        googleMapsUrl: 'https://maps.app.goo.gl/kivu_waterfront' 
    },
    distance: 150,
    dateTime: 'Daily, 5:00 PM',
    price: { amount: 12000, currency: 'RWF' },
    interestedCount: 35,
    matchCount: 4,
    groupSize: { min: 1, max: 20 },
    images: ['https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&q=80&w=600'],
    interestIds: ['adv_kayaking', 'adv_sunset_trails'],
    createdAt: Date.now() - 43200000,
    isTimeSensitive: true,
  },
  {
    id: 'a5',
    title: 'Friday Night Afrobeat Mix',
    description: 'The best Afrobeats in town. Bring your energy!',
    provider: mockProviders[4],
    category: 'Nightlife',
    location: { 
        name: 'Pili Pili Rooftop', 
        googleMapsUrl: 'https://maps.app.goo.gl/pilipili' 
    },
    distance: 3.8,
    dateTime: 'Tonight, 9:00 PM',
    price: { amount: 0, currency: 'RWF' },
    interestedCount: 120,
    matchCount: 15,
    groupSize: { min: 1, max: 100 },
    images: ['https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&q=80&w=600'],
    interestIds: ['night_afrobeat', 'night_club_nights', 'social_new_friends'],
    createdAt: Date.now(),
    isTimeSensitive: true,
  },
  {
    id: 'a6',
    title: 'Urban Photo Walk',
    description: 'Capture the soul of Nyamirambo with fellow photographers.',
    provider: mockProviders[2],
    category: 'Arts',
    location: { 
        name: 'Nyamirambo Market', 
        googleMapsUrl: 'https://maps.app.goo.gl/nyamirambo' 
    },
    distance: 4.1,
    dateTime: 'Tomorrow, 3:00 PM',
    price: { amount: 2000, currency: 'RWF' },
    interestedCount: 18,
    matchCount: 3,
    groupSize: { min: 2, max: 10 },
    images: ['https://images.unsplash.com/photo-1551285838-a9722f442dd5?auto=format&fit=crop&q=80&w=600'],
    interestIds: ['arts_photography', 'exp_urban_exploring', 'social_new_friends'],
    createdAt: Date.now() - 100000,
  }
];

export const mockActivitiesTrending = [mockActivities[4], mockActivities[0], mockActivities[5]];
export const mockPopularActivities = mockActivities;
export const mockActivitiesForYou = mockActivities;

export const mockFriends = mockUsers;

// Users interested in a specific activity for matching tests (a1 - Hike)
export const mockUsersInterestedInActivity = [
    mockUsers[0], // Diane (Hiking, Coffee)
    mockUsers[1], // Eric (Hiking, Camping)
    mockUsers[3], // Patrick (Photo, Hiking)
    mockUsers[5], // Kevin (Hiking, Tech)
];

export const mockConversations: Conversation[] = [
    {
        id: 'conv1',
        participants: [currentUser, mockProviders[0]],
        unreadCount: 1,
        messages: [
            { 
                id: 'm0', 
                senderId: currentUser.id, 
                text: 'Hey! Is the hike still on for Saturday morning?', 
                timestamp: Date.now() - 3600000, 
                status: 'read' 
            },
            { 
                id: 'm1', 
                senderId: 'p1', 
                text: 'Yes, Chris! We meet at 5:30 AM. See you at the trailhead!', 
                timestamp: Date.now() - 1800000, 
                status: 'delivered',
                location: { name: 'Meeting Point (Gate)', googleMapsUrl: 'https://maps.app.goo.gl/trailhead' }
            },
        ]
    },
    {
        id: 'conv2',
        participants: [currentUser, mockUsers[0]],
        unreadCount: 0,
        messages: [
            { 
                id: 'm2', 
                senderId: 'u1', 
                text: 'Are you bringing your drone for the photo walk?', 
                timestamp: Date.now() - 7200000, 
                status: 'read' 
            },
            { 
                id: 'm3', 
                senderId: currentUser.id, 
                text: 'For sure! Can\'t wait to get some aerial shots of Kigali.', 
                timestamp: Date.now() - 3600000, 
                status: 'read' 
            },
        ]
    },
    {
        id: 'conv3',
        participants: [currentUser, mockUsers[2]],
        unreadCount: 2,
        messages: [
            { 
                id: 'm4', 
                senderId: 'u3', 
                text: 'Hey! Found this amazing tech meetup next week.', 
                timestamp: Date.now() - 500000, 
                status: 'delivered' 
            },
            { 
                id: 'm5', 
                senderId: 'u3', 
                text: 'Think you might be interested?', 
                timestamp: Date.now() - 400000, 
                status: 'delivered' 
            },
        ]
    }
];
