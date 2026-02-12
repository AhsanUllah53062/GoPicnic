# Current Project Structure (Important Files Only)

```
goPicnic/
├── 📁 app/ (Expo Router - File-based routing)
│   ├── _layout.tsx (Root layout with all providers)
│   ├── index.tsx (Redirect to /auth/welcome)
│   │
│   ├── 📁 (auth)/ (Unauthenticated routes)
│   │   ├── welcome.tsx
│   │   ├── login.tsx
│   │   ├── signup.tsx
│   │   ├── forgot-password.tsx
│   │   ├── otp-verification.tsx
│   │   └── create-new-password.tsx
│   │
│   ├── 📁 (tabs)/ (Main app with bottom tabs)
│   │   ├── _layout.tsx (Tab navigation)
│   │   ├── index.tsx (Home tab)
│   │   ├── carpool.tsx (Carpool tab)
│   │   ├── create-plan.tsx (Plan tab)
│   │   ├── shopping.tsx (Shopping tab)
│   │   ├── inbox.tsx (Messages tab)
│   │   └── profile.tsx (Profile tab)
│   │
│   ├── 📁 profile/ (Nested profile screens)
│   │   ├── details.tsx
│   │   ├── edit.tsx
│   │   ├── security.tsx
│   │   ├── preferences.tsx
│   │   ├── documents.tsx
│   │   ├── personal-info.tsx
│   │   ├── favorites.tsx
│   │   ├── friends.tsx
│   │   ├── gear.tsx
│   │   ├── help.tsx
│   │   └── emergency.tsx
│   │
│   ├── 📁 shop/ (E-commerce routes)
│   │   ├── cart.tsx
│   │   ├── checkout.tsx
│   │   ├── payment.tsx
│   │   ├── orders.tsx
│   │   ├── product-detail.tsx
│   │   ├── order-confirmation.tsx
│   │   └── 📁 product/ (Dynamic product routes)
│   │
│   ├── 📁 chat/ (Dynamic routes)
│   │   └── [username].tsx
│   │
│   ├── 📁 notification/ (Dynamic routes)
│   │   └── [id].tsx
│   │
│   ├── 📁 place/ (Dynamic routes)
│   │   └── [id].tsx
│   │
│   ├── 📁 trip/ (Dynamic routes)
│   │   └── [id].tsx
│   │
│   └── 📁 trip-details/ (Trip management)
│       ├── start-planning.tsx (Trip creation form)
│       └── trip-details.tsx (Trip details with tabs)
│
├── 📁 src/
│   └── 📁 context/ (Global state management)
│       ├── UserContext.tsx (User auth state)
│       ├── TripContext.tsx (Trip planning state)
│       └── CartContext.tsx (Shopping cart state)
│
├── 📁 components/ (Reusable UI components)
│   ├── CarpoolPlaceCard.tsx
│   ├── LocationSearchModal.tsx
│   ├── index.ts (Component exports)
│   │
│   ├── 📁 budget/ (Budget feature)
│   │   ├── CategorySelector.tsx
│   │   ├── ExpenseCard.tsx
│   │   └── ExpenseEditorModal.tsx
│   │
│   ├── 📁 carpool/ (Carpool feature)
│   │   ├── CarpoolCard.tsx
│   │   ├── CarpoolEditorModal.tsx
│   │   └── MeetingPointSelector.tsx
│   │
│   ├── 📁 common/ (UI Primitives & Styling)
│   │   ├── Button.tsx
│   │   ├── LoadingSpinner.tsx
│   │   ├── CustomButton.tsx
│   │   ├── CustomPicker.tsx
│   │   ├── PageIndicator.tsx
│   │   ├── SectionHeader.tsx
│   │   ├── themed-text.tsx
│   │   └── themed-view.tsx
│   │
│   ├── 📁 home/ (Home tab)
│   │   ├── PlaceCard.tsx
│   │   └── ProvinceDropdown.tsx
│   │
│   ├── 📁 itinerary/ (Itinerary feature)
│   │   ├── DayCard.tsx
│   │   ├── AddPlaceModal.tsx
│   │   ├── PlaceVisitCard.tsx
│   │   └── TodoItem.tsx
│   │
│   ├── 📁 place/ (Place details UI)
│   │   ├── Gallery.tsx
│   │   ├── ImageItem.tsx
│   │   ├── LocationModal.tsx
│   │   ├── ReviewsModal.tsx
│   │   ├── PlaceHeader.tsx
│   │   ├── PlaceInfo.tsx
│   │   ├── PlaceActions.tsx
│   │   └── weather.tsx
│   ├── 📁 overview/
│   │
│   ├── 📁 profile/ (Profile UI components)
│   │   ├── ProfileHeader.tsx
│   │   ├── ProfileMenuItem.tsx
│   │   ├── SettingsModal.tsx
│   │   └── TripCard.tsx
│   │
│   ├── 📁 shop/ (E-commerce UI)
│   │   ├── CartIcon.tsx
│   │   ├── CategoryTabs.tsx
│   │   ├── ProductCard.tsx
│   │   └── SearchBar.tsx
│   │
│   ├── 📁 tabs/ (Tab screen components)
│   │   ├── TripDetailsTabs.tsx (Main tab switcher)
│   │   ├── OverviewTab.tsx
│   │   ├── ItineraryTab.tsx
│   │   ├── BudgetingTab.tsx
│   │   └── CarpoolTab.tsx
│   │
│   └── 📁 ui/ (UI primitives)
│
├── 📁 services/ (API & business logic)
│   ├── firebase.ts (Firebase Auth)
│   ├── auth.ts (App-level auth)
│   ├── weather.ts (OpenWeather API)
│   ├── places.ts (Places data)
│   ├── carpool.ts (Carpool logic)
│   ├── expenses.ts (Expense calculations)
│   ├── itinerary.ts (Itinerary management)
│   ├── trips.ts (Trip CRUD)
│   ├── profile.ts (Profile management)
│   ├── imageUpload.ts (Image uploads)
│   ├── googlePlaces.ts (Google Places API)
│   └── tripSummary.ts (Trip summaries)
│
├── 📁 constants/
│   └── theme.ts (Colors, fonts, spacing)
│
├── 📁 hooks/ (Custom React hooks)
│   ├── use-color-scheme.ts
│   ├── use-color-scheme.ios.ts
│   ├── use-color-scheme.web.ts
│   ├── use-theme-color.ts
│   └── useAuth.ts
│
├── 📁 data/ (Static mock data)
│   ├── categories.ts
│   └── products.ts
│
├── 📁 assets/ (Images, fonts)
│   └── 📁 images/
│
├── 📁 .github/
│   └── copilot-instructions.md (AI agent instructions)
│
├── 📄 types.ts (Global TypeScript types)
├── 📄 tsconfig.json (TypeScript configuration)
├── 📄 package.json (Dependencies & scripts)
├── 📄 app.json (Expo configuration)
├── 📄 babel.config.js (Babel transpiler config)
├── 📄 eslint.config.js (ESLint rules)
├── 📄 .env (Environment variables - not in repo)
└── 📄 README.md
```

## Key Statistics

- **Screen Files**: 35+ (in /app directory)
- **Component Files**: 45+ (in /components directory)
- **Service Files**: 12 (in /services directory)
- **Context Files**: 3 (in /src/context directory)
- **Total TypeScript files**: ~100+

## Recent Changes (Phase 1 Restructuring)

- ✅ Moved UI primitives to `/components/common/`: CustomButton, CustomPicker, PageIndicator, SectionHeader, themed-text, themed-view
- ✅ Moved place-related components to `/components/place/`: Gallery, ImageItem, LocationModal, ReviewsModal, weather
- ✅ Moved DayCard to `/components/itinerary/`
- ✅ Deleted orphaned components: TimePickerBottomSheet, ExpenseEditorBottomSheet (replaced by ExpenseEditorModal)
- ✅ Fixed navigation paths for trip details from profile screen
- ✅ Removed duplicate `/app/start-planning.tsx` file

## Architecture Layers

### 1. **Routing Layer** (`/app`)

- Expo Router handles all navigation
- File-based routing (filesystem = routes)
- Dynamic routes with `[param]` syntax

### 2. **State Management** (`/src/context`)

- UserContext: Authentication & user data
- TripContext: Trip planning & itinerary
- CartContext: Shopping cart & orders

### 3. **Business Logic** (`/services`)

- API calls (Firebase, OpenWeather, Google Places)
- Data calculations (expenses, carpool logic)
- Service-specific functions

### 4. **UI Components** (`/components`)

- Reusable presentational components
- Feature-specific subdirectories
- Theme and styling consistency

### 5. **Configuration** (root level)

- TypeScript config (tsconfig.json)
- Expo config (app.json, expo-env.d.ts)
- Build config (babel.config.js)
- Type definitions (types.ts)
