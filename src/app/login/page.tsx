"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { login } from "@/controllers/authService";

export default function CustomerLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
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
        setError("البريد الإلكتروني أو كلمة المرور غير صحيحة");
        return;
      }

      // Passengers → Home schedule page
      router.push("/");
    }, 700);
  };

  return (
    <div
      dir="rtl"
      className="min-h-screen flex items-center justify-center px-4"
      style={{
        background: "linear-gradient(135deg, #f8fafc 0%, #e2e8f0 40%, #f1f5f9 100%)",
        position: "fixed",
        inset: 0,
        zIndex: 100,
        fontFamily: "'Tajawal', sans-serif",
      }}
    >
      {/* Decorative circles */}
      <div style={{ position: "absolute", top: "-80px", left: "-80px", width: "300px", height: "300px", borderRadius: "50%", background: "rgba(20,184,166,0.08)", filter: "blur(40px)" }} />
      <div style={{ position: "absolute", bottom: "-60px", right: "-60px", width: "250px", height: "250px", borderRadius: "50%", background: "rgba(99,102,241,0.06)", filter: "blur(40px)" }} />

      <div className="w-full max-w-md" style={{ animation: "fadeInUp 0.6s ease-out" }}>
        {/* Logo Header */}
        <div className="text-center mb-8">
          <div
            className="inline-flex items-center justify-center w-20 h-20 rounded-2xl mb-5"
            style={{
              background: "linear-gradient(135deg, #0f766e, #14b8a6)",
              boxShadow: "0 8px 32px rgba(20,184,166,0.25)",
            }}
          >
            <span className="text-4xl">🚆</span>
          </div>
          <h1
            className="text-3xl font-extrabold mb-2"
            style={{ color: "#0f172a" }}
          >
            جداول قطارات الرياض
          </h1>
          <p className="text-base" style={{ color: "#64748b" }}>
            تسجيل دخول المسافرين
          </p>
        </div>

        {/* Login Card */}
        <div
          className="rounded-2xl p-8"
          style={{
            background: "rgba(255,255,255,0.85)",
            backdropFilter: "blur(20px)",
            border: "1px solid rgba(226,232,240,0.8)",
            boxShadow: "0 4px 40px rgba(0,0,0,0.06), 0 1px 3px rgba(0,0,0,0.04)",
          }}
        >
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Error */}
            {error && (
              <div
                className="rounded-xl p-3 text-sm font-medium text-center"
                style={{
                  background: "rgba(239,68,68,0.08)",
                  color: "#dc2626",
                  border: "1px solid rgba(239,68,68,0.15)",
                }}
              >
                ⚠️ {error}
              </div>
            )}

            {/* Email */}
            <div>
              <label htmlFor="customer-email" className="block text-sm font-semibold mb-2" style={{ color: "#1e293b" }}>
                البريد الإلكتروني
              </label>
              <input
                id="customer-email"
                type="email"
                dir="ltr"
                placeholder="example@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all duration-200"
                style={{
                  background: "#f8fafc",
                  border: "1.5px solid #e2e8f0",
                  color: "#1e293b",
                  textAlign: "right",
                }}
                onFocus={(e) => { e.target.style.borderColor = "#14b8a6"; e.target.style.boxShadow = "0 0 0 3px rgba(20,184,166,0.1)"; }}
                onBlur={(e) => { e.target.style.borderColor = "#e2e8f0"; e.target.style.boxShadow = "none"; }}
                required
              />
            </div>

            {/* Password */}
            <div>
              <label htmlFor="customer-password" className="block text-sm font-semibold mb-2" style={{ color: "#1e293b" }}>
                كلمة المرور
              </label>
              <input
                id="customer-password"
                type="password"
                dir="ltr"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all duration-200"
                style={{
                  background: "#f8fafc",
                  border: "1.5px solid #e2e8f0",
                  color: "#1e293b",
                  textAlign: "right",
                }}
                onFocus={(e) => { e.target.style.borderColor = "#14b8a6"; e.target.style.boxShadow = "0 0 0 3px rgba(20,184,166,0.1)"; }}
                onBlur={(e) => { e.target.style.borderColor = "#e2e8f0"; e.target.style.boxShadow = "none"; }}
                required
              />
            </div>

            {/* Remember + Forgot */}
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 cursor-pointer" style={{ color: "#64748b" }}>
                <input type="checkbox" className="w-4 h-4 rounded" style={{ accentColor: "#14b8a6" }} />
                تذكرني
              </label>
              <span className="cursor-pointer font-medium" style={{ color: "#0f766e" }}>
                نسيت كلمة المرور؟
              </span>
            </div>

            {/* Submit */}
            <button
              id="customer-login-btn"
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl text-base font-bold transition-all duration-200"
              style={{
                background: loading ? "#94a3b8" : "linear-gradient(135deg, #0f766e, #14b8a6)",
                color: "#fff",
                border: "none",
                cursor: loading ? "not-allowed" : "pointer",
                boxShadow: loading ? "none" : "0 4px 20px rgba(20,184,166,0.3)",
              }}
            >
              {loading ? (
                <span className="flex items-center gap-2 justify-center">
                  <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  جاري التحقق...
                </span>
              ) : (
                "تسجيل الدخول"
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px" style={{ background: "#e2e8f0" }} />
            <span className="text-xs font-medium" style={{ color: "#94a3b8" }}>أو</span>
            <div className="flex-1 h-px" style={{ background: "#e2e8f0" }} />
          </div>

          {/* Register Link */}
          <p className="text-center text-sm" style={{ color: "#64748b" }}>
            ليس لديك حساب؟{" "}
            <Link href="/register" className="font-bold no-underline" style={{ color: "#0f766e" }}>
              إنشاء حساب جديد
            </Link>
          </p>
        </div>

        {/* Admin Link */}
        <p className="text-center mt-6 text-sm" style={{ color: "#94a3b8" }}>
          <Link href="/admin/login" className="no-underline font-medium" style={{ color: "#64748b" }}>
            🔐 دخول لوحة الإدارة
          </Link>
        </p>
      </div>
    </div>
  );
}
