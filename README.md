# BiSRide

A delivery platform connecting businesses with riders in Lagos, Nigeria. Businesses post delivery requests and riders submit proposals — like a marketplace for last-mile delivery.

## Features

- **Business Dashboard** — Post delivery requests with package details, pickup/dropoff addresses, and budget
- **Rider Dashboard** — Browse open requests, submit proposals with pricing, manage active deliveries
- **Real-time Messaging** — In-app chat between businesses and riders for each delivery
- **Proposal System** — Riders propose prices; businesses accept/decline
- **Profile Management** — Photo uploads, service areas, vehicle types, ratings
- **Role-based Access** — Separate flows for businesses and riders

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | [Next.js 15](https://nextjs.org/) (App Router) |
| Language | TypeScript |
| Styling | [Tailwind CSS 4](https://tailwindcss.com/) |
| UI Components | [Radix UI](https://www.radix-ui.com/) + [shadcn/ui](https://ui.shadcn.com/) |
| Auth & Database | [Firebase](https://firebase.google.com/) (Auth + Firestore) |
| File Storage | [Supabase Storage](https://supabase.com/storage) |
| State Management | [Zustand](https://zustand.docs.pmnd.rs/) |
| Forms | [React Hook Form](https://react-hook-form.com/) + [Zod](https://zod.dev/) |
| Icons | [Lucide React](https://lucide.dev/) |

## Getting Started

### Prerequisites

- Node.js 20+
- A [Firebase](https://console.firebase.google.com) project (Auth + Firestore enabled)
- A [Supabase](https://supabase.com) project (for file storage)

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment variables

Copy `.env.local.example` or create `.env.local` with your credentials:

```env
# Firebase — get from Firebase Console → Project Settings → Your apps → Web app
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# Google Maps
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_api_key

# Supabase — get from Supabase Dashboard → Project Settings → API
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 3. Firebase setup

1. Enable **Email/Password** authentication in Firebase Console → Authentication → Sign-in method
2. Create a **Firestore** database
3. Add composite indexes as needed (Firebase will prompt you with links in the console when queries require them)

### 4. Supabase setup

1. Create a **Storage bucket** named `profiles` (set to **public**)

### 5. Run the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
src/
├── app/
│   ├── (auth)/              # Login & registration pages
│   ├── (dashboard)/
│   │   ├── business/        # Business dashboard, requests, proposals
│   │   ├── rider/           # Rider dashboard, browse, profile, deliveries
│   │   ├── messages/        # Messaging system
│   │   └── settings/        # App settings
│   └── page.tsx             # Landing page
├── components/
│   ├── auth/                # Login & register forms
│   ├── layout/              # Sidebar, topbar, mobile nav, role guard
│   ├── messages/            # Chat window, conversation list, message input
│   ├── requests/            # Request cards, forms, status badges
│   ├── riders/              # Proposal form
│   └── ui/                  # Reusable UI components (shadcn/ui)
└── lib/
    ├── firebase/            # Firebase config, auth, firestore helpers
    ├── supabase/            # Supabase config & storage (profile photos)
    ├── stores/              # Zustand state management
    ├── types/               # TypeScript type definitions
    ├── validators/          # Zod schemas for form validation
    └── utils.ts             # Utility functions
```

## License

Private project.
