# 🚆 جداول قطارات الرياض — Riyadh Train Schedules

A localized Arabic (RTL) web application for managing train schedules and ticket reservations across Riyadh's metro network — built around **محطة خالد (Khalid Station)** as the central hub.

> **Built with:** Next.js 15 · React 19 · Tailwind CSS 4 · TypeScript · localStorage

---

## 📋 Features

| Feature | Description |
|---------|-------------|
| **🚆 Train Schedules** | Browse 8 Riyadh metro routes with real-time seat availability, pricing, and status badges (في الموعد / متأخر / ملغي) |
| **🎫 Ticket Booking** | Select a train, enter passenger details, and reserve a seat instantly |
| **📊 Admin Dashboard** | Staff overview with statistics, occupancy rates, and full reservation management |
| **⚙️ Train Management** | Admin CRUD — Add new trains, Edit schedules/capacity, Delete cancelled trains |
| **🔐 Authentication** | Dual login system — Customer login (light theme) and Admin login (dark slate/emerald) |
| **🔍 Search & Filter** | Search trains by name, station, or destination in Arabic |
| **❌ Cancellation** | Cancel reservations and automatically restore seat availability |
| **🌍 Arabic RTL** | Full Right-to-Left Arabic interface with Tajawal font |

## 🏗️ Architecture

This project follows the **MVC (Model-View-Controller) / 3-Tier Architecture**:

```
src/
├── models/              # Data layer – TypeScript interfaces & mock data
│   ├── types.ts         # Train, User, Reservation interfaces
│   └── data.ts          # 8 Riyadh metro routes (محطة خالد hub)
├── controllers/         # Business logic layer
│   ├── trainService.ts  # Booking, cancellation, stats, train CRUD
│   └── authService.ts   # Mock authentication (login, register, logout)
├── components/          # Shared UI components
│   └── Navbar.tsx       # Auth-aware responsive navigation bar (RTL)
└── app/                 # View layer (Next.js App Router pages)
    ├── layout.tsx       # Root layout (lang="ar", dir="rtl", Tajawal font)
    ├── globals.css      # Design system (glassmorphism, animations)
    ├── page.tsx         # Home – Riyadh train schedule grid
    ├── book/
    │   └── page.tsx     # Booking form & confirmation
    ├── login/
    │   └── page.tsx     # Customer login (Arabic, light theme)
    ├── register/
    │   └── page.tsx     # Customer registration
    └── admin/
        ├── page.tsx     # Admin dashboard (stats, CRUD, reservations)
        └── login/
            └── page.tsx # Admin login (Arabic, dark slate/emerald)
```

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

## 🔐 Authentication

| Login Type | URL | Email | Password | Redirects To |
|-----------|-----|-------|----------|-------------|
| **Customer** | `/login` | Any registered email | Matching password | `/` (Schedule) |
| **Admin** | `/admin/login` | `admin@trains.com` | Any password | `/admin` (Dashboard) |

- Customer login uses a **light theme** with Arabic RTL layout
- Admin login uses a **dark slate/emerald theme** with a security badge
- New users can register at `/register`

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18+ installed ([download](https://nodejs.org/))
- **npm** (comes with Node.js)

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/Conqyy/Train-Schedule-SystemKH.git

# 2. Navigate to the project
cd Train-Schedule-SystemKH

# 3. Install dependencies
npm install

# 4. Start the development server
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000) in your browser.

### Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server on port 3000 |
| `npm run build` | Build production bundle |
| `npm run start` | Serve production build |
| `npm run lint` | Run ESLint checks |

## 👥 Team

| Name | Role |
|------|------|
| **Khalid** | Developer |
| **Turki** | Developer |
| **Ahmad** | Developer |

## 📝 Notes

- Data is stored in the browser's **localStorage** — no database setup required.
- Use the **Reset All Data** button on the Admin Dashboard to restore defaults.
- The project is pre-loaded with **8 Riyadh metro routes** centered on **محطة خالد (Khalid Station)**.
- The entire UI is in **Arabic (RTL)** using the **Tajawal** Google Font.
- Admin can **Add / Edit / Delete** trains from the Manage Trains tab.

## 📄 Test Plan

See [`PHASE_3_TEST_PLAN.md`](./PHASE_3_TEST_PLAN.md) for the formal software engineering test plan covering:
- Use Case #4 — Process Ticket Reservation (5 test cases)
- Use Case #9 — Manage Train Schedules (5 test cases)
- Use Cases #1/#2/#8 — Authentication (4 test cases)

---

**جداول قطارات الرياض** · Riyadh Train Schedules v1.0 🇸🇦 🚀
