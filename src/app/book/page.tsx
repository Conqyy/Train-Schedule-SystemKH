"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Train } from "@/models/types";
import { getTrains, bookTicket, BookingResult } from "@/controllers/trainService";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import { getCurrentUser } from "@/controllers/authService";

interface AuthProfile {
  userId: string;
  name: string;
  email: string;
}

/* ---------- Booking Form (inner, uses useSearchParams) ---------- */
function BookingForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const preselected = searchParams.get("train") || "";

  const [trains, setTrains] = useState<Train[]>([]);
  const [selectedTrain, setSelectedTrain] = useState(preselected);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [result, setResult] = useState<BookingResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [authProfile, setAuthProfile] = useState<AuthProfile | null>(null);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    setMounted(true);

    async function loadAuth() {
      if (isSupabaseConfigured()) {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const { data: profile } = await supabase
            .from("profiles")
            .select("full_name")
            .eq("id", user.id)
            .single();

          setAuthProfile({
            userId: user.id,
            name: profile?.full_name || user.email?.split("@")[0] || "",
            email: user.email || "",
          });
        }
      } else {
        const mockUser = getCurrentUser();
        if (mockUser) {
          setAuthProfile({
            userId: mockUser.email,
            name: mockUser.name,
            email: mockUser.email,
          });
        }
      }
      setAuthLoading(false);
    }

    async function loadTrains() {
      if (isSupabaseConfigured()) {
        try {
          const { data, error } = await supabase
            .from("trains")
            .select("*")
            .order("departure_time", { ascending: true });
          if (!error && data && data.length > 0) {
            setTrains(data.map((row: Record<string, unknown>) => ({
              id: row.id as string,
              name: row.train_name as string,
              origin: row.departure_station as string,
              destination: row.arrival_station as string,
              departureTime: row.departure_time as string,
              arrivalTime: row.arrival_time as string,
              totalSeats: row.total_seats as number,
              availableSeats: row.available_seats as number,
              price: row.price as number,
              status: (row.status as Train["status"]) || "on-time",
            })));
            return;
          }
        } catch { /* fall through */ }
      }
      setTrains(getTrains());
    }

    loadAuth();
    loadTrains();
  }, []);

  const selectedTrainData = trains.find((t) => t.id === selectedTrain);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const passengerName = authProfile?.name || name.trim();
    const passengerEmail = authProfile?.email || email.trim();
    if (!selectedTrain || !passengerName || !passengerEmail) return;

    setLoading(true);

    // ── Supabase booking ──
    if (isSupabaseConfigured() && authProfile) {
      try {
        const train = selectedTrainData;
        if (!train || train.availableSeats <= 0) {
          setResult({ success: false, message: "لا توجد مقاعد متاحة في هذا القطار" });
          setLoading(false);
          return;
        }

        const seatNumber = train.totalSeats - train.availableSeats + 1;

        const { data: reservation, error } = await supabase
          .from("reservations")
          .insert({
            user_id: authProfile.userId,
            train_id: selectedTrain,
            seat_number: seatNumber,
            passenger_name: passengerName,
            passenger_email: passengerEmail,
            status: "confirmed",
            booking_date: new Date().toISOString(),
          })
          .select()
          .single();

        if (error) {
          setResult({ success: false, message: "حدث خطأ أثناء الحجز: " + error.message });
          setLoading(false);
          return;
        }

        // Update available seats
        await supabase
          .from("trains")
          .update({ available_seats: train.availableSeats - 1 })
          .eq("id", selectedTrain);

        setResult({
          success: true,
          message: `تم تأكيد الحجز! المقعد #${seatNumber} على ${train.name} إلى ${train.destination}.`,
          reservation: {
            id: reservation.id,
            trainId: selectedTrain,
            passengerName,
            passengerEmail,
            seatNumber,
            bookingDate: new Date().toISOString(),
            status: "confirmed",
          },
        });
        setLoading(false);
        return;
      } catch {
        setResult({ success: false, message: "حدث خطأ في الاتصال بالخادم" });
        setLoading(false);
        return;
      }
    }

    // ── Fallback: mock booking ──
    setTimeout(() => {
      const res = bookTicket(selectedTrain, passengerName, passengerEmail);
      setResult(res);
      setLoading(false);
      if (res.success) setTrains(getTrains());
    }, 800);
  };

  const handleReset = () => {
    setResult(null);
    setName("");
    setEmail("");
    setSelectedTrain("");
  };

  if (!mounted || authLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="w-12 h-12 mx-auto rounded-full mb-4 animate-pulse" style={{ background: "rgba(20,184,166,0.15)" }} />
          <p className="text-lg" style={{ color: "#94a3b8" }}>جاري التحميل...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in-up">
      {/* Header */}
      <section className="text-center mb-10">
        <h1
          className="text-3xl md:text-4xl font-extrabold mb-3"
          style={{
            background: "linear-gradient(135deg, #14b8a6, #10b981, #0d9488)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          حجز تذكرة قطار 🎫
        </h1>
        <p className="text-base" style={{ color: "#94a3b8" }}>
          اختر رحلتك واحجز مقعدك فوراً
        </p>
      </section>

      <div className="max-w-2xl mx-auto">
        {/* Success / Error Result */}
        {result && (
          <div
            className="glass-card p-8 mb-8 text-center animate-fade-in-up"
            style={{
              borderColor: result.success ? "rgba(34, 197, 94, 0.3)" : "rgba(239, 68, 68, 0.3)",
            }}
          >
            <p className="text-5xl mb-4">{result.success ? "✅" : "❌"}</p>
            <h2 className="text-xl font-bold text-white mb-2">
              {result.success ? "تم تأكيد الحجز!" : "فشل الحجز"}
            </h2>
            <p className="mb-6" style={{ color: "#94a3b8" }}>
              {result.message}
            </p>
            {result.reservation && (
              <div
                className="rounded-xl p-4 mb-6 text-sm space-y-2"
                style={{ background: "rgba(20, 184, 166, 0.08)", textAlign: "right" }}
              >
                <p>
                  <span style={{ color: "#94a3b8" }}>رقم الحجز: </span>
                  <span className="font-mono text-white">{result.reservation.id}</span>
                </p>
                <p>
                  <span style={{ color: "#94a3b8" }}>رقم المقعد: </span>
                  <span className="font-bold text-white">#{result.reservation.seatNumber}</span>
                </p>
                <p>
                  <span style={{ color: "#94a3b8" }}>المسافر: </span>
                  <span className="text-white">{result.reservation.passengerName}</span>
                </p>
              </div>
            )}
            <div className="flex gap-3 justify-center flex-wrap">
              <button onClick={handleReset} className="btn-primary">حجز آخر</button>
              <button onClick={() => router.push("/my-reservations")} className="btn-secondary">حجوزاتي 📋</button>
              <button onClick={() => router.push("/")} className="btn-secondary">الجداول</button>
            </div>
          </div>
        )}

        {/* Booking Form */}
        {!result && (
          <form onSubmit={handleSubmit} className="glass-card p-8 space-y-6">
            {/* Logged-in user banner */}
            {authProfile && (
              <div style={{
                display: "flex", alignItems: "center", gap: "0.75rem",
                padding: "0.85rem 1rem", borderRadius: "14px",
                background: "rgba(20,184,166,0.06)",
                border: "1px solid rgba(20,184,166,0.12)",
              }}>
                <div style={{
                  width: "36px", height: "36px", borderRadius: "10px",
                  background: "linear-gradient(135deg, #0f766e, #14b8a6)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: "0.85rem", color: "#fff", fontWeight: 800, flexShrink: 0,
                }}>
                  {authProfile.name.charAt(0)}
                </div>
                <div>
                  <p style={{ fontSize: "0.85rem", fontWeight: 700, color: "#e2e8f0", margin: 0 }}>
                    {authProfile.name}
                  </p>
                  <p style={{ fontSize: "0.72rem", color: "#64748b", margin: 0, direction: "ltr" as const }}>
                    {authProfile.email}
                  </p>
                </div>
                <span style={{
                  marginRight: "auto", fontSize: "0.68rem", fontWeight: 700,
                  padding: "0.2rem 0.5rem", borderRadius: "999px",
                  color: "#4ade80", background: "rgba(34,197,94,0.08)",
                  border: "1px solid rgba(34,197,94,0.15)",
                }}>
                  ✓ مسجّل الدخول
                </span>
              </div>
            )}

            {/* Train Selection */}
            <div>
              <label htmlFor="train-select" className="block text-sm font-semibold mb-2 text-white">
                اختر القطار
              </label>
              <select
                id="train-select"
                value={selectedTrain}
                onChange={(e) => setSelectedTrain(e.target.value)}
                className="input-field"
                required
              >
                <option value="">— اختر رحلة —</option>
                {trains
                  .filter((t) => t.status !== "cancelled" && t.availableSeats > 0)
                  .map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.name} — {t.origin} → {t.destination} ({t.availableSeats} مقعد)
                    </option>
                  ))}
              </select>
            </div>

            {/* Selected Train Details */}
            {selectedTrainData && (
              <div
                className="rounded-xl p-4 space-y-2 animate-slide-in"
                style={{ background: "rgba(20, 184, 166, 0.06)" }}
              >
                <div className="flex justify-between text-sm">
                  <span style={{ color: "#94a3b8" }}>المسار</span>
                  <span className="text-white font-medium">{selectedTrainData.origin} → {selectedTrainData.destination}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span style={{ color: "#94a3b8" }}>المغادرة</span>
                  <span className="text-white font-medium">{selectedTrainData.departureTime}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span style={{ color: "#94a3b8" }}>الوصول</span>
                  <span className="text-white font-medium">{selectedTrainData.arrivalTime}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span style={{ color: "#94a3b8" }}>السعر</span>
                  <span className="font-bold" style={{ color: "#14b8a6" }}>{selectedTrainData.price} ريال</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span style={{ color: "#94a3b8" }}>المقاعد المتاحة</span>
                  <span className="font-bold text-white">{selectedTrainData.availableSeats} / {selectedTrainData.totalSeats}</span>
                </div>
              </div>
            )}

            {/* Manual Name & Email ONLY if not logged in */}
            {!authProfile && (
              <>
                <div>
                  <label htmlFor="passenger-name" className="block text-sm font-semibold mb-2 text-white">
                    اسم المسافر
                  </label>
                  <input
                    id="passenger-name"
                    type="text"
                    placeholder="مثال: خالد الفهد"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="input-field"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="passenger-email" className="block text-sm font-semibold mb-2 text-white">
                    البريد الإلكتروني
                  </label>
                  <input
                    id="passenger-email"
                    type="email"
                    placeholder="khalid@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="input-field"
                    required
                  />
                </div>
              </>
            )}

            {/* Submit */}
            <button
              id="submit-booking"
              type="submit"
              disabled={loading || !selectedTrain || (!authProfile && (!name.trim() || !email.trim()))}
              className="btn-primary w-full text-base py-3"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  جاري الحجز...
                </span>
              ) : (
                "تأكيد الحجز 🎫"
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

/* ---------- Page wrapper with Suspense ---------- */
export default function BookPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-[60vh]">
          <p className="text-xl" style={{ color: "#94a3b8" }}>جاري التحميل...</p>
        </div>
      }
    >
      <BookingForm />
    </Suspense>
  );
}
