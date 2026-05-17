"use client";

import { useEffect, useState } from "react";

/* ── SVG Icons ── */
function SunIcon() {
  return (
    <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
      <circle cx="20" cy="20" r="8" fill="url(#sunGrad)" />
      {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => (
        <line
          key={deg}
          x1="20" y1="5" x2="20" y2="9"
          stroke="url(#rayGrad)"
          strokeWidth="2"
          strokeLinecap="round"
          transform={`rotate(${deg} 20 20)`}
        />
      ))}
      <defs>
        <radialGradient id="sunGrad" cx="0.4" cy="0.4" r="0.6">
          <stop offset="0%" stopColor="#fbbf24" />
          <stop offset="100%" stopColor="#f59e0b" />
        </radialGradient>
        <linearGradient id="rayGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#fbbf24" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.4" />
        </linearGradient>
      </defs>
    </svg>
  );
}

function LocationPinIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#14b8a6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}

function TrainDepartIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#14b8a6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="4" y="3" width="16" height="14" rx="2" />
      <path d="M4 10h16" />
      <path d="M8 21l2-4h4l2 4" />
      <circle cx="9" cy="14" r="1" fill="#14b8a6" />
      <circle cx="15" cy="14" r="1" fill="#14b8a6" />
    </svg>
  );
}

/* ── Helpers ── */
function pad(n: number): string {
  return n.toString().padStart(2, "0");
}

function getNextDeparture(): { name: string; destination: string; time: string } {
  const departures = [
    { name: "خط المطار السريع", destination: "مطار الملك خالد الدولي", time: "05:30" },
    { name: "خط العليا", destination: "العليا", time: "06:15" },
    { name: "خط كافد المالي", destination: "مركز الملك عبدالله المالي", time: "07:00" },
    { name: "خط الملز", destination: "محطة خالد", time: "08:00" },
    { name: "خط البطحاء", destination: "البطحاء", time: "09:30" },
    { name: "خط الدرعية", destination: "الدرعية التاريخية", time: "10:00" },
    { name: "خط جامعة الملك سعود", destination: "جامعة الملك سعود", time: "11:00" },
    { name: "خط المطار الليلي", destination: "محطة خالد", time: "22:00" },
  ];

  const now = new Date();
  const nowMinutes = now.getHours() * 60 + now.getMinutes();

  for (const dep of departures) {
    const [h, m] = dep.time.split(":").map(Number);
    if (h * 60 + m > nowMinutes) return dep;
  }
  return departures[0]; // wrap to tomorrow's first
}

function getCountdown(targetTime: string): string {
  const now = new Date();
  const [h, m] = targetTime.split(":").map(Number);
  const target = new Date(now);
  target.setHours(h, m, 0, 0);

  if (target <= now) target.setDate(target.getDate() + 1);

  const diff = Math.max(0, target.getTime() - now.getTime());
  const hours = Math.floor(diff / 3600000);
  const mins = Math.floor((diff % 3600000) / 60000);
  const secs = Math.floor((diff % 60000) / 1000);

  return `${pad(hours)}:${pad(mins)}:${pad(secs)}`;
}

/* ── Component ── */
export default function LiveStatusWidget() {
  const [time, setTime] = useState("");
  const [date, setDate] = useState("");
  const [countdown, setCountdown] = useState("--:--:--");
  const [nextDep, setNextDep] = useState({ name: "", destination: "", time: "" });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    function tick() {
      const now = new Date();
      setTime(`${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`);
      setDate(
        now.toLocaleDateString("ar-SA", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
        })
      );
      const dep = getNextDeparture();
      setNextDep(dep);
      setCountdown(getCountdown(dep.time));
    }

    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, []);

  if (!mounted) return null;

  return (
    <div
      dir="rtl"
      className="animate-fade-in-up"
      style={{
        marginBottom: "2rem",
        borderRadius: "20px",
        background: "rgba(15, 23, 42, 0.6)",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        border: "1px solid rgba(71, 85, 105, 0.35)",
        boxShadow: "0 4px 32px rgba(0,0,0,0.15), 0 0 60px rgba(20,184,166,0.04)",
        overflow: "hidden",
        position: "relative",
      }}
    >
      {/* Subtle ambient top glow */}
      <div
        style={{
          position: "absolute", top: 0, left: "50%", transform: "translateX(-50%)",
          width: "60%", height: "1px",
          background: "linear-gradient(90deg, transparent, rgba(20,184,166,0.4), transparent)",
        }}
      />

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1px 1fr",
          gap: 0,
          padding: "1.5rem 2rem",
        }}
        className="live-status-grid"
      >
        {/* ── Section A: Time & Location ── */}
        <div style={{ display: "flex", alignItems: "center", gap: "1.25rem" }}>
          {/* Sun icon with glow */}
          <div style={{
            position: "relative", flexShrink: 0,
          }}>
            <div style={{
              position: "absolute", inset: "-8px", borderRadius: "50%",
              background: "radial-gradient(circle, rgba(251,191,36,0.12) 0%, transparent 70%)",
              filter: "blur(8px)",
            }} />
            <div style={{
              width: "56px", height: "56px", borderRadius: "16px",
              background: "rgba(251,191,36,0.08)",
              border: "1px solid rgba(251,191,36,0.15)",
              display: "flex", alignItems: "center", justifyContent: "center",
              position: "relative",
            }}>
              <SunIcon />
            </div>
          </div>

          <div style={{ minWidth: 0 }}>
            {/* Location */}
            <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", marginBottom: "0.35rem" }}>
              <LocationPinIcon />
              <span style={{ fontSize: "0.78rem", fontWeight: 600, color: "#94a3b8" }}>
                الرياض، المملكة العربية السعودية
              </span>
            </div>

            {/* Digital clock */}
            <div style={{
              fontSize: "2rem", fontWeight: 900, letterSpacing: "2px",
              fontVariantNumeric: "tabular-nums",
              background: "linear-gradient(135deg, #f1f5f9 0%, #cbd5e1 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              lineHeight: 1.1,
              fontFamily: "'Courier New', monospace",
              direction: "ltr" as const,
            }}>
              {time}
            </div>

            {/* Arabic date */}
            <p style={{ fontSize: "0.72rem", color: "#64748b", marginTop: "0.3rem", fontWeight: 500 }}>
              {date}
            </p>
          </div>
        </div>

        {/* ── Divider ── */}
        <div style={{
          background: "linear-gradient(180deg, transparent 10%, rgba(71,85,105,0.4) 50%, transparent 90%)",
        }} />

        {/* ── Section B: Next Departure ── */}
        <div style={{ display: "flex", alignItems: "center", gap: "1.25rem", paddingRight: "1.5rem" }}>
          {/* Train icon */}
          <div style={{
            width: "56px", height: "56px", borderRadius: "16px",
            background: "rgba(20,184,166,0.08)",
            border: "1px solid rgba(20,184,166,0.15)",
            display: "flex", alignItems: "center", justifyContent: "center",
            flexShrink: 0, position: "relative",
          }}>
            <TrainDepartIcon />
            {/* Pulse ring */}
            <div style={{
              position: "absolute", inset: "-3px", borderRadius: "18px",
              border: "2px solid rgba(20,184,166,0.15)",
              animation: "pulse-ring 2s ease-out infinite",
            }} />
          </div>

          <div style={{ minWidth: 0, flex: 1 }}>
            {/* Label */}
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.35rem", flexWrap: "wrap" }}>
              <span style={{ fontSize: "0.78rem", fontWeight: 600, color: "#94a3b8" }}>
                الرحلة القادمة من محطة خالد
              </span>
              {/* On-time badge */}
              <span style={{
                display: "inline-flex", alignItems: "center", gap: "0.3rem",
                fontSize: "0.65rem", fontWeight: 700,
                padding: "0.2rem 0.55rem", borderRadius: "999px",
                color: "#4ade80",
                background: "rgba(34,197,94,0.1)",
                border: "1px solid rgba(34,197,94,0.2)",
              }}>
                <span style={{
                  width: "6px", height: "6px", borderRadius: "50%",
                  background: "#4ade80",
                  boxShadow: "0 0 8px rgba(74,222,128,0.6)",
                  animation: "glow-pulse 1.5s ease-in-out infinite",
                }} />
                في الموعد
              </span>
            </div>

            {/* Train name */}
            <p style={{
              fontSize: "0.92rem", fontWeight: 800, color: "#e2e8f0",
              marginBottom: "0.15rem",
              overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
            }}>
              {nextDep.name}
              <span style={{ fontWeight: 500, color: "#64748b", fontSize: "0.8rem", marginRight: "0.5rem" }}>
                → {nextDep.destination}
              </span>
            </p>

            {/* Countdown */}
            <div style={{ display: "flex", alignItems: "baseline", gap: "0.5rem" }}>
              <span style={{ fontSize: "0.72rem", color: "#64748b", fontWeight: 500 }}>
                المغادرة خلال
              </span>
              <span style={{
                fontSize: "1.3rem", fontWeight: 900,
                fontVariantNumeric: "tabular-nums",
                fontFamily: "'Courier New', monospace",
                direction: "ltr" as const,
                color: "#14b8a6",
                letterSpacing: "1.5px",
              }}>
                {countdown}
              </span>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes pulse-ring {
          0% { transform: scale(1); opacity: 1; }
          70% { transform: scale(1.15); opacity: 0; }
          100% { transform: scale(1.15); opacity: 0; }
        }
        @keyframes glow-pulse {
          0%, 100% { box-shadow: 0 0 6px rgba(74,222,128,0.4); }
          50% { box-shadow: 0 0 14px rgba(74,222,128,0.8); }
        }
        @media (max-width: 768px) {
          .live-status-grid {
            grid-template-columns: 1fr !important;
            gap: 1rem !important;
            padding: 1.25rem 1.25rem !important;
          }
          .live-status-grid > div:nth-child(2) {
            display: none !important;
          }
          .live-status-grid > div:nth-child(3) {
            padding-right: 0 !important;
            padding-top: 1rem;
            border-top: 1px solid rgba(71,85,105,0.3);
          }
        }
      `}</style>
    </div>
  );
}
