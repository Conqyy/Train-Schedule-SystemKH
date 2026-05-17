"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import { login as mockLogin } from "@/controllers/authService";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("admin@trains.com");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!email.trim() || !password.trim()) { setError("يرجى تعبئة جميع الحقول"); return; }

    setLoading(true);

    // ── Supabase Auth ──
    if (isSupabaseConfigured()) {
      try {
        const { data, error: authError } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password,
        });

        if (!authError && data.user) {
          // Verify admin role
          const { data: profile } = await supabase
            .from("profiles")
            .select("role")
            .eq("id", data.user.id)
            .single();

          setLoading(false);

          if (profile?.role !== "admin") {
            // Sign out non-admin user
            await supabase.auth.signOut();
            setError("⛔ هذا الحساب ليس لديه صلاحيات المشرف");
            return;
          }

          router.push("/admin");
          return;
        }
        // If Supabase auth failed, fall through to mock login below
      } catch {
        // Supabase error — fall through to mock login
      }
    }

    // ── Fallback: mock auth ──
    setTimeout(() => {
      const result = mockLogin(email.trim(), password);
      setLoading(false);
      if (!result.success) { setError("بيانات الدخول غير صحيحة"); return; }
      router.push("/admin");
    }, 700);
  };

  const inputStyle: React.CSSProperties = {
    width: "100%", padding: "0.9rem 1rem 0.9rem 1rem", borderRadius: "12px",
    border: "1.5px solid rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.05)",
    color: "#f1f5f9", fontSize: "0.9rem", outline: "none", textAlign: "right" as const,
    fontFamily: "inherit", transition: "all 0.3s cubic-bezier(0.4,0,0.2,1)",
    backdropFilter: "blur(8px)",
  };
  const focusIn = (e: React.FocusEvent<HTMLInputElement>) => { e.target.style.borderColor = "rgba(16,185,129,0.5)"; e.target.style.boxShadow = "0 0 0 4px rgba(16,185,129,0.08), 0 0 20px rgba(16,185,129,0.06)"; e.target.style.background = "rgba(255,255,255,0.08)"; };
  const focusOut = (e: React.FocusEvent<HTMLInputElement>) => { e.target.style.borderColor = "rgba(255,255,255,0.1)"; e.target.style.boxShadow = "none"; e.target.style.background = "rgba(255,255,255,0.05)"; };

  return (
    <div dir="rtl" style={{
      position: "fixed", inset: 0, zIndex: 100,
      display: "flex", alignItems: "center", justifyContent: "center",
      background: "linear-gradient(145deg,#020617 0%,#0f172a 40%,#1e293b 70%,#0f172a 100%)",
      fontFamily: "'Tajawal', sans-serif", padding: "1rem",
    }}>
      {/* Ambient glow effects */}
      <div style={{ position: "absolute", top: "5%", right: "10%", width: "500px", height: "500px", borderRadius: "50%", background: "radial-gradient(circle,rgba(16,185,129,0.07) 0%,transparent 70%)", filter: "blur(80px)" }} />
      <div style={{ position: "absolute", bottom: "10%", left: "5%", width: "400px", height: "400px", borderRadius: "50%", background: "radial-gradient(circle,rgba(99,102,241,0.05) 0%,transparent 70%)", filter: "blur(60px)" }} />
      <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: "600px", height: "600px", borderRadius: "50%", background: "radial-gradient(circle,rgba(16,185,129,0.03) 0%,transparent 60%)", filter: "blur(100px)" }} />

      {/* Grid pattern */}
      <div style={{ position: "absolute", inset: 0, opacity: 0.03, backgroundImage: "linear-gradient(rgba(255,255,255,0.1) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.1) 1px,transparent 1px)", backgroundSize: "50px 50px" }} />

      {/* Floating particles */}
      <div style={{ position: "absolute", top: "20%", right: "20%", width: "6px", height: "6px", borderRadius: "50%", background: "rgba(16,185,129,0.4)", animation: "float 4s ease-in-out infinite" }} />
      <div style={{ position: "absolute", top: "60%", left: "15%", width: "4px", height: "4px", borderRadius: "50%", background: "rgba(99,102,241,0.3)", animation: "float 5s ease-in-out infinite 1s" }} />
      <div style={{ position: "absolute", bottom: "30%", right: "30%", width: "5px", height: "5px", borderRadius: "50%", background: "rgba(16,185,129,0.3)", animation: "float 6s ease-in-out infinite 2s" }} />

      <div style={{ width: "100%", maxWidth: "460px", position: "relative", animation: "fadeInUp 0.6s ease-out" }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <div style={{
            width: "80px", height: "80px", borderRadius: "24px",
            background: "linear-gradient(135deg,#065f46,#10b981)",
            boxShadow: "0 8px 40px rgba(16,185,129,0.3), 0 0 80px rgba(16,185,129,0.08)",
            border: "1px solid rgba(16,185,129,0.3)",
            display: "flex", alignItems: "center", justifyContent: "center",
            margin: "0 auto 1.5rem", fontSize: "2.5rem",
            animation: "pulse-glow 3s ease-in-out infinite",
          }}>🛡️</div>
          <h1 style={{ fontSize: "1.9rem", fontWeight: 900, color: "#f1f5f9", marginBottom: "0.4rem" }}>لوحة تحكم قطارات الرياض</h1>
          <p style={{ color: "#64748b", fontSize: "0.95rem" }}>دخول مشرفي نظام السكك الحديدية</p>
        </div>

        {/* Glassmorphism Card */}
        <div style={{
          borderRadius: "20px", padding: "2rem",
          background: "rgba(255,255,255,0.06)",
          backdropFilter: "blur(24px)", WebkitBackdropFilter: "blur(24px)",
          border: "1px solid rgba(255,255,255,0.1)",
          boxShadow: "0 4px 60px rgba(0,0,0,0.3), 0 0 40px rgba(16,185,129,0.05), inset 0 1px 0 rgba(255,255,255,0.05)",
        }}>
          {/* Security badge */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem", marginBottom: "1.5rem", padding: "0.5rem 1rem", borderRadius: "10px", background: "rgba(16,185,129,0.08)", border: "1px solid rgba(16,185,129,0.15)", width: "fit-content", margin: "0 auto 1.5rem" }}>
            <span style={{ fontSize: "0.75rem" }}>🔒</span>
            <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "#34d399" }}>اتصال آمن ومشفّر</span>
          </div>

          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.2rem" }}>
            {error && <div style={{ background: "rgba(239,68,68,0.1)", color: "#f87171", border: "1px solid rgba(239,68,68,0.2)", borderRadius: "12px", padding: "0.7rem 1rem", fontSize: "0.85rem", fontWeight: 600, textAlign: "center" }}>⚠️ {error}</div>}

            <div>
              <label htmlFor="admin-email" style={{ display: "block", fontSize: "0.85rem", fontWeight: 700, color: "#cbd5e1", marginBottom: "0.5rem" }}>البريد الإلكتروني للمشرف</label>
              <div style={{ position: "relative" }}>
                <span style={{ position: "absolute", right: "14px", top: "50%", transform: "translateY(-50%)", fontSize: "1rem", opacity: 0.35, pointerEvents: "none" }}>📧</span>
                <input id="admin-email" type="email" dir="ltr" placeholder="admin@trains.com" value={email} onChange={e => setEmail(e.target.value)} style={{ ...inputStyle, paddingRight: "2.75rem" }} onFocus={focusIn} onBlur={focusOut} required />
              </div>
            </div>

            <div>
              <label htmlFor="admin-password" style={{ display: "block", fontSize: "0.85rem", fontWeight: 700, color: "#cbd5e1", marginBottom: "0.5rem" }}>كلمة المرور</label>
              <div style={{ position: "relative" }}>
                <span style={{ position: "absolute", right: "14px", top: "50%", transform: "translateY(-50%)", fontSize: "1rem", opacity: 0.35, pointerEvents: "none" }}>🔑</span>
                <input id="admin-password" type="password" dir="ltr" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} style={{ ...inputStyle, paddingRight: "2.75rem" }} onFocus={focusIn} onBlur={focusOut} required />
              </div>
            </div>

            <button id="admin-login-btn" type="submit" disabled={loading} style={{
              width: "100%", padding: "0.9rem", borderRadius: "14px", border: "none",
              background: loading ? "#475569" : "linear-gradient(135deg,#065f46,#10b981,#059669)",
              color: "#fff", fontSize: "1rem", fontWeight: 800, fontFamily: "inherit",
              cursor: loading ? "not-allowed" : "pointer",
              boxShadow: loading ? "none" : "0 4px 24px rgba(16,185,129,0.3), 0 0 60px rgba(16,185,129,0.06)",
              transition: "all 0.3s cubic-bezier(0.4,0,0.2,1)",
            }}
              onMouseEnter={e => { if (!loading) { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 8px 35px rgba(16,185,129,0.4), 0 0 80px rgba(16,185,129,0.1)"; } }}
              onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = loading ? "none" : "0 4px 24px rgba(16,185,129,0.3), 0 0 60px rgba(16,185,129,0.06)"; }}
            >
              {loading ? <span style={{ display: "flex", alignItems: "center", gap: "0.5rem", justifyContent: "center" }}><span className="auth-spinner-dark" />جاري التحقق من الصلاحيات...</span> : "دخول للنظام 🔐"}
            </button>
          </form>
        </div>

        {/* Footer links */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: "1.5rem", padding: "0 0.5rem" }}>
          <Link href="/login" style={{ fontSize: "0.85rem", color: "#64748b", textDecoration: "none", fontWeight: 500, transition: "color 0.2s" }}>← تسجيل دخول المسافرين</Link>
          <Link href="/" style={{ fontSize: "0.85rem", color: "#64748b", textDecoration: "none", fontWeight: 500, transition: "color 0.2s" }}>الرئيسية 🏠</Link>
        </div>

        <p style={{ textAlign: "center", marginTop: "1.5rem", fontSize: "0.7rem", color: "#475569" }}>نظام قطارات الرياض v1.0 — المملكة العربية السعودية 🇸🇦</p>
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes pulse-glow { 0%,100% { box-shadow: 0 8px 40px rgba(16,185,129,0.3), 0 0 80px rgba(16,185,129,0.08); } 50% { box-shadow: 0 8px 60px rgba(16,185,129,0.4), 0 0 120px rgba(16,185,129,0.12); } }
        .auth-spinner-dark { display: inline-block; width: 18px; height: 18px; border: 2.5px solid rgba(255,255,255,0.2); border-top: 2.5px solid #fff; border-radius: 50%; animation: spin 0.7s linear infinite; }
      `}</style>
    </div>
  );
}
