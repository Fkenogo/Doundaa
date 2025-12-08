import { Provider, Activity, User, Comment, Conversation } from './types';

export const mockProviders: Provider[] = [
  {
    id: 'p1',
    name: 'KigaliHikers',
    avatarUrl: 'https://picsum.photos/seed/kigali-hikers/100/100',
    isVerified: true,
    verificationLevel: 3,
    rating: 4.8,
    following: true,
  },
  {
    id: 'p2',
    name: 'Taste of Rwanda',
    avatarUrl: 'https://picsum.photos/seed/taste-rwanda/100/100',
    isVerified: true,
    verificationLevel: 2,
    rating: 4.9,
    following: false,
  },
  {
    id: 'p3',
    name: 'Inema Arts',
    avatarUrl: 'https://picsum.photos/seed/inema-arts/100/100',
    isVerified: false,
    verificationLevel: 1,
    rating: 4.5,
    following: true,
  },
  {
    id: 'p4',
    name: 'Kivu Kayaking Adventures',
    avatarUrl: 'https://picsum.photos/seed/kivu-kayak/100/100',
    isVerified: true,
    verificationLevel: 4,
    rating: 5.0,
    following: false,
  },
  {
    id: 'p5',
    name: 'Gorilla Guardians',
    avatarUrl: 'https://picsum.photos/seed/gorilla-guard/100/100',
    isVerified: true,
    verificationLevel: 5,
    rating: 4.9,
    following: false,
  },
  {
    id: 'p6',
    name: 'KigaliPottery',
    avatarUrl: 'https://picsum.photos/seed/kigali-pottery/100/100',
    isVerified: false,
    verificationLevel: 1,
    rating: 4.7,
    following: true,
  }
];

const mockUsers: User[] = [
  { id: 'u1', name: 'Alice', avatarUrl: 'https://picsum.photos/seed/user-alice/50/50', isVerified: true, age: 28, gender: 'woman', matchGenderPreference: 'everyone', friendIds: ['u4', 'u2'] },
  { id: 'u2', name: 'Bob', avatarUrl: 'https://picsum.photos/seed/user-bob/50/50', isVerified: false, age: 32, gender: 'man', matchGenderPreference: 'women', friendIds: ['u1'] },
  { id: 'u3', name: 'Charlie', avatarUrl: 'https://picsum.photos/seed/user-charlie/50/50', isVerified: true, age: 25, gender: 'man', matchGenderPreference: 'everyone', friendIds: ['u4'] },
];

export const currentUser: User = {
    id: 'u4',
    name: 'Chris',
    avatarUrl: 'https://picsum.photos/seed/user-avatar/100/100',
    isVerified: false,
    verificationLevel: 1,
    interestIds: [
        'adv_hiking', 'adv_sunrise_hikes', 'adv_safaris', 'food_coffee_tasting',
        'food_street_tours', 'arts_photography', 'arts_galleries', 'night_rooftop',
        'exp_hidden_gems', 'social_new_friends', 'well_mindfulness'
    ],
    age: 29,
    gender: 'man',
    matchGenderPreference: 'everyone',
    friendIds: ['u1', 'u3'],
    preferredDates: ['weekend-day', 'weekday-evening'],
    languages: ['en', 'kiny'],
    matchPreferences: { ageRange: [24, 35] },
    activityHistory: { attended: [{activityId: 'a2', rating: 5}, {activityId: 'a6', rating: 4}] },
    viewedActivities: ['a3', 'a5'],
};

export const mockFriends: User[] = [
  mockUsers[0],
  mockUsers[2],
  { id: 'u5', name: 'David', avatarUrl: 'https://picsum.photos/seed/user-david/50/50', isVerified: false, age: 35, gender: 'man', matchGenderPreference: 'women', friendIds: [] },
  { id: 'u6', name: 'Eve', avatarUrl: 'https://picsum.photos/seed/user-eve/50/50', isVerified: true, age: 26, gender: 'woman', matchGenderPreference: 'men', friendIds: [] },
];

export const mockUsersInterestedInActivity: User[] = [
    { ...mockUsers[0], interestIds: ['adv_hiking', 'adv_sunrise_hikes', 'adv_walks', 'arts_photo', 'food_coffee_tasting'], preferredDates: ['weekend-day'], languages: ['en', 'fr'], matchPreferences: { ageRange: [25, 35] }, activityHistory: { attended: [{activityId: 'a3', rating: 5}, {activityId: 'a4', rating: 4}] } },
    { ...mockUsers[2], interestIds: ['adv_hiking', 'adv_camping', 'social_new_friends', 'games_board', 'night_rooftop'], preferredDates: ['weekend-day', 'weekend-evening'], languages: ['en'], matchPreferences: { ageRange: [22, 30] }, activityHistory: { attended: [{activityId: 'a5', rating: 5}] } },
    { ...mockFriends[1], interestIds: ['adv_hiking', 'adv_sunrise_hikes', 'well_mindfulness', 'sports_yoga', 'food_healthy_eating'], preferredDates: ['any'], languages: ['en', 'kiny'], matchPreferences: { ageRange: [25, 40] }, activityHistory: { attended: [{activityId: 'a6', rating: 3}] } },
    { ...mockFriends[0], interestIds: ['adv_climbing', 'sports_running', 'food_restaurants', 'night_club_nights'], preferredDates: ['weekday-evening'], languages: ['en'], matchPreferences: { ageRange: [30, 40] }, activityHistory: { attended: [{activityId: 'a4', rating: 5}] } },
    { id: 'u7', name: 'Frank', avatarUrl: 'https://picsum.photos/seed/user-frank/50/50', isVerified: false, age: 31, gender: 'man', matchGenderPreference: 'everyone', friendIds: [], interestIds: ['adv_hiking', 'adv_safaris', 'arts_photography', 'exp_national_parks'], preferredDates: ['weekend-day'], languages: ['en', 'sw'], matchPreferences: { ageRange: [28, 38] }, activityHistory: { attended: [{activityId: 'a5', rating: 4}]} },
    { id: 'u8', name: 'Grace', avatarUrl: 'https://picsum.photos/seed/user-grace/50/50', isVerified: true, age: 27, gender: 'woman', matchGenderPreference: 'everyone', friendIds: ['u1'], interestIds: ['adv_hiking', 'adv_sunrise_hikes', 'adv_walks', 'arts_photo_walks', 'social_coffee_meetups'], preferredDates: ['weekend-day', 'weekday-evening'], languages: ['en', 'fr', 'kiny'], matchPreferences: { ageRange: [25, 32] }, activityHistory: { attended: [{activityId: 'a2', rating: 5}] } },
];

export const allMockUsers = [currentUser, ...mockUsersInterestedInActivity];

const ONE_DAY_MS = 1000 * 60 * 60 * 24;

export const mockActivitiesForYou: Activity[] = [
  {
    id: 'a1',
    title: 'Mount Kigali Sunrise Hike',
    description: 'Join us for a breathtaking sunrise hike up Mount Kigali! This is a beginner-friendly trail that offers stunning panoramic views of the city. We will provide water and a light snack at the summit. Don\'t forget your camera!',
    provider: mockProviders[0],
    category: 'Hiking',
    location: { name: 'Mount Kigali', description: 'Meet at the trailhead parking lot' },
    distance: 5,
    dateTime: 'Saturday, 5:30 AM',
    price: { amount: 5000, currency: 'RWF' },
    interestedCount: 24,
    matchCount: 3,
    groupSize: { min: 2, max: 8 },
    images: [
      'https://picsum.photos/seed/mt-kigali-1/600/400',
      'https://picsum.photos/seed/mt-kigali-2/600/400',
      'https://picsum.photos/seed/mt-kigali-3/600/400',
    ],
    interestIds: ['adv_hiking', 'adv_sunrise_hikes', 'adv_walks', 'arts_photography'],
    isTimeSensitive: true,
    createdAt: Date.now() - ONE_DAY_MS * 10, // 10 days ago
    comments: [
      {
        id: 'c1',
        user: mockUsers[0],
        text: 'This was an amazing experience! The view from the top is breathtaking. Highly recommend it.',
        timestamp: '2d ago',
        replies: [
          {
            id: 'c1r1',
            user: mockUsers[1],
            text: 'I agree! Did you manage to catch the sunrise?',
            timestamp: '1d ago',
            replies: [],
          },
        ],
      },
      {
        id: 'c2',
        user: mockUsers[2],
        text: 'Is this suitable for beginners?',
        timestamp: '5h ago',
        replies: [],
      }
    ]
  },
  {
    id: 'a2',
    title: 'Nyamirambo Walking Food Tour',
    description: 'Explore the vibrant neighborhood of Nyamirambo and taste the best of Rwandan street food. This guided tour will take you to local markets, small eateries, and community centers. Come hungry!',
    provider: mockProviders[1],
    category: 'Food & Drink',
    location: { name: 'Nyamirambo, Kigali', description: 'Starts at Nyamirambo Women\'s Center' },
    distance: 2,
    dateTime: 'This Weekend, 2:00 PM',
    price: { amount: 10000, currency: 'RWF' },
    interestedCount: 42,
    matchCount: 6,
    groupSize: { min: 4, max: 10 },
    images: ['https://picsum.photos/seed/nyamirambo-food/600/400'],
    interestIds: ['food_street_tours', 'food_local_cuisine', 'food_market_exploring', 'exp_urban_exploring'],
    createdAt: Date.now() - ONE_DAY_MS * 5, // 5 days ago
  },
];

export const mockActivitiesNearby: Activity[] = [
    {
    id: 'a3',
    title: 'Traditional Imigongo Art Workshop',
    description: 'Unleash your creativity with a hands-on Imigongo art workshop. Learn the history of this unique Rwandan art form and create your own masterpiece to take home.',
    provider: mockProviders[2],
    category: 'Arts & Culture',
    location: { name: 'Inema Arts Center, Kacyiru', description: 'Located in the main gallery' },
    distance: 1.5,
    dateTime: 'Tuesdays & Thursdays',
    price: { amount: 15, currency: 'USD' },
    interestedCount: 15,
    matchCount: 0,
    groupSize: { min: 1, max: 6 },
    images: ['https://picsum.photos/seed/imigongo-art/600/400'],
    interestIds: ['arts_craft_making', 'arts_traditional_crafts', 'arts_painting_classes', 'learn_tech_workshops'],
    isRecurring: true,
    createdAt: Date.now() - ONE_DAY_MS * 30, // 30 days ago
  },
  {
    id: 'a6',
    title: 'Beginner\'s Pottery Class',
    provider: mockProviders[5],
    category: 'Crafts',
    location: { name: 'Kigali Pottery, Gaculiro', description: 'Our studio is behind the main shop' },
    distance: 3,
    dateTime: 'Saturday, 10:00 AM',
    price: { amount: 20000, currency: 'RWF' },
    interestedCount: 31,
    matchCount: 4,
    groupSize: { min: 3, max: 8 },
    images: ['https://picsum.photos/seed/pottery-class/600/400', 'https://picsum.photos/seed/pottery-wheel/600/400'],
    interestIds: ['arts_pottery_workshops', 'arts_craft_making', 'social_new_friends'],
    createdAt: Date.now() - ONE_DAY_MS, // NEW! 1 day ago
  }
];


export const mockActivitiesTrending: Activity[] = [
  {
    id: 'a4',
    title: 'Sunset Kayaking on Lake Kivu',
    provider: mockProviders[3],
    category: 'Adventure',
    location: { name: 'Gisenyi, Lake Kivu', description: 'Find us at the public beach' },
    distance: 150,
    dateTime: 'Daily, 4:00 PM',
    price: { amount: 25, currency: 'USD' },
    interestedCount: 152,
    matchCount: 22,
    groupSize: { min: 2, max: 12 },
    images: [
      'https://picsum.photos/seed/lake-kivu-1/600/400',
      'https://picsum.photos/seed/lake-kivu-2/600/400'
    ],
    interestIds: ['adv_kayaking', 'adv_sunset_trails', 'adv_beach', 'exp_weekend_getaways'],
    createdAt: Date.now() - ONE_DAY_MS * 14, // 14 days ago
  },
  {
    id: 'a5',
    title: 'Volcanoes National Park Gorilla Trek',
    provider: mockProviders[4],
    category: 'Wildlife',
    location: { name: 'Musanze, Northern Province', description: 'Check-in at the park headquarters' },
    distance: 120,
    dateTime: 'Book in Advance',
    price: { amount: 1500, currency: 'USD' },
    interestedCount: 230,
    matchCount: 45,
    groupSize: { min: 1, max: 8 },
    images: ['https://picsum.photos/seed/gorilla-trek/600/400', 'https://picsum.photos/seed/silverback/600/400'],
    interestIds: ['adv_gorilla_trekking', 'adv_safaris', 'adv_conservation', 'exp_national_parks'],
    createdAt: Date.now() - ONE_DAY_MS * 60, // 60 days ago
  }
];

export const mockActivitiesHappeningNow: Activity[] = [
    {
    id: 'a1', // Re-using an ID for demo purposes, in real app this would be unique or handled differently
    title: 'Mount Kigali Sunrise Hike',
    description: 'Join us for a breathtaking sunrise hike up Mount Kigali! This is a beginner-friendly trail that offers stunning panoramic views of the city. We will provide water and a light snack at the summit. Don\'t forget your camera!',
    provider: mockProviders[0],
    category: 'Hiking',
    location: { name: 'Mount Kigali', description: 'Meet at the trailhead parking lot' },
    distance: 5,
    dateTime: 'Saturday, 5:30 AM',
    price: { amount: 5000, currency: 'RWF' },
    interestedCount: 24,
    matchCount: 3,
    groupSize: { min: 2, max: 8 },
    images: [
      'https://picsum.photos/seed/mt-kigali-1/600/400',
      'https://picsum.photos/seed/mt-kigali-2/600/400',
      'https://picsum.photos/seed/mt-kigali-3/600/400',
    ],
    interestIds: ['adv_hiking', 'adv_sunrise_hikes', 'adv_walks', 'arts_photography'],
    isTimeSensitive: true,
    createdAt: Date.now() - ONE_DAY_MS * 10,
  },
];

export const mockActivities = [...mockActivitiesForYou, ...mockActivitiesNearby, ...mockActivitiesTrending, ...mockActivitiesHappeningNow];

export const mockPopularActivities = [...mockActivities].sort((a, b) => b.interestedCount - a.interestedCount);


export const mockConversations: Conversation[] = [
    {
        id: 'conv1',
        participants: [currentUser, mockProviders[0]],
        unreadCount: 2,
        messages: [
            { id: 'm1', senderId: 'u4', text: 'Hey! Super excited about the hike. Is there anything specific I should bring?', timestamp: Date.now() - 1000 * 60 * 60 * 24, status: 'read' },
            { id: 'm2', senderId: 'p1', text: 'Hi there! Glad to have you. Just bring comfortable shoes, a water bottle, and your camera. We will handle the rest!', timestamp: Date.now() - 1000 * 60 * 60 * 23, status: 'read' },
            { id: 'm3', senderId: 'p1', text: 'The view is going to be amazing.', timestamp: Date.now() - 1000 * 60 * 5, status: 'delivered' },
            { id: 'm4', senderId: 'p1', text: 'Let me know if you have other questions.', timestamp: Date.now() - 1000 * 60 * 4, status: 'delivered' },
        ]
    },
    {
        id: 'conv2',
        participants: [currentUser, mockProviders[1]],
        unreadCount: 0,
        messages: [
            { id: 'm5', senderId: 'u4', text: 'Is the food tour suitable for vegetarians?', timestamp: Date.now() - 1000 * 60 * 60 * 48, status: 'read' },
            { id: 'm6', senderId: 'p1', text: 'Absolutely! We have plenty of delicious vegetarian options at every stop. You will love it.', timestamp: Date.now() - 1000 * 60 * 60 * 47, status: 'read' },
        ]
    },
    {
        id: 'conv3',
        participants: [currentUser, mockProviders[2]],
        unreadCount: 0,
        messages: [
            { id: 'm7', senderId: 'p2', text: 'Thanks for your interest in the art workshop!', timestamp: Date.now() - 1000 * 60 * 60 * 72, status: 'read' },
        ]
    }
];