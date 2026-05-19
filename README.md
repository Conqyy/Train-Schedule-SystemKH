# 🚆 جداول قطارات الرياض — Riyadh Train Schedules

A full-featured Arabic (RTL) web application for managing train schedules, ticket reservations, and passenger accounts across Riyadh's metro network — built around **محطة خالد (Khalid Station)** as the central transit hub.

> **Built with:** Next.js 15 · React 19 · Tailwind CSS 4 · TypeScript · Supabase · localStorage (fallback)

---

## 📋 Features

| Feature | Description |
|---------|-------------|
| **🚆 Train Schedules** | Browse 8 Riyadh metro routes with real-time seat availability, pricing, and status badges (في الموعد / متأخر / ملغي) |
| **🎫 Ticket Booking** | Select a train, enter passenger details, and reserve a seat instantly |
| **📊 Admin Dashboard** | Staff overview with statistics, occupancy rates, and full reservation management |
| **⚙️ Train Management** | Admin CRUD — Add new trains, Edit schedules/capacity, Delete cancelled trains |
| **🔐 Authentication** | Dual login system with Supabase Auth + mock fallback — Customer login (light theme) and Admin login (dark slate/emerald) |
| **🔑 Password Recovery** | Forgot password flow with Supabase email reset and password update page |
| **📋 My Reservations** | Passengers can view and manage their own booking history |
| **📡 Live Status Widget** | Real-time train status updates displayed on the home page |
| **🔍 Search & Filter** | Search trains by name, station, or destination in Arabic |
| **❌ Cancellation** | Cancel reservations and automatically restore seat availability |
| **🌍 Arabic RTL** | Full Right-to-Left Arabic interface with Tajawal font |

----

## 🏗️ Architecture

This project follows the **MVC (Model-View-Controller) / 3-Tier Architecture**:

```
src/
├── models/                    # Data layer – TypeScript interfaces & mock data
│   ├── types.ts               # Train, User, Reservation interfaces
│   └── data.ts                # 8 Riyadh metro routes (محطة خالد hub)
├── controllers/               # Business logic layer
│   ├── trainService.ts        # Booking, cancellation, stats, train CRUD
│   └── authService.ts         # Mock authentication (login, register, logout)
├── lib/                       # External service integrations
│   └── supabase.ts            # Supabase client initialization & config
├── components/                # Shared UI components
│   ├── Navbar.tsx             # Auth-aware responsive navigation bar (RTL)
│   ├── Footer.tsx             # Site footer with links & branding
│   └── LiveStatusWidget.tsx   # Real-time train status display
└── app/                       # View layer (Next.js App Router pages)
    ├── layout.tsx             # Root layout (lang="ar", dir="rtl", Tajawal font)
    ├── globals.css            # Design system (glassmorphism, animations)
    ├── page.tsx               # Home – Riyadh train schedule grid + live status
    ├── book/
    │   └── page.tsx           # Booking form & confirmation
    ├── login/
    │   └── page.tsx           # Customer login (Supabase + mock fallback)
    ├── register/
    │   └── page.tsx           # Customer registration (Supabase + mock fallback)
    ├── forgot-password/
    │   └── page.tsx           # Password reset request (Supabase email)
    ├── update-password/
    │   └── page.tsx           # Set new password after reset
    ├── my-reservations/
    │   └── page.tsx           # Passenger reservation history & management
    └── admin/
        ├── page.tsx           # Admin dashboard (stats, CRUD, reservations)
        └── login/
            └── page.tsx       # Admin login (dark slate/emerald theme)
```

---

## 🚉 Riyadh Route Network

**محطة خالد (Khalid Station)** serves as the central hub with 6 departures and 2 arrivals:

| ID | Route | From → To | Time | Price |
|----|-------|-----------|------|-------|
| RYD-001 | خط المطار السريع | محطة خالد → مطار الملك خالد الدولي | 05:30–06:00 | 25 SAR |
| RYD-002 | خط العليا | محطة خالد → العليا | 06:15–06:45 | 15 SAR |
| RYD-003 | خط كافد المالي | محطة خالد → مركز الملك عبدالله المالي | 07:00–07:25 | 20 SAR |
| RYD-004 | خط الملز | الملز → محطة خالد | 08:00–08:20 | 10 SAR |
| RYD-005 | خط البطحاء | محطة خالد → البطحاء | 09:30–10:00 | 12 SAR |
| RYD-006 | خط الدرعية | محطة خالد → الدرعية التاريخية | 10:00–10:35 | 18 SAR |
| RYD-007 | خط جامعة الملك سعود | محطة خالد → جامعة الملك سعود | 11:00–11:30 | 10 SAR |
| RYD-008 | خط المطار الليلي | مطار الملك خالد الدولي → محطة خالد | 22:00–22:30 | 25 SAR |

---

## 🔐 Authentication

The app supports **dual authentication** — Supabase Auth (production) with a localStorage mock fallback (offline/demo):

| Login Type | URL | Credentials | Redirects To |
|-----------|-----|-------------|-------------|
| **Customer** | `/login` | Any registered email + password | `/` (Schedule) |
| **Admin** | `/admin/login` | `admin@trains.com` + password | `/admin` (Dashboard) |

### Auth Pages

| Page | URL | Description |
|------|-----|-------------|
| Customer Login | `/login` | Light teal/emerald theme, split-screen layout |
| Admin Login | `/admin/login` | Dark slate/emerald theme with security badge |
| Register | `/register` | New passenger account creation |
| Forgot Password | `/forgot-password` | Send password reset link via Supabase email |
| Update Password | `/update-password` | Set new password after reset token verification |

---

## 🗄️ Database

### Supabase (Production)

The app uses **Supabase** for authentication and data persistence. See [`SUPABASE_SETUP.sql`](./SUPABASE_SETUP.sql) for the full schema including:

- **`trains`** — Train schedules with RLS policies
- **`profiles`** — User profiles linked to Supabase Auth
- **`reservations`** — Booking records with foreign keys

### localStorage (Fallback)

When Supabase credentials are not configured, the app automatically falls back to **browser localStorage** with mock data — no setup required.

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18+ installed ([download](https://nodejs.org/))
- **npm** (comes with Node.js)
- **Supabase project** (optional — app works offline with mock data)

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/Conqyy/Train-Schedule-SystemKH.git

# 2. Navigate to the project
cd Train-Schedule-SystemKH

# 3. Install dependencies
npm install

# 4. (Optional) Configure Supabase
#    Create a .env.local file with your Supabase credentials:
#    NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
#    NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key

# 5. Start the development server
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000) in your browser.

### Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Optional | Your Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Optional | Your Supabase anonymous/public key |

> **Note:** If these variables are missing, the app will log a warning and fall back to localStorage mock data automatically.

### Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server on port 3000 |
| `npm run build` | Build production bundle |
| `npm run start` | Serve production build |
| `npm run lint` | Run ESLint checks |

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Framework** | Next.js 15 (App Router) |
| **UI Library** | React 19 |
| **Language** | TypeScript 5.8 |
| **Styling** | Tailwind CSS 4 + custom glassmorphism CSS |
| **Authentication** | Supabase Auth + mock fallback |
| **Database** | Supabase PostgreSQL + localStorage fallback |
| **Font** | Tajawal (Google Fonts) |
| **Deployment** | Vercel-ready |

---

## 👥 Team

| Name | Role |
|------|------|
| **Khalid** | Developer |
| **Turki** | Developer |
| **Ahmad** | Developer |

---

## 📄 Test Plan

See [`PHASE_3_TEST_PLAN.md`](./PHASE_3_TEST_PLAN.md) for the formal software engineering test plan covering:

| Category | Total Tests | Passed | Inconclusive |
|----------|-------------|--------|--------------|
| UC #4 — Ticket Reservation | 5 | 5 | 0 |
| UC #9 — Train Management | 5 | 4 | 1 |
| UC #1/#2/#8 — Authentication | 4 | 2 | 2 |
| **Total** | **14** | **11** | **3** |

---

## 📝 Notes

- **Dual data mode:** Supabase for production, localStorage for offline/demo — no database setup required to try the app.
- Use the **Reset All Data** button on the Admin Dashboard to restore default train routes.
- The project is pre-loaded with **8 Riyadh metro routes** centered on **محطة خالد (Khalid Station)**.
- The entire UI is in **Arabic (RTL)** using the **Tajawal** Google Font.
- Admin can **Add / Edit / Delete** trains from the Manage Trains tab.
- The **LiveStatusWidget** provides real-time operational status on the home page.
- Password recovery flows are fully integrated with Supabase email services.

---

## 📜 License

ISC

---

**جداول قطارات الرياض** · Riyadh Train Schedules v2.0 🇸🇦 🚀. 
