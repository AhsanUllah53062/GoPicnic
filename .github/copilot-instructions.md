# goPicnic AI Agent Instructions

## Project Overview

**goPicnic** is a React Native/Expo mobile app for trip planning, expense sharing, shopping, and carpool coordination. Built with Expo Router for file-based navigation and React Context API for state management. Firebase backend handles authentication and data persistence.

**Key Tech Stack:**

- Expo 54.0.20 (React Native universal app)
- Expo Router 6.0.13 (file-based routing)
- React 19.1.0 + TypeScript 5.9.2
- Firebase 12.7.0 (auth + Firestore)
- React Context API (Cart, Trip, User state)
- AsyncStorage 2.2.0 (persistent local data)
- React Navigation 7.4.0 (tabs + stack)

---

## Architecture & Critical Patterns

### 1. **State Management Layers**

Three global contexts manage app state:

- **`UserContext` (`src/context/UserContext.tsx`)**: User auth data (id, name, email, avatar)
  - Pattern: `const { user, setUser } = useUser()` - throws if used outside provider
  - Called in root `app/_layout.tsx` wrapped in `AuthProvider`

- **`TripContext` (`src/context/TripContext.tsx`)**: Trip planning (itinerary, expenses, budget, todos)
  - Complex state with nested DayItinerary[] and Expense[]
  - Includes notifications and budget tracking
  - Provider wraps entire app in `_layout.tsx`

- **`CartContext` (`src/context/CartContext.tsx`)**: E-commerce cart & orders
  - Persists to AsyncStorage automatically
  - Order history tracked with status (Processing/Shipped/Delivered)
  - Pattern: `const { cartItems, addToCart, removeFromCart } = useCart()`

**Provider Nesting** (root `_layout.tsx`):

```tsx
<GestureHandlerRootView> → <SafeAreaProvider> → <AuthProvider> →
<TripProvider> → <CartProvider> → <StatusBar/ThemeProvider> → <Stack/>
```

Always maintain this order for provider access in any new providers.

### 2. **File-Based Routing (Expo Router)**

Navigation structure mirrors filesystem under `/app`:

- **`app/(auth)/`**: Authentication screens (welcome, login, signup, forgot-password, otp-verification)
  - Entry point for unauthenticated users
  - No tab navigation in auth flow

- **`app/(tabs)/`**: Main app navigation after login
  - Horizontal tab bar with: home (index), carpool, create-plan, shopping, inbox, profile
  - Each tab can have internal stacks

- **`app/trip/[id].tsx`**: Dynamic trip details (route param: trip ID)
- **`app/shop/*`**: E-commerce flow (cart, checkout, payment, orders, product/[id])
- **`app/profile/*`**: User profile management (details, edit, security)
- **`app/chat/[username].tsx`** & **`notification/[id].tsx`**: Dynamic routes for messaging/notifications

**Route Parameter Pattern:**

```tsx
// In /app/trip/[id].tsx
import { useLocalSearchParams } from "expo-router";
const { id } = useLocalSearchParams();
```

### 3. **Service Layer** (`/services`)

API integration & external calls:

- **`services/firebase.ts`**: Firebase Auth (login, signup, logout, password reset)
  - Uses `react-native-dotenv` for `FIREBASE_API_KEY` config
  - Exports: `signUp()`, `signIn()`, `signOut()`, `resetPassword()`

- **`services/auth.ts`**: App-level authentication logic (wraps Firebase)

- **`services/weather.ts`**: OpenWeather API calls
  - `fetchWeather(lat, lon)` & `fetchForecast(lat, lon)`
  - Requires `OPENWEATHER_API_KEY` from `.env`

- **`services/places.ts`**: Places data (currently mock data)

**Environment Variables** (`.env` file - not in repo):

```
FIREBASE_API_KEY=
FIREBASE_AUTH_DOMAIN=
OPENWEATHER_API_KEY=
```

Must be added locally; used via `@env` import in services.

### 4. **Component Organization**

Reusable UI components in `/components`:

- **Presentational Components**: `CustomButton`, `DayCard`, `PlaceCard`, `ProductCard`
  - Props-driven, no business logic
  - Use React Native's `StyleSheet` for styles
  - Import from `react-native`, not `react-native-web`

- **Feature-Specific Subdirectories**:
  - `components/shop/`: CartIcon, CategoryTabs, ProductCard, SearchBar
  - `components/tabs/`: BudgetingTab, CarpoolTab, ItineraryTab, OverviewTab, TripDetailsTabs
  - `components/ui/`: Basic UI primitives (collapsible, icon-symbol)

- **Bottom Sheet Components**: ExpenseEditorBottomSheet, TimePickerBottomSheet
  - Use `@gorhom/bottom-sheet` v5.2.6
  - Imported in screens for modal editing

- **Exports Index**: `components/index.ts` exports all components for clean imports
  ```tsx
  export { default as CustomButton } from "./CustomButton";
  ```

### 5. **Type Safety**

Global types in `types.ts`:

- **`Place`**: id, name, location, temperature, rating, image (local require), imageUrl?, gallery[], reviews[]
  - `image` uses `ImageSourcePropType` (require())
  - `imageUrl` for dynamic/background images (string URI)

- **`Expense`** (TripContext): id, amount, currency, category, categoryIcon, paidBy, split, date?, description?
- **`CartItem`**: id, name, price, image, quantity
- **`Order`**: CartItem[], total, shipping info, trackingId, status enum

Add new global types to `types.ts`, feature-specific types in feature folders.

### 6. **Styling Conventions**

- **`StyleSheet.create()`** for all React Native styles (required for performance)
- **Theme colors** in `constants/theme.ts` (import for consistency)
- **No CSS/web styles** in React Native screens (use RN components: View, Text, ScrollView, FlatList)
- **Platform-specific files**: `.ios.ts`/`.web.ts` extensions (e.g., `use-color-scheme.ios.ts`)

### 7. **Custom Hooks**

Located in `/hooks`:

- **`use-color-scheme.ts`**: Dark/light mode detection (`useColorScheme()` from react-native)
- **`use-theme-color.ts`**: Custom theme utilities
- **Context Hooks**: `useUser()`, `useTrip()`, `useCart()` in respective contexts

Pattern: All context hooks throw error if used outside provider scope.

---

## Critical Workflows

### Starting Development

```bash
npm install                    # Install dependencies
npx expo start                # Start dev server (default web)
npm run android               # Run on Android emulator
npm run ios                   # Run on iOS simulator
npm run lint                  # Run ESLint
npm run reset-project         # Clear starter code
```

### Adding a New Feature

1. **Create context** if managing global state (e.g., `src/context/NewFeatureContext.tsx`)
2. **Add provider** to `app/_layout.tsx` nested correctly
3. **Create screens** under `app/feature-name/` following file-based routing
4. **Create components** in `components/feature-name/` subdirectory
5. **Create services** in `services/feature-name-api.ts` if calling external APIs
6. **Add types** to `types.ts` (global) or feature folder (feature-specific)

### Adding Firebase Features

1. Import from `services/firebase.ts`
2. Use within `AuthProvider` wrapped components
3. Example: `const { signIn } = useFirebaseAuth();`
4. Ensure `.env` has `FIREBASE_API_KEY`, etc.

### Testing & Debugging

- **Hot reload**: Exp + R (iOS) or R twice (Android)
- **Error handling**: Try-catch in services; use `.catch()` in contexts
- **Console logs**: `console.log()` visible in Metro bundler
- **Redux DevTools**: Not configured; use context with custom logging if needed

---

## Integration Points & Dependencies

### External APIs

- **OpenWeather**: `services/weather.ts` - requires API key
- **Google Places**: `react-native-google-places-autocomplete` - used in LocationSearchModal
- **Firebase**: Auth + Firestore (not fully integrated yet)

### Async Storage

- **CartContext** auto-persists cart to AsyncStorage
- **Key pattern**: `cart_items`, `orders`
- Used for offline support; sync on app reopen

### Navigation Interactions

- **Tabs ↔ Auth Flow**: Use `href` for cross-tab navigation
  ```tsx
  import { Link } from "expo-router";
  <Link href="/shop/cart">Go to Cart</Link>;
  ```
- **Modal Navigation**: Use `router.push()` with modal screens
  ```tsx
  import { useRouter } from "expo-router";
  const router = useRouter();
  router.push("/profile/edit");
  ```

### Data Flow Example (Shopping Feature)

```
User Action in ProductCard
  ↓ (onPress)
components/shop/ProductCard → calls addToCart()
  ↓ (context dispatch)
CartContext (useCart) → persists to AsyncStorage
  ↓ (useEffect listener)
components/shop/CartIcon shows updated count
  ↓ (navigation)
app/shop/cart.tsx displays CartContext.cartItems
```

---

## Project-Specific Conventions

### Naming

- **Screens**: PascalCase, match folder name (e.g., `ProfileEdit.tsx` → `profile/edit.tsx`)
- **Components**: PascalCase (e.g., `CustomButton.tsx`)
- **Services/hooks**: camelCase (e.g., `fetchWeather`, `useThemeColor`)
- **Context files**: PascalCase (e.g., `CartContext.tsx`)
- **Routes**: kebab-case in URLs (e.g., `/shop/cart`)

### Import Paths

- **Components**: `import { CustomButton } from '@/components'` or direct path
- **Contexts**: `import { useCart } from '@/src/context/CartContext'`
- **Services**: `import { fetchWeather } from '@/services/weather'`
- **Types**: `import { Place } from '@/types'`
- **No relative paths** (`../../../`) encouraged; use `@/` alias from `tsconfig.json`

### Error Handling

- **Services**: Throw errors with descriptive messages
  ```tsx
  if (!res.ok) throw new Error("Failed to fetch weather");
  ```
- **Contexts**: Catch and log, avoid crashing app
  ```tsx
  try {
    /* state update */
  } catch (e) {
    console.error(e);
  }
  ```
- **Components**: Show user-friendly error UI (Toast/Modal)

### Unused Patterns to Avoid

- ❌ Redux (not used; Context API sufficient)
- ❌ GraphQL (REST + Firebase only)
- ❌ Web CSS/Styled Components (RN StyleSheet only)
- ❌ `react-native-web` platform-specific web screens (uses conditional rendering instead)

---

## Known Limitations & Future Improvements

### Current Gaps

- ✅ Services layer exists but Firestore integration incomplete
- ✅ Error boundaries not implemented; add global error handler
- ✅ No input validation; add Zod/Yup for forms
- ✅ No offline-first sync (AsyncStorage only, no sync queue)
- ✅ Testing: No Jest/Vitest setup

### Scalability Notes

- **Structure review needed** (see RESTRUCTURING_PLAN.md in previous context)
  - Move `/services` → `/src/core/services`
  - Create `/src/features/` for feature-based organization
- **Performance**: FlatList optimization needed for large product/place lists
- **Bundle size**: Unused Expo modules should be pruned

---

## Quick Reference

| Task             | File/Command                                         | Notes                                          |
| ---------------- | ---------------------------------------------------- | ---------------------------------------------- |
| Add global state | `src/context/NewContext.tsx` + wrap in `_layout.tsx` | Use UserContext pattern                        |
| Add screen       | `app/feature/screen.tsx`                             | Auto-routed by Expo Router                     |
| Add component    | `components/feature/Component.tsx`                   | Export in `components/index.ts`                |
| Add API call     | `services/feature-api.ts`                            | Use .env for keys; throw on error              |
| Add type         | `types.ts`                                           | Global; feature types in feature folder        |
| Style screen     | `StyleSheet.create()`                                | No CSS; import theme from `constants/theme.ts` |
| Use theme        | `import { theme } from '@/constants/theme'`          | Access colors, spacing, fonts                  |
| Debug            | `console.log()` in Metro bundler                     | Exp + M to toggle menu                         |

---

## Feedback Needed

1. **Are service layer boundaries clear?** (weather, places, auth, firebase)
2. **Is the provider nesting order correct?** (GestureHandlerRootView → ... → Stack)
3. **Should feature-specific types live in feature folders** or all in `types.ts`?
4. **Any Expo-specific gotchas** we should document?
5. **Missing integrations** (Firestore sync, push notifications, analytics)?
