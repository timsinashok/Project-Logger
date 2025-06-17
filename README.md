# Project Logger: A Drizzle + Next.js Demo

**Project Logger** is a modern, type-safe multi-tenant application built with Drizzle ORM, Next.js (App Router), and Supabase (Postgres). It provides a clean, minimalistic interface for creating and managing projects with nested sections, scoped by company.

This app was developed as a learning exercise to explore Drizzle ORM in depth, including schema-first database modeling and type-safe querying. 

I leveraged **Gemini 2.5 Pro** a lot in the development process and to experiment with design patterns and assist with debugging migrations.

---

## 🧱 Tech Stack

- **Framework:** [Next.js 14+](https://nextjs.org/) (App Router)
- **ORM:** [Drizzle ORM](https://orm.drizzle.team/)
- **Database:** [Supabase](https://supabase.com/) (PostgreSQL)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)

---

## ✨ Features

- **Multi-Tenant Support:** All projects and sections are scoped to a company.
- **CRUD Functionality:** Full create, read, update, and delete flows for projects and their sections.
- **Section Utilities:** Add, delete, and duplicate project sections.
- **Pseudo-Auth:** Simple cookie-based session emulation to simulate users (no third-party auth).
- **Server Actions:** All data mutations are handled via [Next.js Server Actions](https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions).
- **Type-Safe End-to-End:** From database schema to client views using Drizzle.

---

## 🧭 Project Structure

```

/
├── src/
│   ├── app/
│   │   ├── \_components/       # Shared UI components
│   │   ├── login/             # Login interface
│   │   ├── actions.ts         # Server Actions for DB mutations
│   │   └── page.tsx           # Main dashboard view
│   └── lib/
│       ├── db/
│       │   ├── schema.ts      # Drizzle schema (source of truth)
│       │   ├── index.ts       # Drizzle client setup
│       │   └── seed.ts        # Seed script with sample users/projects
├── drizzle.config.ts          # Drizzle Kit config
└── .env.local.example         # Example environment config

````

---

## 🚀 Getting Started

### 1. Prerequisites

- Node.js `v18+`
- A [Supabase](https://supabase.com/) account

---

### 2. Clone & Install

```bash
git clone https://github.com/timsinashok/Project-Logger.git
cd Project-Logger
npm install
````

---

### 3. Set Up Environment Variables

Copy  .env file in the root directory:


In your Supabase dashboard, go to **Project Settings → Database**, and copy the connection string (URI format). Paste it in `.env.local` like so:

```env
# .env
DATABASE_URL="postgres://..."
```

---

### 4. Push the Database Schema

This will sync the schema from `schema.ts` to your Supabase DB:

```bash
npx drizzle-kit push
```

---

### 5. Seed the Database

To insert some starter data (e.g., sample users like "alice" and "bob"):

```bash
npm run drizzle:seed
```

---

### 6. Run the App

Start the development server:

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) and log in with any username to begin.

---

Enjoy experimenting with Drizzle ORM in a full-stack, type-safe Next.js environment! 🎉

