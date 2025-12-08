# DOUNDAA - Comprehensive Bolt.new Rebuild Prompt

## Project Overview
Build **Doundaa**, a social activity discovery and matchmaking platform for Rwanda (Kigali region). Doundaa connects people through shared interests and helps them form compatible groups (2-8 people) for local activities. The platform enables verified providers to list activities while using intelligent algorithms to match users based on interests, preferences, and social connections.

---

## CRITICAL REQUIREMENTS FOR BOLT.NEW

### Technology Stack
**Frontend:**
- React 18+ with TypeScript
- Vite as build tool
- TailwindCSS for styling
- Recharts for data visualization
- React Router for navigation

**Backend (MUST IMPLEMENT):**
- Node.js with Express.js or Next.js API routes
- PostgreSQL database (use Supabase, Railway, or similar)
- Prisma ORM for database operations
- JWT authentication with bcrypt for passwords
- Socket.io for real-time messaging
- Firebase Cloud Storage or AWS S3 for image uploads
- Redis for caching (optional but recommended)

**External Services:**
- Mapbox or Google Maps API for location services
- Twilio or Firebase for SMS notifications
- Email service (SendGrid or Resend)
- Payment integration: Stripe or Flutterwave (for Rwandan market)

---

## DATABASE SCHEMA

### Users Table
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  phone VARCHAR(20) UNIQUE,
  name VARCHAR(100) NOT NULL,
  username VARCHAR(50) UNIQUE NOT NULL,
  avatar_url TEXT,
  bio TEXT,
  is_verified BOOLEAN DEFAULT FALSE,
  verification_level INTEGER DEFAULT 1, -- 1-5 for providers
  age INTEGER,
  gender VARCHAR(20), -- 'man', 'woman', 'non-binary'
  match_gender_preference VARCHAR(20), -- 'men', 'women', 'everyone'
  languages JSONB DEFAULT '["en"]', -- ['en', 'kiny', 'fr', 'sw']
  preferred_dates JSONB, -- ['weekday-evening', 'weekend-day', etc.]
  discovery_mode VARCHAR(10) DEFAULT 'yes', -- 'yes' or 'no'
  location_lat DECIMAL(10, 8),
  location_lng DECIMAL(11, 8),
  location_permission BOOLEAN DEFAULT FALSE,
  notification_permission BOOLEAN DEFAULT FALSE,
  match_age_range_min INTEGER DEFAULT 18,
  match_age_range_max INTEGER DEFAULT 99,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### Interests Table
```sql
CREATE TABLE interests (
  id VARCHAR(50) PRIMARY KEY, -- e.g., 'adv_hiking'
  name VARCHAR(100) NOT NULL,
  emoji VARCHAR(10),
  category VARCHAR(50) NOT NULL, -- 'adventure', 'food', 'arts', etc.
  description TEXT
);
```

### User_Interests Junction Table
```sql
CREATE TABLE user_interests (
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  interest_id VARCHAR(50) REFERENCES interests(id) ON DELETE CASCADE,
  PRIMARY KEY (user_id, interest_id)
);
```

### Friendships Table
```sql
CREATE TABLE friendships (
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  friend_id UUID REFERENCES users(id) ON DELETE CASCADE,
  status VARCHAR(20) DEFAULT 'pending', -- 'pending', 'accepted', 'blocked'
  created_at TIMESTAMP DEFAULT NOW(),
  PRIMARY KEY (user_id, friend_id)
);
```

### Providers Table
```sql
CREATE TABLE providers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  name VARCHAR(100) NOT NULL,
  rating DECIMAL(2, 1) DEFAULT 0.0,
  total_reviews INTEGER DEFAULT 0,
  is_verified BOOLEAN DEFAULT FALSE,
  verification_level INTEGER DEFAULT 1, -- 1-5
  created_at TIMESTAMP DEFAULT NOW()
);
```

### Activities Table
```sql
CREATE TABLE activities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(200) NOT NULL,
  description TEXT,
  provider_id UUID REFERENCES providers(id) ON DELETE CASCADE,
  category VARCHAR(50), -- 'Hiking', 'Food & Drink', 'Arts & Culture', etc.
  location_name VARCHAR(200) NOT NULL,
  location_description TEXT,
  location_lat DECIMAL(10, 8),
  location_lng DECIMAL(11, 8),
  distance_from_center DECIMAL(6, 2), -- In kilometers
  start_datetime TIMESTAMP NOT NULL,
  end_datetime TIMESTAMP,
  price_amount DECIMAL(10, 2),
  price_currency VARCHAR(3) DEFAULT 'RWF', -- 'RWF' or 'USD'
  interested_count INTEGER DEFAULT 0,
  match_count INTEGER DEFAULT 0,
  group_size_min INTEGER DEFAULT 2,
  group_size_max INTEGER DEFAULT 8,
  images JSONB DEFAULT '[]', -- Array of image URLs
  is_time_sensitive BOOLEAN DEFAULT FALSE,
  is_recurring BOOLEAN DEFAULT FALSE,
  status VARCHAR(20) DEFAULT 'draft', -- 'draft', 'pending_review', 'published', 'cancelled'
  scheduled_publish_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### Activity_Interests Junction Table
```sql
CREATE TABLE activity_interests (
  activity_id UUID REFERENCES activities(id) ON DELETE CASCADE,
  interest_id VARCHAR(50) REFERENCES interests(id) ON DELETE CASCADE,
  PRIMARY KEY (activity_id, interest_id)
);
```

### Activity_History Table
```sql
CREATE TABLE activity_history (
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  activity_id UUID REFERENCES activities(id) ON DELETE CASCADE,
  action VARCHAR(20) NOT NULL, -- 'viewed', 'interested', 'attended', 'cancelled'
  rating INTEGER, -- 1-5 stars for attended activities
  created_at TIMESTAMP DEFAULT NOW(),
  PRIMARY KEY (user_id, activity_id, action)
);
```

### Following Table
```sql
CREATE TABLE following (
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  provider_id UUID REFERENCES providers(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT NOW(),
  PRIMARY KEY (user_id, provider_id)
);
```

### Conversations Table
```sql
CREATE TABLE conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type VARCHAR(20) DEFAULT 'direct', -- 'direct' or 'group'
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### Conversation_Participants Junction Table
```sql
CREATE TABLE conversation_participants (
  conversation_id UUID REFERENCES conversations(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  unread_count INTEGER DEFAULT 0,
  last_read_at TIMESTAMP,
  PRIMARY KEY (conversation_id, user_id)
);
```

### Messages Table
```sql
CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID REFERENCES conversations(id) ON DELETE CASCADE,
  sender_id UUID REFERENCES users(id) ON DELETE SET NULL,
  text TEXT NOT NULL,
  location_name VARCHAR(200),
  location_map_url TEXT,
  attachment_type VARCHAR(20), -- 'image' or 'video'
  attachment_url TEXT,
  status VARCHAR(20) DEFAULT 'sent', -- 'sent', 'delivered', 'read'
  created_at TIMESTAMP DEFAULT NOW()
);
```

### Match_Groups Table
```sql
CREATE TABLE match_groups (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  activity_id UUID REFERENCES activities(id) ON DELETE CASCADE,
  size INTEGER NOT NULL,
  avg_compatibility DECIMAL(5, 2),
  status VARCHAR(20) DEFAULT 'suggested', -- 'suggested', 'chat_requested', 'active'
  created_at TIMESTAMP DEFAULT NOW()
);
```

### Match_Group_Members Junction Table
```sql
CREATE TABLE match_group_members (
  group_id UUID REFERENCES match_groups(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  PRIMARY KEY (group_id, user_id)
);
```

### Comments Table
```sql
CREATE TABLE comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  activity_id UUID REFERENCES activities(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  parent_comment_id UUID REFERENCES comments(id) ON DELETE CASCADE,
  text TEXT NOT NULL,
  attachment_type VARCHAR(20),
  attachment_url TEXT,
  location_name VARCHAR(200),
  location_map_url TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);
```

---

## CORE FEATURES TO IMPLEMENT

### 1. Authentication System
- **Registration**: Email/password with username uniqueness check
- **Login**: JWT tokens with refresh token mechanism
- **Social Auth**: Optional Google/Facebook OAuth
- **Phone Verification**: SMS OTP for phone verification
- **Password Reset**: Email-based password reset flow
- **Session Management**: Secure cookie-based sessions

### 2. User Onboarding (7 Steps)
**Step 1: Profile Setup**
- Name, username (check availability in real-time)
- Avatar upload (with image cropping)
- Bio (optional, 150 char max)

**Step 2: Main Vibes Selection**
- Select 1-3 main categories from 10 options:
  1. Adventure Seeker 🏔️
  2. Foodie 🍽️
  3. Creative Soul 🎨
  4. Night Owl 🎶
  5. Fitness Enthusiast 💪
  6. Lifelong Learner 📚
  7. Fun & Games 🎮
  8. Wellness Warrior 🧘
  9. Explorer ✈️
  10. Social Butterfly 🤝

**Step 3: Detailed Interests**
- Select minimum 5 from 250+ interests filtered by selected vibes
- Display interests grouped by vibe category
- Real-time counter showing selection progress

**Step 4: Discovery Mode**
- Yes: Show 15% non-matching activities for discovery
- No: Strict interest-only filtering

**Step 5: Location Permission**
- Request browser geolocation
- Show benefits: nearby activities, distance calculation
- Allow skip

**Step 6: Notifications**
- Request notification permission
- Allow skip

**Step 7: Success Screen**
- Congratulations message
- Navigate to personalized feed

### 3. Discovery Feed (Main Page)
**Filter Tabs:**
- For You (personalized algorithm)
- Nearby (< 10km)
- Trending (highest interested_count)
- Doundaa-ing Now (time-sensitive activities)
- Following (from followed providers)

**Feed Algorithm (For You Tab):**
Implement scoring system with these weights:
```javascript
activityScore =
  (directInterestMatches × 0.50) +
  (clusterMatches × 0.20) +
  (adjacentInterestMatches × 0.10) +
  (providerRating/5 × 0.10) +
  (proximityScore × 0.05)

// Boost score by 50% for activities created within 48 hours
if (hoursSinceCreation <= 48) {
  activityScore *= 1.5
}

// Inject 15% discovery items for users with discovery mode ON
if (user.discoveryMode === 'yes') {
  injectRandomActivities(feed, 0.15)
}
```

**Interest Clusters for Recommendation:**
```javascript
const INTEREST_CLUSTERS = {
  activeExplorers: ['adv_hiking', 'adv_climbing', 'adv_camping', 'adv_sunrise_hikes', ...],
  urbanCultureVultures: ['arts_galleries', 'food_street_tours', 'arts_live_music', ...],
  wellnessWarriors: ['sports_yoga', 'food_healthy_eating', 'adv_walks', ...],
  nightCrew: ['night_club_nights', 'night_cocktail_bars', 'arts_live_music', ...],
  weekendWarriors: ['adv_hiking', 'adv_camping', 'food_beer_tasting', ...]
}
```

**Adjacent Interests Mapping:**
```javascript
const ADJACENT_INTERESTS = {
  'adv_hiking': [
    { id: 'adv_walks', coOccurrenceRate: 0.8 },
    { id: 'adv_trail_running', coOccurrenceRate: 0.6 },
    { id: 'adv_camping', coOccurrenceRate: 0.5 }
  ],
  'sports_yoga': [
    { id: 'sports_meditation', coOccurrenceRate: 0.9 },
    { id: 'well_mindfulness', coOccurrenceRate: 0.8 }
  ]
  // ... continue for key interests
}
```

### 4. Activity Card Component
Each activity card displays:
- Provider info (avatar, name, verification badge)
- Activity image carousel (swipeable)
- Title and description
- Category badge
- Location with distance
- Date/time
- Price (RWF/USD)
- Interested count + Match count
- Group size (2-8 people)
- Interest tags (show user's matching interests highlighted)
- Action buttons:
  - Heart (interested)
  - Message provider
  - Share
  - Options menu (report, not interested)
- Comment section (expandable)

### 5. Matches Page (Critical Algorithm)
**User Matching Algorithm:**
```javascript
// Calculate compatibility score between two users (0-100)
function calculateCompatibilityScore(userA, userB) {
  let score = 0;

  // 1. Date/Time Compatibility (40 points)
  if (hasDateOverlap(userA.preferredDates, userB.preferredDates)) {
    score += 40;
  }

  // 2. Interest Overlap (25 points)
  const interestSimilarity = jaccardSimilarity(
    userA.interestIds,
    userB.interestIds
  );
  score += interestSimilarity * 25;

  // 3. Demographics (15 points)
  const ageCompatible = isInAgeRange(userA, userB);
  const languageOverlap = hasCommonLanguage(userA, userB);
  const demographicScore = (ageCompatible ? 5 : 0) +
                           (languageOverlap ? 10 : 0);
  score += demographicScore;

  // 4. Social Connection (10 points)
  if (areFriends(userA.id, userB.id)) {
    score += 10;
  } else {
    const mutualFriends = countMutualFriends(userA, userB);
    score += Math.min(mutualFriends * 2, 5); // 2 points per mutual, max 5
  }

  // 5. Activity History Similarity (10 points)
  const historySimilarity = jaccardSimilarity(
    userA.attendedActivities,
    userB.attendedActivities
  );
  score += historySimilarity * 10;

  return Math.min(100, score);
}

// Form optimal groups of 2-8 people
function formMatchGroups(interestedUsers, minScore = 40) {
  const groups = [];
  const assigned = new Set();

  // Calculate pairwise compatibility
  const compatibilityMatrix = [];
  for (let i = 0; i < interestedUsers.length; i++) {
    for (let j = i + 1; j < interestedUsers.length; j++) {
      const score = calculateCompatibilityScore(
        interestedUsers[i],
        interestedUsers[j]
      );
      if (score >= minScore) {
        compatibilityMatrix.push({
          users: [interestedUsers[i], interestedUsers[j]],
          score
        });
      }
    }
  }

  // Sort by compatibility
  compatibilityMatrix.sort((a, b) => b.score - a.score);

  // Greedy group formation
  for (const match of compatibilityMatrix) {
    const [userA, userB] = match.users;
    if (assigned.has(userA.id) || assigned.has(userB.id)) continue;

    const newGroup = [userA, userB];
    assigned.add(userA.id);
    assigned.add(userB.id);

    // Expand group up to 8 people
    for (const candidate of interestedUsers) {
      if (assigned.has(candidate.id) || newGroup.length >= 8) break;

      // Check compatibility with all existing members
      const isCompatibleWithAll = newGroup.every(member =>
        calculateCompatibilityScore(candidate, member) >= minScore
      );

      if (isCompatibleWithAll) {
        newGroup.push(candidate);
        assigned.add(candidate.id);
      }
    }

    groups.push({
      members: newGroup,
      size: newGroup.length,
      avgCompatibility: calculateAvgCompatibility(newGroup)
    });
  }

  return groups.sort((a, b) => b.avgCompatibility - a.avgCompatibility);
}
```

**Display:**
- Show groups for selected activity
- Display group members (avatars, names)
- Show compatibility percentage (circular progress indicator)
- "Start Group Chat" button
- Filter to show only groups containing current user

### 6. Interests Page
- Display user's selected interests grouped by category
- Add new interests (search + browse)
- Remove interests
- Show interest recommendations based on:
  - Adjacent interests (40% weight)
  - Similar users' interests (25% weight)
  - Attended activity patterns (35% weight)
- Each recommendation shows reason (e.g., "Because you like Hiking")

### 7. Messaging System (Real-time)
**Direct Messages:**
- List of conversations with recent message preview
- Unread count badges
- Real-time message delivery using Socket.io
- Message status: sent → delivered → read
- Text messages + location sharing + image/video attachments
- Create new conversation with provider or matched user

**Group Chats:**
- Automatically created when users request group chat from matches
- Show all participants
- Same features as direct messages

**Implementation:**
```javascript
// Server-side Socket.io events
io.on('connection', (socket) => {
  socket.on('join-conversation', (conversationId) => {
    socket.join(conversationId);
  });

  socket.on('send-message', async (data) => {
    const message = await saveMessage(data);
    io.to(data.conversationId).emit('new-message', message);

    // Update unread counts for other participants
    await updateUnreadCounts(data.conversationId, data.senderId);
  });

  socket.on('mark-read', async (data) => {
    await markMessagesAsRead(data.conversationId, data.userId);
    io.to(data.conversationId).emit('messages-read', data);
  });
});
```

### 8. Create Activity (Providers Only)
**Provider Verification Levels:**
1. **New (Level 1)**: Basic posting (pending review)
2. **Bronze (Level 2)**: Email + phone verified, faster review
3. **Silver (Level 3)**: Social media connected
4. **Gold (Level 4)**: Business documents verified
5. **Partner (Level 5)**: Official Doundaa partner, instant publish

**KYC Flow:**
- Level 1→2: Full name, email, phone number
- Level 2→3: Connect Facebook/Instagram (coming soon)
- Level 3→4: Upload business license/registration (coming soon)
- Level 4→5: Contact Doundaa team

**Activity Creation Form:**
- Title (required)
- Description/caption (required)
- Location selector (integrated map)
- Start date + time (required)
- End date + time (optional)
- Recurring activity checkbox
- Price (amount + currency: RWF/USD)
- Group size (min-max, default 2-8)
- Category selection
- Interest tags (multi-select from 250+ options)
- Image upload (1-5 images, required)
- Schedule for later (optional)

**Submission:**
- Level 1: Goes to "pending_review" status
- Level 2-4: Faster review queue
- Level 5: Instant publish

### 9. Profile Page
**Display:**
- Avatar, name, username, bio
- Verification badge + level
- Edit profile button
- Statistics:
  - Activities attended
  - Average rating given
  - Friends count
- Selected interests (grouped by category)
- Settings:
  - Notifications
  - Privacy
  - Location settings
  - Discovery mode toggle
  - Match preferences (age range, gender preference)
  - Account management (change password, logout, delete account)

**For Providers:**
- Switch to provider view
- Provider statistics (activities hosted, rating, reviews)
- Manage activities (drafts, published, past)

### 10. Admin Dashboard (Level 5+ Only)
**Sections:**
- Activity Moderation:
  - Review pending activities
  - Approve/reject with reasons
  - Flag inappropriate content
- User Management:
  - View all users
  - Verification approvals
  - Handle reports
- Provider Management:
  - Review verification applications
  - Upgrade/downgrade provider levels
- Analytics:
  - Total users, activities, matches
  - Popular interests chart (using Recharts)
  - Activity creation trends
  - User engagement metrics
- Reports:
  - Review user reports on activities/users
  - Take action (remove content, ban users)

---

## API ENDPOINTS TO IMPLEMENT

### Authentication
```
POST   /api/auth/register
POST   /api/auth/login
POST   /api/auth/logout
POST   /api/auth/refresh-token
POST   /api/auth/forgot-password
POST   /api/auth/reset-password
POST   /api/auth/verify-email
POST   /api/auth/verify-phone
```

### Users
```
GET    /api/users/me
PUT    /api/users/me
DELETE /api/users/me
GET    /api/users/:id
POST   /api/users/check-username
POST   /api/users/avatar
GET    /api/users/search
```

### Interests
```
GET    /api/interests
GET    /api/interests/categories
POST   /api/users/me/interests
DELETE /api/users/me/interests/:interestId
GET    /api/interests/recommendations
```

### Friends
```
GET    /api/friends
POST   /api/friends/:userId
DELETE /api/friends/:userId
GET    /api/friends/requests
PUT    /api/friends/requests/:userId
```

### Activities
```
GET    /api/activities
GET    /api/activities/:id
POST   /api/activities (provider only)
PUT    /api/activities/:id (provider only)
DELETE /api/activities/:id (provider only)
POST   /api/activities/:id/interest
DELETE /api/activities/:id/interest
POST   /api/activities/:id/view
GET    /api/activities/feed
GET    /api/activities/nearby
GET    /api/activities/trending
```

### Activity Interactions
```
POST   /api/activities/:id/comments
GET    /api/activities/:id/comments
DELETE /api/comments/:id
POST   /api/activities/:id/attend
POST   /api/activities/:id/rate
```

### Providers
```
GET    /api/providers
GET    /api/providers/:id
POST   /api/providers (create provider profile)
PUT    /api/providers/:id
POST   /api/providers/:id/follow
DELETE /api/providers/:id/follow
GET    /api/providers/:id/activities
POST   /api/providers/verify
```

### Matches
```
GET    /api/activities/:id/matches
POST   /api/matches/calculate
GET    /api/users/:id/compatibility
```

### Conversations & Messages
```
GET    /api/conversations
GET    /api/conversations/:id
POST   /api/conversations
GET    /api/conversations/:id/messages
POST   /api/conversations/:id/messages
PUT    /api/conversations/:id/read
DELETE /api/messages/:id
```

### Admin
```
GET    /api/admin/activities/pending
PUT    /api/admin/activities/:id/approve
PUT    /api/admin/activities/:id/reject
GET    /api/admin/users
GET    /api/admin/reports
PUT    /api/admin/reports/:id
GET    /api/admin/analytics
```

### Misc
```
POST   /api/upload/image
POST   /api/reports
GET    /api/locations/search
```

---

## UI/UX REQUIREMENTS

### Design System
**Colors:**
- Primary: Teal (#14B8A6, #0D9488, #0F766E)
- Secondary: Gray scale (#F9FAFB, #F3F4F6, #E5E7EB, #D1D5DB, #9CA3AF, #6B7280, #4B5563, #374151, #1F2937)
- Accent colors by category:
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

**Typography:**
- Font: System font stack (Inter, SF Pro, -apple-system, Segoe UI)
- Headings: Bold, 24-32px
- Body: Regular, 14-16px
- Captions: 12px

**Layout:**
- Mobile-first, responsive design
- Max width: 480px for mobile, expand for tablet/desktop
- Bottom navigation (5 icons: Home, Matches, Create, Messages, Profile)
- Top header with logo and profile/notification icons

**Components:**
- Cards: Rounded corners (12-16px), shadow on hover
- Buttons: Rounded full or lg, bold text
- Input fields: Rounded md, teal focus ring
- Tags/Pills: Small rounded full pills with emoji + text
- Modals: Center screen, backdrop blur

### Responsive Behavior
- Mobile: Single column, bottom nav
- Tablet: 2-column grid for activities
- Desktop: 3-column grid, sidebar navigation

### Animations
- Smooth transitions (200-300ms)
- Skeleton loaders for content fetching
- Toast notifications for actions (success/error)
- Pull-to-refresh on feed

---

## SECURITY & PERFORMANCE

### Security
- Rate limiting on all endpoints
- Input sanitization (prevent XSS)
- Parameterized queries (prevent SQL injection)
- HTTPS only
- Secure cookie flags (httpOnly, secure, sameSite)
- CORS configuration
- File upload validation (type, size)
- Image processing (resize, compress)

### Performance
- Database indexing on:
  - users.email, users.username
  - activities.provider_id, activities.created_at
  - messages.conversation_id, messages.created_at
- Implement pagination (20 items per page)
- Redis caching for:
  - User sessions
  - Activity feed
  - Popular activities
  - Interest lists
- Image optimization (WebP format, lazy loading)
- Code splitting (React.lazy)
- Service worker for PWA (optional)

### Monitoring
- Error tracking (Sentry)
- Analytics (Google Analytics or Plausible)
- Performance monitoring (Web Vitals)

---

## DEPLOYMENT

### Environment Variables
```
DATABASE_URL=
JWT_SECRET=
JWT_REFRESH_SECRET=
REDIS_URL=
SMTP_HOST=
SMTP_PORT=
SMTP_USER=
SMTP_PASSWORD=
AWS_S3_BUCKET=
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
MAPBOX_API_KEY=
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
FACEBOOK_APP_ID=
FACEBOOK_APP_SECRET=
STRIPE_SECRET_KEY=
TWILIO_ACCOUNT_SID=
TWILIO_AUTH_TOKEN=
FRONTEND_URL=
```

### Hosting
- Frontend: Vercel or Netlify
- Backend: Railway, Render, or AWS
- Database: Supabase, Railway PostgreSQL, or AWS RDS
- Redis: Upstash or Railway
- Storage: AWS S3 or Cloudflare R2

---

## DATA SEEDING

### Seed the following data:

**1. All 250+ Interests** across 10 categories (refer to interest list in codebase)

**2. Sample Users** (at least 20 diverse users with varying interests)

**3. Sample Providers** (5-10 providers with different verification levels)

**4. Sample Activities** (15-20 activities across categories):
- Mount Kigali Sunrise Hike (Hiking, 5000 RWF)
- Nyamirambo Walking Food Tour (Food, 10000 RWF)
- Traditional Imigongo Art Workshop (Arts, 15 USD)
- Sunset Kayaking on Lake Kivu (Adventure, 25 USD)
- Volcanoes National Park Gorilla Trek (Wildlife, 1500 USD)
- Beginner's Pottery Class (Crafts, 20000 RWF)
- Kigali Coffee Tasting Experience (Food, 8000 RWF)
- Live Jazz Night at Inema Arts (Nightlife, Free)
- Yoga in the Park (Wellness, 3000 RWF)
- Board Game Night (Social, 5000 RWF)

**5. Sample Friendships, Messages, and Activity History**

---

## BOLT.NEW SPECIFIC INSTRUCTIONS

### Phase 1: Project Setup
1. Initialize a full-stack TypeScript project with Next.js 14+ (App Router)
2. Set up Prisma with PostgreSQL
3. Configure TailwindCSS
4. Set up authentication with NextAuth.js (JWT strategy)
5. Create folder structure:
   ```
   /app
     /api
     /(auth)
     /(main)
   /components
   /lib
     /db
     /utils
     /algorithms
   /prisma
   /public
   ```

### Phase 2: Database & Seed
1. Create all Prisma models based on schema above
2. Generate Prisma client
3. Create seed script with sample data
4. Run migrations and seed

### Phase 3: Core API
1. Implement authentication endpoints
2. Implement user CRUD
3. Implement activities CRUD
4. Implement matching algorithm functions
5. Implement feed algorithm
6. Test all endpoints

### Phase 4: Frontend Pages
1. Create authentication pages (login, register)
2. Create onboarding flow (7 steps)
3. Create discovery feed with filtering
4. Create activity detail page with comments
5. Create matches page
6. Create interests management page
7. Create profile page
8. Create messaging interface (integrate Socket.io)
9. Create activity creation page
10. Create admin dashboard

### Phase 5: Real-time Features
1. Set up Socket.io server
2. Implement real-time messaging
3. Add typing indicators
4. Add online status
5. Implement notifications

### Phase 6: Polish
1. Add loading states and skeletons
2. Implement error boundaries
3. Add toast notifications
4. Optimize images
5. Add meta tags for SEO
6. Test responsive design
7. Add PWA manifest

### Phase 7: Deployment
1. Set up environment variables
2. Deploy database
3. Deploy backend
4. Deploy frontend
5. Configure domain and SSL
6. Test production environment

---

## TESTING CHECKLIST

- [ ] User registration and login
- [ ] Onboarding flow completion
- [ ] Feed displays personalized activities
- [ ] Activity filtering works (For You, Nearby, Trending, etc.)
- [ ] Activity detail shows all information
- [ ] Commenting on activities
- [ ] Matching algorithm produces correct groups
- [ ] Group compatibility scores are accurate
- [ ] Real-time messaging works
- [ ] Message status updates (sent/delivered/read)
- [ ] Create activity as provider
- [ ] Provider verification flow
- [ ] Interest management (add/remove)
- [ ] Interest recommendations
- [ ] Profile editing
- [ ] Following/unfollowing providers
- [ ] Admin approval/rejection
- [ ] Admin analytics display
- [ ] Location permission handling
- [ ] Notification permission handling
- [ ] Image uploads
- [ ] Mobile responsive design
- [ ] Error handling
- [ ] Loading states

---

## CRITICAL NOTES FOR BOLT.NEW

1. **DO NOT skip the backend** - This is not just a frontend app. Implement full API with database.

2. **Implement the matching algorithm exactly** as specified. This is the core differentiator of Doundaa.

3. **Use Rwandan context**:
   - Default currency: RWF (Rwandan Franc)
   - Locations around Kigali (Mount Kigali, Nyamirambo, Lake Kivu, Volcanoes National Park)
   - Local interests (Gorilla trekking, Imigongo art, Kinyarwanda language)

4. **Real-time is essential**: Messaging must work in real-time using Socket.io or similar.

5. **Mobile-first**: Most users will access on mobile, prioritize mobile UX.

6. **Performance matters**: Implement caching, pagination, and optimization from the start.

7. **Security is non-negotiable**: Proper authentication, authorization, input validation, and rate limiting.

8. **The feed algorithm is the heart of the app** - Spend time getting the scoring system right.

9. **Start with MVP features first**:
   - Auth → Onboarding → Feed → Activity Detail → Matching → Messaging → Create Activity

10. **Test thoroughly** before considering the app complete. The matching algorithm in particular needs verification.

---

## EXPECTED DELIVERABLES FROM BOLT.NEW

1. ✅ Fully functional full-stack application
2. ✅ Complete authentication system
3. ✅ Working database with seeded data
4. ✅ All API endpoints implemented
5. ✅ Matching algorithm implementation
6. ✅ Real-time messaging system
7. ✅ Provider verification system
8. ✅ Activity creation and moderation
9. ✅ Admin dashboard
10. ✅ Responsive mobile UI
11. ✅ Deployment-ready with environment configuration

---

## FINAL SUCCESS CRITERIA

The rebuild is successful when:
1. A new user can register, complete onboarding, and see a personalized feed
2. Users can browse activities, see matches, and start group chats
3. Providers can create activities that go through approval
4. Real-time messaging works between users
5. The matching algorithm correctly forms compatible groups
6. Admin can moderate content
7. The app is mobile-responsive and performant
8. All core features work without errors

---

**DOUNDAA: Where plans fall into place and people show up!** 🎉
