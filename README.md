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

---


---

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
