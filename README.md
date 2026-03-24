# BiSRide

A mobile delivery marketplace connecting businesses with riders in Lagos, Nigeria. Businesses post delivery requests and riders submit proposals — like a marketplace for last-mile delivery.

Built with Expo (React Native) for iOS and Android.

## Features

- **Business Dashboard** — Post delivery requests with package details, pickup/dropoff addresses, and budget
- **Rider Dashboard** — Browse open requests, submit proposals with pricing, manage active deliveries
- **Real-time Messaging** — In-app chat between businesses and riders with unread badges
- **Proposal System** — Riders propose prices; businesses accept/decline
- **Live Tracking** — GPS-based delivery tracking with maps
- **Profile Management** — Photo uploads, service areas, vehicle types, ratings
- **Role-based Access** — Separate flows for businesses and riders

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | [Expo](https://expo.dev/) (SDK 54) |
| Language | TypeScript |
| UI Components | [React Native Paper](https://callstack.github.io/react-native-paper/) |
| Navigation | [React Navigation](https://reactnavigation.org/) |
| Auth & Database | [Firebase](https://firebase.google.com/) (Auth + Firestore) |
| File Storage | [Supabase Storage](https://supabase.com/storage) |
| State Management | [Zustand](https://zustand.docs.pmnd.rs/) |
| Forms | [React Hook Form](https://react-hook-form.com/) + [Zod](https://zod.dev/) |
| Maps | [React Native Maps](https://github.com/react-native-maps/react-native-maps) |
| Icons | [Expo Vector Icons](https://icons.expo.fyi/) (MaterialCommunityIcons) |

## Getting Started

### Prerequisites

- Node.js 20+
- [Expo Go](https://expo.dev/go) app on your phone (for development)
- A [Firebase](https://console.firebase.google.com) project (Auth + Firestore enabled)
- A [Supabase](https://supabase.com) project (for file storage)

### 1. Install dependencies

```bash
cd mobile
npm install
```

### 2. Configure environment variables

Create a `.env` file in the `mobile/` directory:

```env
# Firebase — get from Firebase Console → Project Settings → Your apps → Web app
EXPO_PUBLIC_FIREBASE_API_KEY=your_api_key
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
EXPO_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.firebasestorage.app
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
EXPO_PUBLIC_FIREBASE_APP_ID=your_app_id

# Supabase — get from Supabase Dashboard → Project Settings → API
EXPO_PUBLIC_SUPABASE_URL=your_supabase_url
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 3. Firebase setup

1. Enable **Email/Password** authentication in Firebase Console → Authentication → Sign-in method
2. Create a **Firestore** database
3. Deploy indexes: `npx firebase deploy --only firestore:indexes`

### 4. Supabase setup

1. Create a **Storage bucket** named `profiles` (set to **public**)

### 5. Start the dev server

```bash
cd mobile
npx expo start
```

Scan the QR code with Expo Go on your phone to run the app.

## Project Structure

```
mobile/src/
├── components/
│   ├── delivery/          # Delivery tracking components
│   ├── maps/              # Map and location components
│   ├── messages/          # Chat bubbles, conversation list, message input
│   ├── requests/          # Request cards and forms
│   ├── riders/            # Rider-specific components
│   └── ui/                # Reusable UI components (EmptyState, etc.)
├── lib/
│   ├── firebase/          # Firebase config, auth, firestore helpers
│   ├── supabase/          # Supabase config & storage (profile photos)
│   ├── hooks/             # Custom React hooks
│   ├── stores/            # Zustand state management
│   ├── types/             # TypeScript type definitions
│   └── validators/        # Zod schemas for form validation
├── navigation/            # Tab navigators and stack navigators
├── screens/
│   ├── auth/              # Login & registration
│   ├── business/          # Dashboard, requests, proposals
│   ├── rider/             # Dashboard, browse, deliveries, profile
│   ├── messages/          # Conversations list & chat
│   └── settings/          # App settings
└── theme/                 # Colors, spacing, typography
```

## Deployment

This app uses [EAS (Expo Application Services)](https://expo.dev/eas) for building and distributing.

### Setup

```bash
npm install -g eas-cli
cd mobile
eas login
eas build:configure
```

### Build

```bash
# Preview build (shareable APK/IPA link, no app store needed)
eas build --profile preview --platform all

# Production build (for app store submission)
eas build --profile production --platform all
```

### Submit to app stores

```bash
eas submit --platform ios
eas submit --platform android
```

## License

Private project.
