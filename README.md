# 📖 Quotes App

A full-stack web application that lets users **sign up, fetch random quotes, and save their favorite ones**.  
It uses **Supabase** for authentication & database, and **Prisma ORM** as the API layer.  

---

## 🚀 Features

- 🔑 **Authentication**
  - User signup & login powered by Supabase Auth.
  - Only signed-in users can save quotes.

- 💬 **Quotes API**
  - Fetch random quotes from the database.
  - Optimized random selection (avoids `ORDER BY RANDOM()` overhead).
  - API built using Prisma ORM.

- ❤️ **Favorites**
  - Signed-in users can click the heart button to save quotes.
  - Saved quotes are linked to the user’s profile via `UUID`.

- 🛡️ **Database Security**
  - Supabase Row-Level Security (RLS) enabled.
  - Policies ensure:
    - Anyone can read public quotes.
    - Only authenticated users can insert saved quotes.
  - Public schema is accessible for signup & API reads.

- 🎨 **Frontend**
  - Built with React + TailwindCSS.
  - Custom gradient button with hover animations.
  - Heart icon turns red when clicked.

---

## 🏗️ Tech Stack

- **Frontend:** React, TailwindCSS, Lucide Icons
- **Backend/API:** Next.js (API routes), Prisma ORM
- **Database:** Supabase (Postgres with RLS)
- **Auth:** Supabase Authentication
- **Deployment:** Vercel
- **Flow:
User → Frontend → API Route (Prisma) → Supabase Database → Response shown in UI

---

##Architecture

- **Frontend (Next.js + React):
Handles the UI and user interactions (showing quotes, like button, login/signup).
- **Backend (Next.js API routes + Prisma):
Provides APIs like GET /api/quotes for fetching random quotes and POST /api/saved_quotes for saving them.
- **Database (Supabase - Postgres):
Stores users, quotes, and saved quotes.
Authentication is managed by Supabase, while Prisma acts as the ORM for database queries.

## 🗄️ Database Schema

```prisma
model profiles {
  id       String   @id @default(uuid())
  email    String   @unique
  username String
  saved    saved_quotes[]
}

model myQuote {
  id     String @id @default(uuid())
  quote  String
  author String
}

model saved_quotes {
  id        String   @id @default(uuid())
  quote     String
  author    String
  profileID String
  profile   profiles @relation(fields: [profileID], references: [id])
}
```

## ⚡ Setup Instructions  

1. Clone the repository:  
```sh
git clone https://github.com/yourusername/quotes-app.git
cd quotes-app
```
2. Install dependencies:
```
npm install
```
3. Add environment variables in .env:
```
DATABASE_URL="your-supabase-db-url"
DIRECT_URL="your-supabase-db-url"

NEXT_PUBLIC_SUPABASE_URL="your-supabase-url"
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY="your-supabase-anon-key"
```
4.Run Prisma migrations:
```
npx prisma generate
npx prisma migrate dev
```
5. Start development server:
```
npm run dev
```
