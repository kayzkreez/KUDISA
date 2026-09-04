# KUDISA — COMPLETE PRODUCT FRAMEWORK

## Identity

- App: **Kudisa**
- Logo: **TK**
- 224: **Today, Tomorrow, Forever**
- BME: **My Beginning, My Middle, My End**
- Anniversary: **7 July**
- Kudakwashe birthday: **17 July 2003**
- Core principle: a private operating system for two people building a shared life.

## Relationship profile

### Tadisa Chachora
- Girlfriend / soon-to-be wife
- High-school best friend
- Birthday: 10 October 2005
- Likes black
- Loving, understanding and kind
- Values family, connection and togetherness
- Enjoys quality time
- Does not like crowded spaces
- Bachelor's in Social Work, Women's University
- Second year
- University routine: Wednesday–Friday
- Church: Sunday
- Sings in choir
- Future vision: farmhouse
- Future wedding vision: small, maximum 100 people
- Future gift/dream: Range Rover

These are preference/profile inputs. The production app must allow them to be edited rather than hard-coding them.

## Modules

### 1. Communication
- One-to-one messaging
- Photos
- Videos
- Voice notes
- Documents
- Reactions
- Replies
- Search
- Pinned/saved messages
- Voice calls
- Video calls
- Call history
- Private media storage

### 2. Music
- Song of the day
- Shared playlists
- Individual playlists
- Our songs
- Date-night playlist
- Road-trip playlist
- Wedding playlist
- Farmhouse playlist
- Lyrics through licensed providers
- Song attached to a date or memory

### 3. Dates
- Date planner
- Energy check
- Budget
- Quiet/crowd preference
- Go out/stay in
- Date intention
- Activity recommendation
- Backup plan
- Pre-date connection
- Phone-free time
- Conversation questions
- Post-date reflection
- Date history
- 100-date challenge
- Surprise dates
- Date invitations

### 4. Couple games
- Conversation games
- Would You Rather
- Truth or Dare
- Never Have I Ever
- Deep questions
- Memory games
- Creative challenges
- Cooking challenges
- Photo challenges
- Indoor/home games
- Outdoor activities
- Random game generator

### 5. Style
- Outfit of the day
- Outfit streak
- Couple colour matching
- Match my outfit
- Wardrobe
- Occasion styling
- Photoshoot styling
- Style challenges
- Outfit memories
- Coordinate, don't clone

### 6. Memories
- Photos
- Videos
- Dates
- Trips
- Milestones
- Songs
- Messages
- Important moments
- Timeline
- Tags
- Location
- Notes
- Search
- Shared/private memories

### 7. Milestones
- High-school friendship
- Relationship start
- First date
- First trip
- Anniversaries
- Graduation
- Engagement
- Wedding
- First home
- Farmhouse
- Other custom milestones

### 8. Bucket list
Shared experiences and life goals with:
- status
- priority
- target date
- estimated cost
- progress
- photos
- notes

### 9. Life We Want

Given monthly combined income **I**:

- Investment capital target = **I × 120**
- Minimum monthly investment = **I × 0.10**
- Emergency fund = **I × 4**
- Monthly expenses = **I × 0.55**

All four multipliers/percentages must be configurable in production.

Goals:
- Investment portfolio
- Emergency fund
- Wedding
- Farmhouse
- Range Rover
- Trips
- Education
- Other shared goals

### 10. Tasks & chores
- Personal tasks
- Partner tasks
- Shared tasks
- Daily chores
- Weekly chores
- Recurring tasks
- Due dates
- Priority
- Completion
- Reminders

Known planning rhythm:
- Wednesday–Friday: university
- Sunday: church / choir
These are editable defaults.

### 11. Wedding
- Maximum 100 guests
- Guest list
- Venue
- Budget
- Rings
- Clothing
- Food
- Decor
- Music
- Photography
- Invitations
- Transport
- Honeymoon
- Checklist
- Private proposal/engagement planning

### 12. Farmhouse
- Vision board
- Land
- House
- Garden
- Family spaces
- Farm
- Equipment
- Budget
- Savings progress
- Inspiration images

## Core experience loop

Communication → connection → plan → date → experience → photo/song → memory → milestone → future goal.

## Production architecture

Frontend:
- React / Next.js
- Responsive mobile-first UI

Backend:
- Node.js API
- MongoDB
- Authentication
- WebSocket/real-time messaging
- WebRTC for calls
- Object storage for media
- Notifications

Collections:
- users
- couples
- profiles
- conversations
- messages
- media
- calls
- songs
- playlists
- dates
- dateQuestions
- games
- outfits
- wardrobes
- challenges
- memories
- milestones
- bucketItems
- tasks
- chores
- financialProfiles
- financialGoals
- wedding
- farmhouse
- notifications
- weeklyCheckins
- settings

## Privacy

Every record should have an owner/couple scope. Private records must not be accessible to the other partner unless explicitly shared.

Production security:
- secure authentication
- hashed passwords
- session management
- authorization
- encryption in transit
- protected media
- rate limiting
- audit logs
- backups
- 2FA
- secure secret management

## Design

Primary palette:
- Navy `#18324A`
- Sage `#A9B291`
- Warm cream `#F5F0E7`
- Charcoal `#202A30`
- Muted gold `#B89455`

Visual direction:
- intimate
- calm
- mature
- minimal
- warm
- spacious
- relationship-focused

Do not copy any referenced app literally. Use the references as interaction/design inspiration while maintaining Kudisa's own identity.


## Preview / UI integrity requirement

Every navigation tab must resolve to an existing section ID. All interactive prototype controls must have a visible result or persisted state. Layout must remain usable at desktop, tablet and mobile widths. Production implementation should use component-level visual regression tests so every page has an approved reference screenshot before release.


### 8. Relationship calendar and reminders
- One shared calendar inside the single Kudisa app
- Annual birthdays for Kudakwashe (17 July) and Tadisa (10 October)
- Annual relationship anniversary (7 July)
- Custom important dates and events
- Upcoming-events countdown
- Calendar month navigation
- Important dates visually marked on calendar
- Reminder timing: 30 days, 7 days, 1 day and day-of-event
- In-app reminder alerts
- Browser notification support with permission control
- Reminder settings persist locally
- Production architecture should use a backend push service/service worker for reliable background notifications when the app is closed

### 9. 2/2/2 relationship rhythm
- Every 2 weeks: go out for an evening
- Every 2 months: go away for a weekend
- Every 2 years: go away for a week
- The calendar/planning system should generate these recurring relationship-planning prompts after marriage
- The purpose is consistent relationship maintenance rather than relying on occasional grand gestures



## KUDISA v2 — Two-profile shared-app model

### Authentication
- Tadisa profile: access code `224`
- Kuda profile: access code `BME`
- Profile switching from inside the app
- Each profile has its own editable personal data
- The app combines both profiles into the shared relationship view

### Shared experience
- Both users can contribute events and activities
- Shared feed clearly identifies who added each item
- Chat clearly identifies every message as Tadisa or Kuda
- Personal additions remain associated with their owner while also appearing in the combined relationship space

### Our Life
- Supplied couple photo is included as the initial relationship image
- Photo can be replaced or removed
- Our Life is populated with shared activity, profiles, dates, milestones, bucket list, wedding, farmhouse, style and date-planning content

### Plan a Date
- Dedicated Plan a Date page
- Editable energy, intent, budget, setting, crowd level and date
- Generated activity + backup plan + conversation prompt
- Save planned date to shared activities and calendar
- Post-date reflection
