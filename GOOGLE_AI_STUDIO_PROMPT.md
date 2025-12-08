# Doundaa: Google AI Studio Development Prompt

## Project Overview

**Doundaa** is an innovative activity discovery and matchmaking platform where plans fall into place and people show up. The platform connects users with local activities, experiences, and like-minded people in Rwanda, with a focus on authentic experiences and community building.

**Tagline:** "Where plans fall into place and people show up"

**Target Location:** Rwanda (Kigali and beyond)

## Core Concept

Doundaa solves the problem of:
- Finding authentic local activities and experiences
- Connecting with people who share similar interests
- Overcoming social barriers to trying new things
- Reducing the friction between planning and actually showing up

## Technology Stack

- **Frontend Framework:** React 19.2.1 with TypeScript 5.8.2
- **Build Tool:** Vite 6.2.0
- **Styling:** Tailwind CSS (utility-first classes)
- **Charts/Visualization:** Recharts 2.12.7
- **State Management:** React Hooks (useState, useEffect)
- **Routing:** Custom page-based navigation system

## Project Architecture

### File Structure
```
/home/user/Doundaa/
├── App.tsx                 # Main application component with routing
├── index.tsx              # Entry point
├── types.ts               # TypeScript interfaces and types
├── constants.ts           # Mock data and constants
├── interests.ts           # Interest categories and definitions
├── algorithmConfig.ts     # Matching algorithm configuration
├── metadata.json          # App metadata
├── components/
│   ├── pages/            # Page-level components
│   │   ├── WelcomePage.tsx
│   │   ├── AuthPage.tsx
│   │   ├── OnboardingPage.tsx
│   │   ├── DiscoveryPage.tsx
│   │   ├── MatchesPage.tsx
│   │   ├── InterestsPage.tsx
│   │   ├── ChatPage.tsx
│   │   ├── ProfilePage.tsx
│   │   ├── CreatePostPage.tsx
│   │   └── AdminPage.tsx
│   ├── ActivityCard.tsx   # Activity display card
│   ├── BottomNav.tsx      # Bottom navigation bar
│   ├── Header.tsx         # Top header with logo
│   ├── FilterBar.tsx      # Activity filtering
│   ├── CommentSection.tsx # Comments on activities
│   ├── BookingForm.tsx    # Activity booking
│   ├── InterestTag.tsx    # Interest badges
│   ├── Modal.tsx          # Reusable modal
│   ├── ShareModal.tsx     # Share functionality
│   ├── ReportModal.tsx    # Content reporting
│   ├── OptionsMenu.tsx    # Context menu
│   ├── LocationPickerModal.tsx
│   ├── DirectionsChooserModal.tsx
│   ├── matchingAlgorithm.ts    # User matching logic
│   ├── recommendationEngine.ts # Activity recommendations
│   └── icons.tsx          # Custom SVG icons
├── package.json
├── tsconfig.json
├── vite.config.ts
└── .env.local            # API keys (GEMINI_API_KEY)
```

## Core Data Models

### User Interface
```typescript
interface User {
  id: string;
  name: string;
  username?: string;
  avatarUrl: string;
  bio?: string;
  isVerified?: boolean;
  verificationLevel?: number;
  interestIds?: string[];          // Array of interest IDs
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
    attended: { activityId: string; rating: number }[];
  };
  viewedActivities?: string[];
  discoveryMode?: 'yes' | 'no';    // Whether user appears in matches
}
```

### Activity Interface
```typescript
interface Activity {
  id: string;
  title: string;
  description?: string;
  provider: Provider;
  category: string;
  location: ActivityLocation;
  distance: number;                 // in km
  dateTime: string;
  price: {
    amount: number;
    currency: 'RWF' | 'USD';
  };
  interestedCount: number;
  matchCount: number;               // Number of matched users
  groupSize: {
    min: number;
    max: number;
  };
  images: string[];
  interestIds: string[];            // Related interests
  isTimeSensitive?: boolean;
  isRecurring?: boolean;
  comments?: Comment[];
  createdAt: number;                // Timestamp
}
```

### Provider Interface
```typescript
interface Provider {
  id: string;
  name: string;
  avatarUrl: string;
  isVerified: boolean;
  verificationLevel: number;        // 1-5 scale
  rating: number;                   // 0-5 star rating
  following?: boolean;
}
```

### Interest System

The platform has a comprehensive two-tier interest system:

1. **Main Categories** (10 categories):
   - Adventure Seeker 🏔️
   - Foodie 🍽️
   - Creative Soul 🎨
   - Night Owl 🎶
   - Fitness Enthusiast 💪
   - Lifelong Learner 📚
   - Fun & Games 🎮
   - Wellness Warrior 🧘
   - Explorer ✈️
   - Social Butterfly 🤝

2. **Detailed Interests** (300+ specific interests):
   - Each interest belongs to one or more categories
   - Examples: "Gorilla Trekking", "Coffee Tasting", "Kinyarwanda Learning"
   - Each has an emoji, name, and category associations

## Key Features & User Flows

### 1. Authentication & Onboarding
- **Welcome Screen**: First-time visitors see welcome page
- **Auth Options**: Sign up/login or continue as guest
- **Onboarding Flow**:
  - Profile setup (name, username, bio, avatar)
  - Interest selection (multi-step, category-based)
  - Discovery mode preference
  - Redirects to Discovery page after completion

### 2. Discovery Page (Main Feed)
Four main content sections:
- **For You**: Personalized activity recommendations
- **Nearby**: Location-based activities
- **Trending**: Popular activities
- **Happening Now**: Time-sensitive activities

Features:
- Activity cards with images, provider info, match counts
- Filter bar (categories, price, time, distance)
- Following/bookmark functionality
- Share activities
- Report inappropriate content

### 3. Matching System
The platform matches users based on:
- **Shared Interests**: Common interest IDs
- **Age Compatibility**: Matching age preferences
- **Gender Preferences**: Respecting user preferences
- **Friend Networks**: Common friends boost matches
- **Time Preferences**: Weekday/weekend availability
- **Languages**: Common language speakers
- **Activity History**: Past attendance and ratings
- **Viewed Activities**: Prevents re-showing seen content

Algorithm weights (from algorithmConfig.ts):
- Interest overlap: High weight
- Age compatibility: Medium weight
- Friend connections: Medium-high weight
- Activity history: Medium weight

### 4. Activity Detail View
- Full activity information
- Provider details with verification badge
- Image gallery
- Interested count and match count
- Location with map integration
- Booking form
- Comment section with replies
- Share and report options
- Get directions functionality

### 5. Matches Page
Shows users matched for specific activities:
- Match score percentage
- Shared interests highlighted
- Common friends displayed
- Start conversation button
- Mutual friend indicators

### 6. Messaging System
- Conversation list with unread counts
- Real-time message status (sent/delivered/read)
- Location sharing in messages
- Notification indicators
- Search conversations

### 7. Profile Management
- View own profile
- Edit interests
- View activity history
- Manage bookmarks
- Settings and preferences

### 8. Interests Management
- Browse all interest categories
- Add/remove interests dynamically
- Visual category cards with colors
- Search functionality
- Updates user profile in real-time

### 9. Admin Panel
- User statistics and analytics
- Activity monitoring
- Content moderation tools
- Platform health dashboard
- Uses Recharts for data visualization

## Design System

### Color Palette (from interests.ts)
Each main category has its own color scheme:
- Adventure: Green (#2D9F5E)
- Food: Orange (#FF7F3F)
- Arts: Purple (#8B5CF6)
- Nightlife: Pink (#E91E8C)
- Sports: Red (#EF4444)
- Learning: Blue (#3B82F6)
- Games: Amber (#F59E0B)
- Wellness: Teal (#14B8A6)
- Exploration: Cyan (#06B6D4)
- Social: Rose (#FB7185)

### UI Components
- **Cards**: Rounded corners, shadow effects, hover states
- **Buttons**: Primary (colored), secondary (outlined), icon buttons
- **Navigation**: Bottom tab bar with 4 main tabs + center action
- **Modals**: Overlay dialogs for forms and details
- **Tags**: Pill-shaped badges for interests and categories
- **Avatars**: Circular profile images with verification badges
- **Typography**: Hierarchical text sizing (text-xs to text-2xl)

### Layout Principles
- Mobile-first responsive design
- Fixed header (pt-16) and bottom nav (pb-20)
- Scrollable main content area
- Grid layouts for activity cards (responsive columns)
- Full-screen modals for immersive experiences

## Special Features

### 1. Rwanda-Specific Content
- Local currency support (RWF)
- Rwandan locations (Kigali, Gisenyi, Musanze)
- Local activities (Gorilla trekking, Imigongo art, Lake Kivu)
- Language support (Kinyarwanda, French, English, Swahili)
- Cultural experiences highlighted

### 2. Social Verification System
- Provider verification levels (1-5)
- User verification badges
- Trust indicators throughout UI
- Rating system for providers and activities

### 3. Time-Sensitive Content
- "Happening Now" section
- Time-based activity filtering
- Date/time preferences in matching
- Urgency indicators on activities

### 4. Discovery Mode
- Users can opt in/out of being discovered
- Privacy-respecting matching
- Control over profile visibility

## State Management Pattern

The app uses React's built-in state management:

```typescript
// Main App.tsx state
const [isAuthenticated, setIsAuthenticated] = useState(false);
const [currentUser, setCurrentUser] = useState<User | null>(null);
const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(false);
const [hasSeenWelcome, setHasSeenWelcome] = useState(false);
const [currentPage, setCurrentPage] = useState<Page>('welcome');
const [pageState, setPageState] = useState<object | null>(null);
const [conversations, setConversations] = useState<Conversation[]>(mockConversations);
const [hasUnreadMessages, setHasUnreadMessages] = useState(false);
```

Navigation pattern:
```typescript
const navigate = (page: Page, state?: object) => {
  setCurrentPage(page);
  setPageState(state || null);
};
```

## Mock Data Structure

The app currently uses comprehensive mock data (constants.ts):
- 6 mock providers with varying verification levels
- Multiple mock users with different profiles
- 5+ sample activities across categories
- Pre-populated conversations
- Interest-matched users for activities

## Algorithms

### 1. Recommendation Engine (recommendationEngine.ts)
Ranks activities based on:
- Interest match scores
- Recency of posting
- Geographic proximity
- Friend activity
- Trending signals (high interest counts)

### 2. Matching Algorithm (matchingAlgorithm.ts)
Calculates compatibility between users using:
- Weighted scoring system
- Multi-factor compatibility checks
- Preference filtering
- Social graph analysis

## Pages & Components Detail

### WelcomePage
- Hero section with app description
- "Get Started" CTA
- Visual introduction to platform value

### AuthPage
- Email/password login (mock)
- Sign up option
- "Continue as Guest" button
- Social auth placeholders

### OnboardingPage
Multi-step wizard:
1. Profile setup
2. Interest selection by category
3. Discovery mode preference
4. Confirmation and redirect

### DiscoveryPage
Main content hub:
- Tabbed interface (For You, Nearby, Trending, Happening Now)
- Filter bar at top
- Grid of activity cards
- Guest user prompts for auth

### MatchesPage
- Shows matched users for activities
- Match score calculations
- Common interests display
- Message initiation

### InterestsPage
- Browse all 10 main categories
- Expand to see detailed interests
- Toggle interests on/off
- Visual feedback on selection
- Save changes to profile

### ChatPage
- Conversation list sidebar
- Message thread view
- Send message input
- Read receipts
- Location sharing capability

### ProfilePage
- User info display
- Verification status
- Interest tags
- Activity history
- Edit options

### CreatePostPage
Form for providers to create activities:
- Title, description
- Category selection
- Location picker
- Date/time
- Pricing
- Group size
- Image upload
- Interest tagging

### AdminPage
Dashboard with:
- User metrics
- Activity statistics
- Engagement analytics
- Content moderation queue
- Chart visualizations (Recharts)

## Development Instructions

### For Google AI Studio / Gemini API

When developing or extending Doundaa:

1. **Maintain Type Safety**: Always use TypeScript interfaces from types.ts
2. **Follow React Best Practices**: Functional components with hooks
3. **Preserve Mobile-First Design**: Responsive layouts, touch-friendly UI
4. **Respect the Navigation Pattern**: Use the navigate() function, not routing libraries
5. **Use Mock Data Initially**: Leverage constants.ts for prototyping
6. **Match the Visual Style**: Tailwind utility classes, consistent color palette
7. **Consider Rwanda Context**: Local culture, languages, locations
8. **Implement Social Features**: Matching and messaging are core to the platform
9. **Optimize for Performance**: Lazy loading, efficient re-renders
10. **Add Accessibility**: ARIA labels, keyboard navigation, screen reader support

### API Integration Points (Future)

When connecting to real backend:
- Authentication endpoints
- User profile CRUD
- Activity discovery and search
- Messaging/real-time chat
- Matching algorithm service
- Image upload/storage
- Geolocation services
- Payment processing (for bookings)
- Analytics and tracking

### Environment Variables
```
GEMINI_API_KEY=your_gemini_api_key_here
```

## Common Development Tasks

### Adding a New Interest Category
1. Add category to MAIN_CATEGORIES in interests.ts
2. Create detailed interests for that category
3. Update interest selection UI in OnboardingPage
4. Update color scheme if needed

### Creating a New Page
1. Create component in components/pages/
2. Add page type to Page union in types.ts
3. Add case in renderPage() switch in App.tsx
4. Update navigation to include new page
5. Consider adding to BottomNav if primary destination

### Modifying the Matching Algorithm
1. Edit weights in algorithmConfig.ts
2. Update matching logic in matchingAlgorithm.ts
3. Test with various user profiles
4. Adjust recommendation engine if needed

### Adding a New Feature
1. Plan data model changes (types.ts)
2. Create/modify components
3. Update state management in App.tsx
4. Add navigation if needed
5. Update mock data for testing
6. Consider mobile UX implications

## Key Challenges to Consider

1. **Scalability**: Mock data → real database
2. **Real-time Updates**: Messages, notifications
3. **Geolocation**: Accurate distance calculations
4. **Image Handling**: Upload, compression, CDN
5. **Moderation**: User-generated content safety
6. **Matching Quality**: Algorithm tuning and feedback loops
7. **Performance**: Large lists, infinite scroll
8. **Offline Support**: PWA capabilities
9. **Payment Integration**: Booking transactions
10. **Analytics**: User behavior tracking

## Testing Considerations

- Test authentication flows (login, guest, onboarding)
- Verify matching algorithm with edge cases
- Check responsive design across devices
- Test message delivery and read receipts
- Validate form inputs and error handling
- Ensure accessibility compliance
- Test navigation between all pages
- Verify interest selection/deselection
- Check activity filtering and search

## Deployment Notes

The app is configured to:
- Build with Vite (`npm run build`)
- Preview production build (`npm run preview`)
- Run dev server on `npm run dev`
- Environment variables loaded from .env.local

For production:
- Enable API integrations
- Configure CDN for images
- Set up analytics
- Implement error tracking
- Configure caching strategies
- Set up monitoring/alerting

## Brand Voice & Content Guidelines

- **Friendly & Inclusive**: "Where plans fall into place and people show up"
- **Action-Oriented**: Encourage participation, not just browsing
- **Authentic**: Highlight real experiences, verified providers
- **Community-Focused**: Emphasize connections between people
- **Locally-Rooted**: Celebrate Rwandan culture and experiences

## Future Enhancements

Potential features to add:
- Video content for activities
- Live streaming of events
- Group chat for activities
- Activity reviews and ratings
- Wishlist/favorites
- Calendar integration
- Push notifications
- In-app payments
- Provider dashboard
- Advanced search/filters
- Map view of activities
- Activity recommendations based on weather
- Social sharing to external platforms
- Referral system
- Loyalty rewards
- Multi-language full support

---

## Sample Prompts for Google AI Studio

### For Feature Development
"Add a new feature to Doundaa that allows users to create group activities with their friends. Users should be able to select multiple friends from their friend list, choose an activity, and send group invitations. Include UI components for group creation, invitation management, and group chat."

### For Bug Fixing
"Review the matching algorithm in matchingAlgorithm.ts and identify any edge cases where users might not be matched appropriately despite having shared interests. Fix any issues and add comments explaining the logic."

### For UI Enhancement
"Redesign the ActivityCard component to be more engaging with smooth animations when users hover or tap. Add micro-interactions for the bookmark, share, and interested buttons. Ensure the design remains mobile-friendly and follows the existing color system."

### For Data Integration
"Create API service functions to replace the mock data in constants.ts. Include functions for fetching activities, user profiles, and conversations from a REST API. Add loading states and error handling to all components that use this data."

### For Testing
"Write comprehensive test cases for the user onboarding flow. Include tests for profile creation, interest selection validation, and the redirect to the discovery page after completion."

---

## Current Project Status

- ✅ Core UI implemented
- ✅ Navigation system working
- ✅ Mock data comprehensive
- ✅ Matching algorithm functional
- ✅ Interest system complete
- ✅ Responsive design implemented
- ⏳ Backend integration pending
- ⏳ Real-time messaging pending
- ⏳ Payment integration pending
- ⏳ Analytics integration pending

## Getting Started

1. Clone the repository
2. Run `npm install`
3. Create `.env.local` and add `GEMINI_API_KEY=your_key`
4. Run `npm run dev`
5. Open http://localhost:5173
6. Explore the app starting from the Welcome page

---

**Remember**: Doundaa is about creating authentic connections through shared experiences. Every feature should serve the goal of getting people to show up and experience life together in Rwanda.

Happy coding! 🇷🇼 🎉
