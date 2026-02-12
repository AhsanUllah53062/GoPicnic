# Firestore Setup & Configuration Guide

## What Changed in the Rules

### Key Updates for Carpool Feature:

1. **Added `isCarpoolOwner()` helper function**
   - Checks if current user is the carpool creator

2. **Added CollectionGroup Rule for Global Queries**

   ```
   match /{path=**}/carpools/{carpoolId}
   ```

   - Allows discovery feed to query all active carpools across all trips
   - Only authenticated users can read
   - Only carpool creator can modify

3. **Enhanced Carpool Subcollection Permissions**
   - Trip owner: Full read/write access
   - Any auth user: Read-only for active carpools (discovery)
   - Carpool owner: Can update/delete their own

4. **Added Join Requests Subcollection**
   - Tracks carpool join requests
   - Accessible to requester and carpool owner only

5. **Added Chat Messages Structure** (bonus)
   - Enables direct messaging between users

6. **Added Notifications Collection** (bonus)
   - For push notifications on join requests

---

## Step-by-Step Firestore Setup

### STEP 1: Deploy Updated Security Rules

**Option A: Using Firebase CLI (Recommended)**

```bash
# Install Firebase CLI if not already
npm install -g firebase-tools

# Login to Firebase
firebase login

# Initialize Firebase in your project (if not done)
firebase init firestore

# Deploy the rules
firebase deploy --only firestore:rules
```

**Option B: Using Firebase Console (Manual)**

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select your project
3. Navigate to **Firestore Database** → **Rules** tab
4. Replace all content with the `firestore.rules` file content
5. Click **Publish**

---

### STEP 2: Create Composite Indexes

Firestore requires composite indexes for multi-field queries. You have two options:

**Option A: Auto-Create via Firebase Console (Recommended)**

1. Run your app with the new carpool feature
2. Try to load the carpool discovery feed
3. Firebase will return error messages with links to create indexes
4. Click each link to auto-create the required indexes

**Option B: Manual Creation**

1. Go to Firebase Console → Firestore → **Indexes** tab
2. Click **Create Index**
3. Create these indexes:

| Collection Group | Field 1      | Field 2               | Field 3 |
| ---------------- | ------------ | --------------------- | ------- |
| carpools         | status (Asc) | departureDate (Asc)   | -       |
| carpools         | status (Asc) | chargePerPerson (Asc) | -       |
| carpools         | status (Asc) | seatsAvailable (Asc)  | -       |

**Index Creation Details:**

- Collection: Select "Collection Group" instead of single collection
- For each field, specify:
  - Field name (e.g., "status")
  - Sort order (Ascending or Descending)
  - Query scope (Collection)

---

### STEP 3: Set Up Firestore Data Structure

Ensure these collections/subcollections exist with proper data:

```
Firestore Database
├── trips/
│   ├── {tripId}/
│   │   ├── userId: "user123"
│   │   ├── fromLocation: "Lahore"
│   │   ├── toLocation: "Islamabad"
│   │   ├── startDate: timestamp
│   │   ├── endDate: timestamp
│   │   ├── budget: 50000
│   │   │
│   │   ├── carpools/
│   │   │   └── {carpoolId}/
│   │   │       ├── id: "carpool123"
│   │   │       ├── tripId: "trip123"
│   │   │       ├── createdBy: "user123"
│   │   │       ├── driverName: "Ahmed"
│   │   │       ├── carModel: "Honda Civic"
│   │   │       ├── chargePerPerson: 5000
│   │   │       ├── seatsAvailable: 3
│   │   │       ├── departureDate: timestamp
│   │   │       ├── status: "active"
│   │   │       ├── meetingPoint: "Gulberg"
│   │   │       ├── preferences: "quiet,clean,music"
│   │   │       ├── notes: "Non-smoker friendly"
│   │   │       │
│   │   │       └── joinRequests/
│   │   │           └── {requestId}/
│   │   │               ├── userId: "user456"
│   │   │               ├── tripOwnerId: "user123"
│   │   │               ├── status: "pending"
│   │   │               ├── message: "Can I join?"
│   │   │               └── createdAt: timestamp
│   │   │
│   │   ├── dayPlans/
│   │   │   └── {dayId}/...
│   │   │
│   │   └── expenses/
│   │       └── {expenseId}/...
│   │
│   └── {tripId2}/... (more trips)
│
├── users/
│   └── {userId}/
│       ├── uid: "user123"
│       ├── name: "Ahmed Hassan"
│       ├── email: "ahmed@example.com"
│
├── userProfiles/
│   └── {userId}/
│       ├── displayName: "Ahmed"
│       ├── photoURL: "..."
│       ├── preferences: {...}
│
├── chats/
│   └── {chatId}/
│       ├── participant1: "user123"
│       ├── participant2: "user456"
│       └── messages/
│           └── {messageId}/
│               ├── senderId: "user123"
│               ├── text: "Hey!"
│               └── timestamp: timestamp
│
├── notifications/
│   └── {notificationId}/
│       ├── userId: "user123"
│       ├── type: "join_request"
│       ├── carpoolId: "carpool123"
│       ├── read: false
│       └── createdAt: timestamp
│
└── friendships/
    └── {friendshipId}/
        ├── senderId: "user123"
        ├── receiverId: "user456"
        └── status: "pending"
```

---

### STEP 4: Verify Collections & Documents

In Firebase Console, check:

1. **Firestore Database** tab → Collections list
2. Verify these exist:
   - `trips`
   - `users`
   - `userProfiles`
   - `friendships`
   - (Optional: `chats`, `notifications`)

3. For each trip, verify subcollections:
   - `carpools` (with at least one document for testing)
   - `dayPlans`
   - `expenses`

4. For each carpool, verify subcollection:
   - `joinRequests` (can be empty)

---

### STEP 5: Test the Query (Before Running App)

In Firebase Console → Firestore → **Rules** tab, use the **Rules Playground**:

```javascript
// Test 1: Query all active carpools
db.collectionGroup("carpools")
  .where("status", "==", "active")
  .orderBy("departureDate", "asc")
  .get();

// Expected: Returns all active carpools across all trips
```

If you get "Index not found" error → Click the link to create the index.

---

### STEP 6: Update Your App Code (if needed)

The `carpoolDiscovery.ts` service should have:

```typescript
import { query, collectionGroup, where, orderBy } from "firebase/firestore";
import { db } from "./firebase";

export async function getAllAvailableCarpools() {
  try {
    const carpoolsQuery = query(
      collectionGroup(db, "carpools"),
      where("status", "==", "active"),
      orderBy("departureDate", "asc"),
    );

    const snapshot = await getDocs(carpoolsQuery);
    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.error("Error fetching carpools:", error);
    throw error;
  }
}
```

---

### STEP 7: Enable Firestore in Console

1. Go to Firebase Console → Your Project
2. Navigate to **Firestore Database**
3. If not already enabled, click **Create Database**
4. Choose:
   - **Location**: Select closest to your users (e.g., us-east1, europe-west1)
   - **Start in Production mode** (we've configured rules for security)
5. Click **Create**

---

### STEP 8: Test Full Feature

Once all above steps complete:

1. **Start your app**: `npx expo start`
2. Navigate to **Carpool Tab** (Bottom tab bar)
3. Should see:
   - Loading spinner initially
   - List of active carpools (if any exist)
   - Filter pills: Soonest, Cheapest, Seats
   - Pull-to-refresh functionality

4. **Test join flow**:
   - Tap on a carpool card
   - Details modal opens
   - Add optional message
   - Tap "Request to Join"
   - Check Firestore → carpools → joinRequests (new request created)

---

## Troubleshooting

### Issue: "Permission denied" error when loading carpools

**Checklist**:

- ✅ Rules deployed successfully
- ✅ User is authenticated (logged in)
- ✅ At least one carpool exists with `status: "active"`
- ✅ CollectionGroup rule allows read for authenticated users

**Fix**:

```javascript
// In browser console
firebase.auth().currentUser; // Should return user object
db.collectionGroup("carpools").get(); // Should work if authenticated
```

### Issue: "Index not found" error

**Solution**:

1. Run the app carpool tab
2. Check browser console for error with link
3. Click the link → Creates index automatically
4. Wait 5-10 minutes for index to build
5. Retry the query

### Issue: No carpools showing

**Checks**:

1. Create test carpool in Firestore Console:

   ```
   trips/{tripId}/carpools/{newCarpool}
   ├── status: "active"
   ├── departureDate: tomorrow's date
   ├── chargePerPerson: 5000
   ├── createdBy: "test-user-id"
   └── seatsAvailable: 2
   ```

2. User must be logged in (check `useUser()`)
3. Firestore rules must allow read on active carpools

---

## Summary Checklist

- [ ] Deploy updated firestore.rules
- [ ] Create 3 composite indexes (or let auto-create)
- [ ] Verify collections exist in Firestore
- [ ] Test collectionGroup query in Rules Playground
- [ ] Firestore Database enabled and configured
- [ ] At least one test carpool created with status="active"
- [ ] App tested → Carpool tab loads carpools
- [ ] Join request flow tested
- [ ] All errors cleared

**You're now ready to use the carpool discovery feature!** 🎉
