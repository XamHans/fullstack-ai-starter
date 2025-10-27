### aiZen - Complete App Narrative & Implementation Plan

## Vision

KaiZen is a household management app that transforms daily chaos into calm, organized living through the philosophy of continuous 1% improvements. It combines personal habit tracking, collaborative meal planning, and AI-powered assistance to help households thrive together while supporting individual growth.

---

## User Experience Flow

### First-Time Setup (Sunday Onboarding)

**Step 1: Welcome & Household Creation**

- User opens KaiZen for the first time
- Warm welcome screen: "Welcome to KaiZen - Your Household's Daily Companion"
- Create household name (e.g., "The Sanctuary")
- Set household meal preferences:

- Dietary restrictions (vegetarian, vegan, gluten-free, etc.)
- Maximum cooking time (15, 30, 45, 60 minutes)
- Meal types to plan (breakfast, lunch, dinner)

**Step 2: Add Household Members**

- "Who lives here?" screen
- For each person:

- Enter name (e.g., "Johannes", "Jessica")
- Choose or upload profile icon/avatar
- Define 3-5 personal "1% habits" (daily small improvements)

- Examples: "Drink Gerstengras", "10-minute morning reading", "30-minute afternoon walk", "Take Kijimea"

- Set personal inspiration prompt for daily quotes

- Examples: "stoic discipline and focus", "nature and mindfulness", "creative energy"

- Beautiful card-based interface with smooth transitions

**Step 3: Weekly Meal Planning (The Sunday Ritual)**

- "Let's plan your week's meals" introduction
- Tinder-style swipe interface:

- Beautiful recipe cards with:

- High-quality food image
- Recipe name and description
- Prep time, difficulty, tags
- Key ingredients preview

- Swipe right to select, left to skip
- Progress indicator: "7 lunches selected, 5 dinners to go"
- AI generates recipes based on household preferences
- Select 14 meals total (7 days × lunch + dinner)

- Confirmation screen showing the week's meal plan in calendar view
- Auto-generate categorized grocery list:

- Produce, Dairy, Meat/Protein, Pantry, Frozen, Other
- Smart ingredient consolidation (3 recipes need onions → "Onions × 3")
- Estimated total items count

**Step 4: Setup Complete**

- Celebration screen: "Your week is planned!"
- Quick tutorial on daily use:

- "Tap your icon to see your personal dashboard"
- "Check off habits as you complete them"
- "Tap a meal to start cooking with step-by-step guidance"
- "Use voice commands hands-free in the kitchen"

---

### Daily Use Experience

**Morning Routine (7:00 AM)**

**Home Screen:**

- Clean, minimal interface
- Household name at top: "The Sanctuary"
- User icons displayed as circular avatars (Johannes, Jessica)
- Today's date and day of week
- Quick glance at today's meals below icons

**Personal Dashboard (Tap Your Icon):**

_Johannes taps his icon and sees:_

**Header:**

- Personal greeting: "Good morning, Johannes"
- Today's AI-generated inspiration quote:

- Large, beautiful typography
- Quote based on his prompt ("stoic discipline")
- Example: "The obstacle is the way. What stands in the path becomes the path." - Marcus Aurelius

**My 1% Today Section:**

- Personal habit checklist with large, tappable checkboxes:

- ☐ Drink Gerstengras
- ☐ Take Kijimea
- ☐ 10-minute morning reading
- ☐ 30-minute afternoon walk

- Progress bar at bottom: "0/4 completed today"
- Smooth animation when checking off items
- Satisfying haptic feedback on completion

**Today's Fuel Section:**

- Shared household meals for today:

- Lunch card: "Mediterranean Quinoa Bowl" with image
- Dinner card: "Thai Green Curry" with image

- Tap any meal to open cooking wizard
- Small prep time indicator on each card

**Grocery List Quick Access:**

- Floating button: "Grocery List (12 items)"
- Shows unchecked items count

---

**Afternoon Cooking (5:30 PM)**

_Jessica wants to start cooking dinner_

**From Personal Dashboard:**

- Taps "Thai Green Curry" dinner card
- Transitions to Cooking Wizard

**Cooking Wizard Interface:**

**Step-by-Step View:**

- Large, clean layout optimized for kitchen viewing
- Current step highlighted with large text:

- Step 1/8: "Heat 2 tablespoons coconut oil in a large pan over medium heat"

- Ingredients list collapsible at top:

- Can expand to see full ingredient list
- Checkboxes to mark ingredients as added

- Navigation:

- Large "Next Step" button at bottom
- "Previous" button if needed
- Progress indicator: "Step 3 of 8"

- Voice control indicator: "Say 'Next step' to continue hands-free"

**Voice Commands Available:**

- "Next step" - Advance to next instruction
- "Previous step" - Go back
- "Show ingredients" - Expand ingredient list
- "Add [item] to grocery list" - Add missing items
- "Set timer for [X] minutes" - Start cooking timer

**Completion:**

- Final step: "Serve hot and enjoy!"
- Celebration animation
- Option to rate the recipe
- Return to dashboard

---

**Evening Habit Tracking (8:00 PM)**

_Johannes completes his evening walk_

**Quick Completion:**

- Opens app → taps his icon
- Sees "My 1% Today" section
- Taps checkbox next to "30-minute afternoon walk"
- Smooth check animation with haptic feedback
- Progress bar updates: "4/4 completed today"
- Celebration micro-animation: "Perfect day, Johannes!"

**Voice Alternative:**

- Johannes can say: "Mark my walk as complete"
- App confirms: "Walk marked complete. You've completed all habits today!"

---

**Grocery Shopping (Saturday Morning)**

**Grocery List View:**

- Categorized by store sections:

- **Produce**: Onions × 3, Bell peppers × 2, Spinach (1 bunch)
- **Dairy**: Coconut milk × 2, Greek yogurt
- **Pantry**: Quinoa, Thai curry paste, Soy sauce
- **Protein**: Tofu (firm, 1 block), Chickpeas (2 cans)

- Large checkboxes for easy tapping while shopping
- Items gray out when checked
- Progress indicator: "8/12 items collected"
- Voice command: "Add coffee beans to grocery list"

- App responds: "Added coffee beans to Pantry section"

---

**Next Sunday (Weekly Planning)**

**Automatic Prompt:**

- App detects it's Sunday
- Notification: "Time to plan next week's meals!"
- Opens to meal planning swipe interface
- Previous week's favorites highlighted: "You loved this recipe last week"
- Can re-select favorites or discover new recipes
- Process repeats smoothly

---

## Feature Breakdown

### 1. Household Management

- **Multi-user profiles** (no authentication required)
- **Shared household space** with individual personalization
- **User switching** via icon tap on home screen
- **Household preferences** for meal planning

### 2. Personal 1% Habits System

- **Custom habit definition** during onboarding
- **Daily checklist** with satisfying completion animations
- **Progress tracking** with visual progress bar
- **Streak tracking** (optional future feature)
- **Habit history** to see patterns over time

### 3. AI-Powered Inspiration

- **Daily personalized quotes** based on individual prompts
- **AI generation** using Vercel AI SDK
- **Beautiful typography** and presentation
- **Variety and relevance** to user's interests

### 4. Collaborative Meal Planning

- **Tinder-style swipe interface** for recipe selection
- **AI-generated recipes** based on household preferences
- **Weekly planning ritual** (Sunday focus)
- **Calendar view** of planned meals
- **Recipe database** with filtering and search

### 5. Smart Grocery Lists

- **Auto-generation** from selected meals
- **Intelligent categorization** by store section
- **Ingredient consolidation** across recipes
- **Checkable items** with progress tracking
- **Voice-powered additions** while cooking

### 6. Guided Cooking Experience

- **Step-by-step wizard** with large, clear text
- **Kitchen-optimized UI** for easy viewing
- **Voice navigation** for hands-free cooking
- **Ingredient checklist** within recipe
- **Timer integration** for cooking steps

### 7. Voice Control Throughout

- **Natural language processing** via AI SDK
- **Hands-free operation** in kitchen
- **Multiple command types**:

- Habit completion
- Grocery list management
- Recipe navigation
- Information queries

---

## Technical Implementation Plan

### Technology Stack

**Frontend:**

- Next.js 16 (App Router)
- React 19.2 with Server Components
- TypeScript for type safety
- Tailwind CSS v4 for styling
- shadcn/ui component library
- Framer Motion for animations

**Backend:**

- Next.js API Routes and Server Actions
- Supabase PostgreSQL database
- No authentication (simple user selection)

**AI Integration:**

- Vercel AI SDK v5
- AI Gateway for recipe generation
- Voice recognition via Web Speech API
- Natural language processing for commands

**State Management:**

- SWR for client-side data fetching and caching
- React Server Components for server state
- localStorage for user preferences

---

### Database Architecture

**Schema Design:**

```sql
-- Households: Shared household space
households
  - id (uuid, primary key)
  - name (text)
  - meal_preferences (jsonb)
  - created_at (timestamp)

-- Users: Household members
users
  - id (uuid, primary key)
  - household_id (uuid, foreign key)
  - name (text)
  - avatar_url (text)
  - inspiration_prompt (text)
  - created_at (timestamp)

-- Habits: Personal 1% daily habits
habits
  - id (uuid, primary key)
  - user_id (uuid, foreign key)
  - name (text)
  - display_order (integer)
  - created_at (timestamp)

-- Habit Completions: Daily tracking
habit_completions
  - id (uuid, primary key)
  - habit_id (uuid, foreign key)
  - completed_date (date)
  - completed (boolean)
  - completed_at (timestamp)
  - UNIQUE(habit_id, completed_date)

-- Recipes: Meal database
recipes
  - id (uuid, primary key)
  - name (text)
  - description (text)
  - ingredients (jsonb array)
  - instructions (jsonb array)
  - prep_time (integer, minutes)
  - image_url (text)
  - meal_type (text: lunch/dinner)
  - tags (text array)
  - dietary_tags (text array)
  - created_at (timestamp)

-- Meal Plans: Weekly selections
meal_plans
  - id (uuid, primary key)
  - household_id (uuid, foreign key)
  - week_start_date (date, Sunday)
  - day_of_week (integer, 0-6)
  - meal_type (text: lunch/dinner)
  - recipe_id (uuid, foreign key)
  - created_at (timestamp)
  - UNIQUE(household_id, week_start_date, day_of_week, meal_type)

-- Grocery Lists: Auto-generated
grocery_lists
  - id (uuid, primary key)
  - household_id (uuid, foreign key)
  - week_start_date (date)
  - item_name (text)
  - category (text)
  - quantity (text)
  - checked (boolean)
  - created_at (timestamp)
```

**Key Design Decisions:**

- **No authentication**: Simple user selection, no passwords
- **Week identification**: Use Sunday's date as `week_start_date`
- **JSONB for flexibility**: Ingredients and instructions as structured JSON
- **Unique constraints**: Prevent duplicate meal plans and habit completions
- **Foreign keys**: Maintain data integrity across tables

---

### Application Structure

```plaintext
app/
  page.tsx                    → Home: User selection screen
  onboarding/
    page.tsx                  → Multi-step onboarding wizard
  dashboard/
    [userId]/
      page.tsx                → Personal dashboard
  plan/
    page.tsx                  → Weekly meal planning (swipe interface)
  cook/
    [recipeId]/
      page.tsx                → Cooking wizard
  grocery/
    page.tsx                  → Grocery list view
  api/
    quotes/
      route.ts                → AI quote generation
    recipes/
      generate/
        route.ts              → AI recipe generation
    voice/
      route.ts                → Voice command processing

components/
  onboarding/
    household-setup.tsx       → Household creation form
    user-setup.tsx            → User profile creation
    meal-preferences.tsx      → Meal preference selection
  meal-planning/
    recipe-swipe-card.tsx     → Tinder-style swipe card
    meal-calendar.tsx         → Week view of planned meals
  dashboard/
    inspiration-quote.tsx     → Daily quote display
    habit-checklist.tsx       → Personal habits with checkboxes
    todays-meals.tsx          → Meal cards for today
  cooking/
    cooking-wizard.tsx        → Step-by-step recipe guide
    ingredient-list.tsx       → Collapsible ingredients
  grocery/
    grocery-list.tsx          → Categorized grocery items
    grocery-category.tsx      → Single category section
  shared/
    user-avatar.tsx           → User icon/avatar
    progress-bar.tsx          → Visual progress indicator
    voice-button.tsx          → Voice control activation

lib/
  supabase/
    client.ts                 → Browser Supabase client
    server.ts                 → Server Supabase client
  ai/
    generate-quote.ts         → AI quote generation logic
    generate-recipe.ts        → AI recipe generation logic
    process-voice.ts          → Voice command processing
  utils/
    date-helpers.ts           → Week calculation utilities
    grocery-helpers.ts        → Ingredient consolidation
    animation-variants.ts     → Framer Motion variants

scripts/
  001_create_tables.sql       → Database schema
  002_seed_recipes.sql        → Initial recipe data
```

---

### UI/UX Design Approach

**Design Principles:**

1. **Calm and Organized**: Minimal clutter, generous whitespace
2. **Delightful Interactions**: Smooth animations, haptic feedback
3. **Kitchen-Friendly**: Large touch targets, clear text
4. **Personal Yet Shared**: Individual spaces within household context
5. **Voice-First Option**: Hands-free when needed

**Color System (3-5 colors):**

- **Primary**: Warm sage green (calm, natural, growth)
- **Accent**: Soft coral (energy, warmth, completion)
- **Neutrals**: Off-white background, charcoal text, light gray borders
- **Success**: Gentle green for completions
- **Semantic tokens**: Use CSS variables for theming

**Typography:**

- **Headings**: Clean sans-serif (e.g., Inter, Geist)
- **Body**: Same family, regular weight
- **Cooking wizard**: Extra large text for kitchen viewing
- **Line height**: 1.5-1.6 for readability

**Layout Patterns:**

- **Flexbox primary**: Most layouts use flex
- **Grid for calendar**: Meal planning week view
- **Card-based**: Recipes, meals, user profiles
- **Bottom navigation**: Easy thumb access on mobile

**Animations:**

- **Page transitions**: Smooth slide/fade
- **Habit completion**: Satisfying check animation
- **Swipe gestures**: Natural card movement
- **Progress bars**: Animated fill
- **Micro-interactions**: Button presses, checkbox toggles

---

### AI Integration Points

**1. Daily Inspiration Quotes**

- **Trigger**: User opens personal dashboard
- **Input**: User's inspiration prompt
- **AI Task**: Generate relevant, motivational quote
- **Output**: Quote text + author (if applicable)
- **Caching**: Store today's quote, regenerate daily

**2. Recipe Generation**

- **Trigger**: User swipes through recipes, needs more options
- **Input**: Household meal preferences, dietary restrictions, time constraints
- **AI Task**: Generate complete recipe with ingredients and instructions
- **Output**: Structured recipe object
- **Image**: Generate or fetch recipe image

**3. Grocery List Categorization**

- **Trigger**: Meal plan finalized
- **Input**: All ingredients from selected recipes
- **AI Task**: Categorize items by store section, consolidate quantities
- **Output**: Categorized grocery list

**4. Voice Command Processing**

- **Trigger**: User activates voice control
- **Input**: Audio speech converted to text
- **AI Task**: Parse intent and extract parameters
- **Output**: Action to execute (add item, mark complete, navigate, etc.)
- **Examples**:

- "Add coffee beans to grocery list" → Add item action
- "Mark my walk as complete" → Complete habit action
- "Next step" → Navigate cooking wizard
- "Show me tonight's recipe" → Display recipe

---

### Development Phases

**Phase 1: Foundation (Week 1)**

- Set up Next.js project structure
- Configure Supabase integration
- Create database schema and seed data
- Build Supabase client utilities
- Set up AI SDK integration
- Create basic routing structure

**Deliverables:**

- Database tables created
- Initial recipe seed data
- Supabase clients working
- Project structure established

---

**Phase 2: Onboarding Flow (Week 1-2)**

- Household creation wizard
- User profile setup with habits
- Meal preferences configuration
- Multi-step form with validation
- Smooth transitions between steps
- Data persistence to database

**Deliverables:**

- Complete onboarding flow
- Household and user creation working
- Habits stored in database
- Beautiful UI with animations

---

**Phase 3: Meal Planning System (Week 2-3)**

- Recipe swipe card component
- Swipe gesture implementation
- AI recipe generation integration
- Weekly meal selection logic
- Meal calendar view
- Grocery list auto-generation
- Ingredient consolidation algorithm

**Deliverables:**

- Tinder-style swipe interface
- 14 meals selectable
- Grocery list generated
- Calendar view of week

---

**Phase 4: Personal Dashboards (Week 3-4)**

- Home screen with user selection
- Personal dashboard layout
- AI-powered daily quote generation
- Habit checklist with completion
- Today's meals display
- Progress tracking
- Smooth animations and transitions

**Deliverables:**

- User selection working
- Personal dashboards functional
- Habits checkable with persistence
- Daily quotes generating
- Beautiful, calm UI

---

**Phase 5: Cooking Wizard (Week 4)**

- Recipe detail view
- Step-by-step cooking interface
- Large, kitchen-friendly text
- Navigation between steps
- Ingredient checklist
- Progress indicator
- Completion celebration

**Deliverables:**

- Cooking wizard fully functional
- Easy navigation
- Kitchen-optimized UI
- Recipe completion tracking

---

**Phase 6: Voice Control & Polish (Week 5)**

- Voice command system
- Web Speech API integration
- AI-powered intent parsing
- Voice-activated actions
- Hands-free mode
- Final animations and polish
- Performance optimization
- Testing and bug fixes

**Deliverables:**

- Voice control working
- All features polished
- Smooth performance
- Production-ready app

---

## Success Metrics

**User Engagement:**

- Daily active users returning to check habits
- Completion rate of daily habits
- Weekly meal planning participation
- Recipe cooking completion rate

**Feature Usage:**

- Voice command adoption rate
- Grocery list check-off completion
- Recipe ratings and favorites
- Time spent in cooking wizard

**Household Impact:**

- Reduction in meal planning time
- Increase in home-cooked meals
- Habit streak lengths
- User satisfaction scores
