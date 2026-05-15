"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { login } from "@/controllers/authService";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("admin@trains.com");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email.trim() || !password.trim()) {
      setError("يرجى تعبئة جميع الحقول");
      return;
    }

    setLoading(true);
    setTimeout(() => {
      const result = login(email.trim(), password);
      setLoading(false);

      if (!result.success) {
        setError("بيانات الدخول غير صحيحة");
        return;
      }

      // Admin → Admin Dashboard
      router.push("/admin");
    }, 700);
  };

  return (
    <div
      dir="rtl"
      className="min-h-screen flex items-center justify-center px-4"
      style={{
        background: "linear-gradient(145deg, #0b1120 0%, #0f172a 30%, #1e293b 60%, #0f172a 100%)",
        position: "fixed",
        inset: 0,
        zIndex: 100,
        fontFamily: "'Tajawal', sans-serif",
      }}
    >
      {/* Decorative ambient glows */}
      <div style={{ position: "absolute", top: "10%", right: "5%", width: "400px", height: "400px", borderRadius: "50%", background: "radial-gradient(circle, rgba(16,185,129,0.08) 0%, transparent 70%)", filter: "blur(60px)" }} />
      <div style={{ position: "absolute", bottom: "5%", left: "10%", width: "350px", height: "350px", borderRadius: "50%", background: "radial-gradient(circle, rgba(99,102,241,0.06) 0%, transparent 70%)", filter: "blur(50px)" }} />

      {/* Grid pattern overlay */}
      <div style={{ position: "absolute", inset: 0, opacity: 0.03, backgroundImage: "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)", backgroundSize: "40px 40px" }} />

      <div className="w-full max-w-md relative" style={{ animation: "fadeInUp 0.6s ease-out" }}>
        {/* Header */}
        <div className="text-center mb-8">
          <div
            className="inline-flex items-center justify-center w-20 h-20 rounded-2xl mb-5"
            style={{
              background: "linear-gradient(135deg, #065f46, #10b981)",
              boxShadow: "0 8px 32px rgba(16,185,129,0.3), 0 0 60px rgba(16,185,129,0.1)",
              border: "1px solid rgba(16,185,129,0.3)",
            }}
          >
            <span className="text-4xl">🛡️</span>
          </div>
          <h1 className="text-3xl font-extrabold mb-2" style={{ color: "#f1f5f9" }}>
            لوحة تحكم قطارات الرياض
          </h1>
          <p className="text-base" style={{ color: "#64748b" }}>
            دخول مشرفي نظام السكك الحديدية
          </p>
        </div>

        {/* Login Card */}
        <div
          className="rounded-2xl p-8"
          style={{
            background: "rgba(15,23,42,0.7)",
            backdropFilter: "blur(24px)",
            border: "1px solid rgba(148,163,184,0.1)",
            boxShadow: "0 4px 60px rgba(0,0,0,0.3), 0 0 40px rgba(16,185,129,0.05)",
          }}
        >
          {/* Security badge */}
          <div className="flex items-center justify-center gap-2 mb-6 py-2 px-4 rounded-lg mx-auto" style={{ background: "rgba(16,185,129,0.08)", border: "1px solid rgba(16,185,129,0.15)", width: "fit-content" }}>
            <span className="text-xs">🔒</span>
            <span className="text-xs font-semibold" style={{ color: "#34d399" }}>اتصال آمن ومشفّر</span>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Error */}
            {error && (
              <div
                className="rounded-xl p-3 text-sm font-medium text-center"
                style={{
                  background: "rgba(239,68,68,0.1)",
                  color: "#f87171",
                  border: "1px solid rgba(239,68,68,0.2)",
                }}
              >
                ⚠️ {error}
              </div>
            )}

            {/* Email */}
            <div>
              <label htmlFor="admin-email" className="block text-sm font-semibold mb-2" style={{ color: "#cbd5e1" }}>
                البريد الإلكتروني للمشرف
              </label>
              <input
                id="admin-email"
                type="email"
                dir="ltr"
                placeholder="admin@trains.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all duration-200"
                style={{
                  background: "rgba(30,41,59,0.8)",
                  border: "1.5px solid rgba(148,163,184,0.12)",
                  color: "#f1f5f9",
                  textAlign: "right",
                }}
                onFocus={(e) => { e.target.style.borderColor = "#10b981"; e.target.style.boxShadow = "0 0 0 3px rgba(16,185,129,0.12)"; }}
                onBlur={(e) => { e.target.style.borderColor = "rgba(148,163,184,0.12)"; e.target.style.boxShadow = "none"; }}
                required
              />
            </div>

            {/* Password */}
            <div>
              <label htmlFor="admin-password" className="block text-sm font-semibold mb-2" style={{ color: "#cbd5e1" }}>
                كلمة المرور
              </label>
              <input
                id="admin-password"
                type="password"
                dir="ltr"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all duration-200"
                style={{
                  background: "rgba(30,41,59,0.8)",
                  border: "1.5px solid rgba(148,163,184,0.12)",
                  color: "#f1f5f9",
                  textAlign: "right",
                }}
                onFocus={(e) => { e.target.style.borderColor = "#10b981"; e.target.style.boxShadow = "0 0 0 3px rgba(16,185,129,0.12)"; }}
                onBlur={(e) => { e.target.style.borderColor = "rgba(148,163,184,0.12)"; e.target.style.boxShadow = "none"; }}
                required
              />
            </div>

            {/* Submit */}
            <button
              id="admin-login-btn"
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl text-base font-bold transition-all duration-200"
              style={{
                background: loading ? "#475569" : "linear-gradient(135deg, #065f46, #10b981)",
                color: "#fff",
                border: "none",
                cursor: loading ? "not-allowed" : "pointer",
                boxShadow: loading ? "none" : "0 4px 24px rgba(16,185,129,0.3), 0 0 40px rgba(16,185,129,0.08)",
              }}
            >
              {loading ? (
                <span className="flex items-center gap-2 justify-center">
                  <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  جاري التحقق من الصلاحيات...
                </span>
              ) : (
                "دخول للنظام 🔐"
              )}
            </button>
          </form>
        </div>

        {/* Footer links */}
        <div className="flex items-center justify-between mt-6 px-2">
          <Link href="/login" className="text-sm no-underline font-medium" style={{ color: "#64748b" }}>
            ← تسجيل دخول المسافرين
          </Link>
          <Link href="/" className="text-sm no-underline font-medium" style={{ color: "#64748b" }}>
            الرئيسية 🏠
          </Link>
        </div>

        {/* Version badge */}
        <p className="text-center mt-8 text-xs" style={{ color: "#475569" }}>
          نظام قطارات الرياض v1.0 — المملكة العربية السعودية 🇸🇦
        </p>
      </div>
    </div>
  );
}
