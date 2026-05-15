"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Train } from "@/models/types";
import { getTrains } from "@/controllers/trainService";

/* ========== Hero Section ========== */
function HeroSection() {
  return (
    <section
      className="relative overflow-hidden rounded-3xl mb-14 animate-fade-in-up w-full"
      style={{
        background: "linear-gradient(135deg, #050d1a 0%, #0a1628 30%, #071420 60%, #050d1a 100%)",
        border: "1px solid rgba(20,184,166,0.08)",
        maxWidth: "100%",
      }}
    >
      {/* Ambient glow circles */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 pointer-events-none"
        style={{
          width: "min(600px, 100%)",
          height: "400px",
          background: "radial-gradient(ellipse, rgba(20,184,166,0.12) 0%, transparent 70%)",
          filter: "blur(60px)",
        }}
      />
      <div
        className="absolute bottom-0 right-0 w-[400px] h-[300px] pointer-events-none"
        style={{
          background: "radial-gradient(ellipse, rgba(99,102,241,0.08) 0%, transparent 70%)",
          filter: "blur(50px)",
        }}
      />

      {/* Grid pattern overlay */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage: "linear-gradient(rgba(148,163,184,1) 1px, transparent 1px), linear-gradient(90deg, rgba(148,163,184,1) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      <div className="relative z-10 text-center px-6 py-16 md:py-24">
        {/* Badge */}
        <div
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-6"
          style={{
            background: "rgba(20,184,166,0.08)",
            border: "1px solid rgba(20,184,166,0.15)",
          }}
        >
          <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: "#14b8a6" }} />
          <span className="text-xs font-bold" style={{ color: "#14b8a6" }}>
            الحجز متاح الآن — 8 خطوط تعمل يومياً
          </span>
        </div>

        {/* Title */}
        <h1
          className="text-4xl md:text-6xl lg:text-7xl font-black mb-5 leading-tight"
          style={{
            background: "linear-gradient(135deg, #ffffff 0%, #e2e8f0 40%, #14b8a6 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          جداول قطارات الرياض
        </h1>

        {/* Subtitle */}
        <p
          className="text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed"
          style={{ color: "#94a3b8" }}
        >
          اكتشف شبكة قطارات الرياض الحديثة. احجز رحلتك من{" "}
          <span className="font-bold" style={{ color: "#14b8a6" }}>محطة خالد</span>
          {" "}إلى جميع أنحاء المدينة بسهولة وسرعة.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link href="/book" className="btn-primary text-base px-8 py-3.5">
            🎫 احجز رحلتك الآن
          </Link>
          <Link href="#schedules" className="btn-secondary text-base px-8 py-3.5">
            📋 عرض الجداول
          </Link>
        </div>

        {/* Stats row */}
        <div className="flex items-center justify-center gap-6 md:gap-12 mt-12">
          {[
            { label: "خط قطار", value: "8", icon: "🚆" },
            { label: "محطة", value: "9", icon: "🚉" },
            { label: "ريال كحد أدنى", value: "10", icon: "💰" },
            { label: "يومياً", value: "24/7", icon: "⏰" },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="text-xs mb-1">{stat.icon}</p>
              <p className="text-xl md:text-2xl font-black" style={{ color: "#ffffff" }}>
                {stat.value}
              </p>
              <p className="text-[11px] font-medium" style={{ color: "#64748b" }}>
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ========== Train Card ========== */
function TrainCard({ train }: { train: Train }) {
  const occupancy = Math.round(
    ((train.totalSeats - train.availableSeats) / train.totalSeats) * 100
  );

  const statusMap = {
    "on-time": { color: "#4ade80", bg: "rgba(34, 197, 94, 0.1)", border: "rgba(34, 197, 94, 0.2)", label: "في الموعد" },
    delayed: { color: "#fbbf24", bg: "rgba(245, 158, 11, 0.1)", border: "rgba(245, 158, 11, 0.2)", label: "متأخر" },
    cancelled: { color: "#f87171", bg: "rgba(239, 68, 68, 0.1)", border: "rgba(239, 68, 68, 0.2)", label: "ملغي" },
  } as const;

  const status = statusMap[train.status as keyof typeof statusMap];

  return (
    <div className="train-card">
      {/* ── Header: Name + Status ── */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.25rem" }}>
        <div style={{ minWidth: 0 }}>
          <h3 style={{ fontSize: "1.05rem", fontWeight: 800, color: "#f1f5f9", margin: 0, lineHeight: 1.3 }}>
            {train.name}
          </h3>
          <p style={{ fontSize: "0.7rem", color: "#475569", marginTop: "2px", fontFamily: "monospace", letterSpacing: "0.5px" }}>
            {train.id}
          </p>
        </div>
        <span
          style={{
            fontSize: "0.68rem",
            fontWeight: 700,
            padding: "0.25rem 0.75rem",
            borderRadius: "999px",
            color: status.color,
            background: status.bg,
            border: `1px solid ${status.border}`,
            whiteSpace: "nowrap",
            flexShrink: 0,
          }}
        >
          {status.label}
        </span>
      </div>

      {/* ── Route Row: Origin → Destination ── */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "0.5rem",
          padding: "1rem 0",
          borderTop: "1px solid rgba(71, 85, 105, 0.25)",
          borderBottom: "1px solid rgba(71, 85, 105, 0.25)",
        }}
      >
        {/* Departure */}
        <div style={{ flex: 1, minWidth: 0, textAlign: "center" }}>
          <p style={{ fontSize: "0.65rem", fontWeight: 700, color: "#64748b", textTransform: "uppercase", marginBottom: "0.35rem", letterSpacing: "0.5px" }}>
            المغادرة
          </p>
          <p style={{ fontSize: "1.35rem", fontWeight: 900, color: "#14b8a6", lineHeight: 1, marginBottom: "0.3rem", fontVariantNumeric: "tabular-nums" }}>
            {train.departureTime}
          </p>
          <p style={{ fontSize: "0.75rem", fontWeight: 600, color: "#cbd5e1", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            {train.origin}
          </p>
        </div>

        {/* Direction Arrow */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0.25rem", flexShrink: 0, padding: "0 0.25rem" }}>
          <div style={{ width: "60px", height: "1px", background: "linear-gradient(90deg, rgba(20,184,166,0.4), rgba(20,184,166,0.1))" }} />
          <div
            style={{
              width: "28px",
              height: "28px",
              borderRadius: "50%",
              background: "rgba(20, 184, 166, 0.08)",
              border: "1px solid rgba(20, 184, 166, 0.2)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "0.7rem",
            }}
          >
            🚇
          </div>
          <div style={{ width: "60px", height: "1px", background: "linear-gradient(90deg, rgba(20,184,166,0.1), rgba(20,184,166,0.4))" }} />
        </div>

        {/* Arrival */}
        <div style={{ flex: 1, minWidth: 0, textAlign: "center" }}>
          <p style={{ fontSize: "0.65rem", fontWeight: 700, color: "#64748b", textTransform: "uppercase", marginBottom: "0.35rem", letterSpacing: "0.5px" }}>
            الوصول
          </p>
          <p style={{ fontSize: "1.35rem", fontWeight: 900, color: "#14b8a6", lineHeight: 1, marginBottom: "0.3rem", fontVariantNumeric: "tabular-nums" }}>
            {train.arrivalTime}
          </p>
          <p style={{ fontSize: "0.75rem", fontWeight: 600, color: "#cbd5e1", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            {train.destination}
          </p>
        </div>
      </div>

      {/* ── Capacity Bar ── */}
      <div style={{ marginTop: "1rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.4rem" }}>
          <span style={{ fontSize: "0.7rem", color: "#94a3b8" }}>
            {train.availableSeats} / {train.totalSeats} مقعد متاح
          </span>
          <span style={{ fontSize: "0.7rem", color: "#94a3b8" }}>
            {occupancy}% محجوز
          </span>
        </div>
        <div style={{ width: "100%", height: "5px", borderRadius: "999px", background: "rgba(71, 85, 105, 0.3)", overflow: "hidden" }}>
          <div
            style={{
              height: "100%",
              borderRadius: "999px",
              width: `${occupancy}%`,
              transition: "width 0.7s ease",
              background:
                occupancy > 80
                  ? "linear-gradient(90deg, #ef4444, #f97316)"
                  : occupancy > 50
                    ? "linear-gradient(90deg, #f59e0b, #eab308)"
                    : "linear-gradient(90deg, #14b8a6, #10b981)",
            }}
          />
        </div>
      </div>

      {/* ── Footer: Price + CTA ── */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginTop: "1rem",
          paddingTop: "1rem",
          borderTop: "1px solid rgba(71, 85, 105, 0.25)",
        }}
      >
        <div>
          <span style={{ fontSize: "1.5rem", fontWeight: 900, color: "#10b981" }}>
            {train.price}
          </span>
          <span style={{ fontSize: "0.75rem", fontWeight: 500, color: "#64748b", marginRight: "0.25rem" }}>
            ريال
          </span>
        </div>
        {train.status !== "cancelled" && train.availableSeats > 0 ? (
          <Link
            href={`/book?train=${train.id}`}
            className="btn-primary"
            style={{ fontSize: "0.85rem", padding: "0.55rem 1.5rem" }}
          >
            احجز الآن ←
          </Link>
        ) : (
          <span
            style={{
              fontSize: "0.75rem",
              fontWeight: 700,
              padding: "0.5rem 1rem",
              borderRadius: "10px",
              color: "#f87171",
              background: "rgba(239, 68, 68, 0.08)",
              border: "1px solid rgba(239, 68, 68, 0.15)",
            }}
          >
            غير متاح
          </span>
        )}
      </div>
    </div>
  );
}

/* ========== Home Page ========== */
export default function HomePage() {
  const [trains, setTrains] = useState<Train[]>([]);
  const [search, setSearch] = useState("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setTrains(getTrains());
  }, []);

  const filtered = trains.filter(
    (t) =>
      t.name.toLowerCase().includes(search.toLowerCase()) ||
      t.destination.toLowerCase().includes(search.toLowerCase()) ||
      t.origin.toLowerCase().includes(search.toLowerCase()) ||
      t.id.toLowerCase().includes(search.toLowerCase())
  );

  if (!mounted) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div
            className="w-12 h-12 mx-auto rounded-full mb-4 animate-pulse"
            style={{ background: "rgba(20,184,166,0.15)" }}
          />
          <p className="text-lg" style={{ color: "#94a3b8" }}>جاري تحميل الجداول...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Hero */}
      <HeroSection />

      {/* Schedules Section */}
      <section id="schedules" className="scroll-mt-24">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
          <div>
            <h2
              className="text-2xl md:text-3xl font-black mb-1"
              style={{
                background: "linear-gradient(135deg, #ffffff, #94a3b8)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              جداول الرحلات المتاحة
            </h2>
            <p className="text-sm" style={{ color: "#64748b" }}>
              عرض {filtered.length} من {trains.length} رحلة
            </p>
          </div>

          {/* Search */}
          <div className="relative w-full md:w-80">
            <span
              className="absolute right-4 top-1/2 -translate-y-1/2 text-base"
              style={{ color: "#64748b" }}
            >
              🔍
            </span>
            <input
              id="search-trains"
              type="text"
              placeholder="ابحث باسم القطار أو المحطة..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input-field pr-11"
            />
          </div>
        </div>

        {/* Train Grid */}
        {filtered.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-5xl mb-4">🔍</p>
            <p className="text-xl font-bold text-white mb-2">لا توجد قطارات</p>
            <p style={{ color: "#64748b" }}>جرّب كلمة بحث مختلفة.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 stagger-children" style={{ minWidth: 0 }}>
            {filtered.map((train) => (
              <TrainCard key={train.id} train={train} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
