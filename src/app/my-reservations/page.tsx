"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import { getReservations, cancelReservation } from "@/controllers/trainService";
import { getCurrentUser } from "@/controllers/authService";

interface ReservationItem {
  id: string;
  train_id: string;
  train_name: string;
  origin: string;
  destination: string;
  departure_time: string;
  seat_number: number;
  status: string;
  booking_date: string;
  passenger_name: string;
}

export default function MyReservationsPage() {
  const router = useRouter();
  const [reservations, setReservations] = useState<ReservationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [cancellingId, setCancellingId] = useState<string | null>(null);
  const [userName, setUserName] = useState("");

  useEffect(() => {
    async function load() {
      if (isSupabaseConfigured()) {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) { router.push("/login"); return; }

        // Get profile name
        const { data: profile } = await supabase
          .from("profiles")
          .select("full_name")
          .eq("id", user.id)
          .single();
        setUserName(profile?.full_name || user.email || "");

        // Get reservations with train info
        const { data, error } = await supabase
          .from("reservations")
          .select(`
            id,
            train_id,
            seat_number,
            status,
            booking_date,
            passenger_name,
            trains ( train_name, departure_station, arrival_station, departure_time )
          `)
          .eq("user_id", user.id)
          .order("booking_date", { ascending: false });

        if (!error && data) {
          setReservations(data.map((r: Record<string, unknown>) => {
            const train = r.trains as Record<string, string> | null;
            return {
              id: r.id as string,
              train_id: r.train_id as string,
              train_name: train?.train_name || "",
              origin: train?.departure_station || "",
              destination: train?.arrival_station || "",
              departure_time: train?.departure_time || "",
              seat_number: r.seat_number as number,
              status: r.status as string,
              booking_date: r.booking_date as string,
              passenger_name: r.passenger_name as string,
            };
          }));
        }
      } else {
        // Mock fallback
        const user = getCurrentUser();
        if (!user) { router.push("/login"); return; }
        setUserName(user.name);
        const all = getReservations();
        setReservations(all.map(r => ({
          id: r.id,
          train_id: r.trainId,
          train_name: r.trainId,
          origin: "",
          destination: "",
          departure_time: "",
          seat_number: r.seatNumber,
          status: r.status,
          booking_date: r.bookingDate,
          passenger_name: r.passengerName,
        })));
      }
      setLoading(false);
    }
    load();
  }, [router]);

  const handleCancel = async (id: string) => {
    setCancellingId(id);
    if (isSupabaseConfigured()) {
      // Update status to cancelled
      const { error } = await supabase
        .from("reservations")
        .update({ status: "cancelled" })
        .eq("id", id);

      if (!error) {
        setReservations(prev => prev.map(r => r.id === id ? { ...r, status: "cancelled" } : r));
      }
    } else {
      cancelReservation(id);
      setReservations(prev => prev.map(r => r.id === id ? { ...r, status: "cancelled" } : r));
    }
    setCancellingId(null);
  };

  const statusMap: Record<string, { color: string; bg: string; border: string; label: string }> = {
    confirmed: { color: "#4ade80", bg: "rgba(34,197,94,0.1)", border: "rgba(34,197,94,0.2)", label: "مؤكد" },
    cancelled: { color: "#f87171", bg: "rgba(239,68,68,0.1)", border: "rgba(239,68,68,0.2)", label: "ملغي" },
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="w-12 h-12 mx-auto rounded-full mb-4 animate-pulse" style={{ background: "rgba(20,184,166,0.15)" }} />
          <p className="text-lg" style={{ color: "#94a3b8" }}>جاري تحميل الحجوزات...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in-up">
      {/* Header */}
      <section className="mb-10">
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.5rem" }}>
          <h1
            className="text-3xl md:text-4xl font-black"
            style={{
              background: "linear-gradient(135deg, #ffffff, #94a3b8)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            حجوزاتي
          </h1>
          <span style={{
            display: "inline-flex", alignItems: "center", gap: "0.3rem",
            fontSize: "0.75rem", fontWeight: 700, padding: "0.25rem 0.65rem", borderRadius: "999px",
            color: "#14b8a6", background: "rgba(20,184,166,0.1)", border: "1px solid rgba(20,184,166,0.2)",
          }}>
            {reservations.filter(r => r.status === "confirmed").length} حجز نشط
          </span>
        </div>
        <p style={{ color: "#64748b", fontSize: "0.95rem" }}>
          مرحباً {userName}، هنا جميع حجوزاتك السابقة والحالية
        </p>
      </section>

      {reservations.length === 0 ? (
        <div style={{
          textAlign: "center", padding: "4rem 2rem",
          borderRadius: "20px", background: "rgba(15,23,42,0.6)",
          backdropFilter: "blur(16px)", border: "1px solid rgba(71,85,105,0.35)",
        }}>
          <p style={{ fontSize: "3rem", marginBottom: "1rem" }}>🎫</p>
          <h2 style={{ fontSize: "1.3rem", fontWeight: 800, color: "#f1f5f9", marginBottom: "0.5rem" }}>لا توجد حجوزات</h2>
          <p style={{ color: "#64748b", marginBottom: "1.5rem" }}>لم تقم بحجز أي تذكرة بعد</p>
          <Link href="/book" className="btn-primary" style={{ fontSize: "0.9rem", padding: "0.65rem 2rem" }}>
            احجز رحلتك الأولى 🚆
          </Link>
        </div>
      ) : (
        <div style={{ display: "grid", gap: "1rem" }}>
          {reservations.map((r) => {
            const st = statusMap[r.status] || statusMap.confirmed;
            const isCancelled = r.status === "cancelled";

            return (
              <div key={r.id} style={{
                borderRadius: "18px",
                background: "rgba(15,23,42,0.6)",
                backdropFilter: "blur(12px)",
                border: `1px solid ${isCancelled ? "rgba(239,68,68,0.12)" : "rgba(71,85,105,0.35)"}`,
                padding: "1.5rem 2rem",
                opacity: isCancelled ? 0.6 : 1,
                transition: "all 0.3s ease",
                position: "relative" as const,
                overflow: "hidden",
              }}>
                {/* Subtle glow */}
                {!isCancelled && (
                  <div style={{
                    position: "absolute", top: 0, left: "20%", right: "20%", height: "1px",
                    background: "linear-gradient(90deg, transparent, rgba(20,184,166,0.25), transparent)",
                  }} />
                )}

                <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem", alignItems: "center", justifyContent: "space-between" }}>
                  {/* Left: Train info */}
                  <div style={{ flex: "1 1 300px", minWidth: 0 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.5rem" }}>
                      <span style={{ fontSize: "1.3rem" }}>🚆</span>
                      <h3 style={{ fontSize: "1.05rem", fontWeight: 800, color: "#f1f5f9", margin: 0 }}>
                        {r.train_name || r.train_id}
                      </h3>
                      <span style={{
                        fontSize: "0.68rem", fontWeight: 700, padding: "0.2rem 0.6rem", borderRadius: "999px",
                        color: st.color, background: st.bg, border: `1px solid ${st.border}`,
                      }}>
                        {st.label}
                      </span>
                    </div>

                    <div style={{ display: "flex", gap: "1.5rem", flexWrap: "wrap", fontSize: "0.82rem" }}>
                      {r.origin && (
                        <div>
                          <span style={{ color: "#64748b" }}>المسار: </span>
                          <span style={{ color: "#cbd5e1", fontWeight: 600 }}>{r.origin} → {r.destination}</span>
                        </div>
                      )}
                      {r.departure_time && (
                        <div>
                          <span style={{ color: "#64748b" }}>المغادرة: </span>
                          <span style={{ color: "#14b8a6", fontWeight: 700, fontFamily: "monospace" }}>{r.departure_time}</span>
                        </div>
                      )}
                      <div>
                        <span style={{ color: "#64748b" }}>المقعد: </span>
                        <span style={{ color: "#fbbf24", fontWeight: 700 }}>#{r.seat_number}</span>
                      </div>
                      <div>
                        <span style={{ color: "#64748b" }}>التاريخ: </span>
                        <span style={{ color: "#94a3b8" }}>
                          {new Date(r.booking_date).toLocaleDateString("ar-SA", { year: "numeric", month: "short", day: "numeric" })}
                        </span>
                      </div>
                    </div>

                    <p style={{ fontSize: "0.7rem", color: "#475569", marginTop: "0.4rem", fontFamily: "monospace" }}>
                      {r.id}
                    </p>
                  </div>

                  {/* Right: Cancel button */}
                  {!isCancelled && (
                    <button
                      onClick={() => handleCancel(r.id)}
                      disabled={cancellingId === r.id}
                      style={{
                        padding: "0.6rem 1.5rem", borderRadius: "12px",
                        border: "1px solid rgba(239,68,68,0.2)",
                        background: cancellingId === r.id ? "rgba(239,68,68,0.05)" : "rgba(239,68,68,0.08)",
                        color: "#f87171", fontSize: "0.82rem", fontWeight: 700,
                        cursor: cancellingId === r.id ? "not-allowed" : "pointer",
                        fontFamily: "inherit", transition: "all 0.2s",
                        flexShrink: 0,
                      }}
                    >
                      {cancellingId === r.id ? "جاري الإلغاء..." : "إلغاء الحجز ✕"}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
