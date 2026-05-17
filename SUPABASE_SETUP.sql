-- ============================================================
-- SUPABASE_SETUP.sql
-- Riyadh Train Schedules — جداول قطارات الرياض
-- Database schema + seed data for Supabase PostgreSQL
-- ============================================================

-- ────────────────────────────────────────────
-- 1. TRAINS TABLE
-- ────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS trains (
  id              TEXT PRIMARY KEY,
  train_name      TEXT NOT NULL,
  departure_station TEXT NOT NULL,
  arrival_station TEXT NOT NULL,
  departure_time  TEXT NOT NULL,
  arrival_time    TEXT NOT NULL,
  total_seats     INTEGER NOT NULL DEFAULT 200,
  available_seats INTEGER NOT NULL DEFAULT 200,
  price           INTEGER NOT NULL DEFAULT 10,
  status          TEXT NOT NULL DEFAULT 'on-time'
                  CHECK (status IN ('on-time', 'delayed', 'cancelled')),
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ────────────────────────────────────────────
-- 2. PROFILES TABLE
-- ────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS profiles (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name   TEXT NOT NULL,
  email       TEXT UNIQUE NOT NULL,
  role        TEXT NOT NULL DEFAULT 'passenger'
              CHECK (role IN ('admin', 'passenger')),
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ────────────────────────────────────────────
-- 3. RESERVATIONS TABLE
-- ────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS reservations (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID REFERENCES profiles(id) ON DELETE SET NULL,
  train_id        TEXT NOT NULL REFERENCES trains(id) ON DELETE CASCADE,
  passenger_name  TEXT NOT NULL,
  passenger_email TEXT NOT NULL,
  seat_number     INTEGER NOT NULL,
  status          TEXT NOT NULL DEFAULT 'confirmed'
                  CHECK (status IN ('confirmed', 'cancelled')),
  booking_date    TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ────────────────────────────────────────────
-- 4. ROW LEVEL SECURITY (RLS)
-- ────────────────────────────────────────────
-- Enable RLS on all tables
ALTER TABLE trains ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE reservations ENABLE ROW LEVEL SECURITY;

-- Public read access to trains (anyone can view schedules)
CREATE POLICY "Public read access on trains"
  ON trains FOR SELECT
  USING (true);

-- Public read access to profiles (for now, during development)
CREATE POLICY "Public read access on profiles"
  ON profiles FOR SELECT
  USING (true);

-- Public read access to reservations (for development)
CREATE POLICY "Public read access on reservations"
  ON reservations FOR SELECT
  USING (true);

-- Allow inserts from anon key (for development / demo)
CREATE POLICY "Allow public inserts on profiles"
  ON profiles FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Allow public inserts on reservations"
  ON reservations FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Allow public updates on trains"
  ON trains FOR ALL
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow public updates on reservations"
  ON reservations FOR ALL
  USING (true)
  WITH CHECK (true);

-- ────────────────────────────────────────────
-- 5. SEED DATA — Riyadh Train Routes
--    محطة خالد (Khalid Station) = primary hub
-- ────────────────────────────────────────────
INSERT INTO trains (id, train_name, departure_station, arrival_station, departure_time, arrival_time, total_seats, available_seats, price, status)
VALUES
  ('RYD-001', 'خط المطار السريع',       'محطة خالد',              'مطار الملك خالد الدولي',    '05:30', '06:00', 300, 300, 25, 'on-time'),
  ('RYD-002', 'خط العليا',              'محطة خالد',              'العليا',                    '06:15', '06:45', 250, 250, 15, 'on-time'),
  ('RYD-003', 'خط كافد المالي',          'محطة خالد',              'مركز الملك عبدالله المالي',  '07:00', '07:25', 200, 200, 20, 'on-time'),
  ('RYD-004', 'خط الملز',               'الملز',                  'محطة خالد',                 '08:00', '08:20', 180, 180, 10, 'on-time'),
  ('RYD-005', 'خط البطحاء',             'محطة خالد',              'البطحاء',                   '09:30', '10:00', 220, 220, 12, 'delayed'),
  ('RYD-006', 'خط الدرعية',             'محطة خالد',              'الدرعية التاريخية',          '10:00', '10:35', 160, 160, 18, 'on-time'),
  ('RYD-007', 'خط جامعة الملك سعود',     'محطة خالد',              'جامعة الملك سعود',          '11:00', '11:30', 200, 200, 10, 'on-time'),
  ('RYD-008', 'خط المطار الليلي',        'مطار الملك خالد الدولي',   'محطة خالد',                 '22:00', '22:30', 280, 280, 25, 'on-time')
ON CONFLICT (id) DO NOTHING;

-- Default admin profile
INSERT INTO profiles (full_name, email, role)
VALUES ('مشرف النظام', 'admin@trains.com', 'admin')
ON CONFLICT (email) DO NOTHING;
