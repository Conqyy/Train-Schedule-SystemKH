"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";

export default function UpdatePasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // Supabase auto-detects the #access_token from the URL
    // and sets the session when the page loads
    if (isSupabaseConfigured()) {
      supabase.auth.onAuthStateChange((event) => {
        if (event === "PASSWORD_RECOVERY") {
          setReady(true);
        }
      });
      // Also check if already in a session
      supabase.auth.getSession().then(({ data }) => {
        if (data.session) setReady(true);
      });
    } else {
      setReady(true); // mock mode
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!password.trim()) { setError("يرجى إدخال كلمة المرور الجديدة"); return; }
    if (password.length < 6) { setError("كلمة المرور يجب أن تكون 6 أحرف على الأقل"); return; }
    if (password !== confirm) { setError("كلمتا المرور غير متطابقتين"); return; }

    setLoading(true);

    if (isSupabaseConfigured()) {
      const { error: updateError } = await supabase.auth.updateUser({ password });
      setLoading(false);
      if (updateError) {
        setError("حدث خطأ أثناء تحديث كلمة المرور. حاول مرة أخرى");
        return;
      }
      setSuccess(true);
      setTimeout(() => router.push("/login"), 2500);
    } else {
      setLoading(false);
      setSuccess(true);
      setTimeout(() => router.push("/login"), 2500);
    }
  };

  const inputStyle: React.CSSProperties = {
    width: "100%", padding: "0.85rem 1rem 0.85rem 2.75rem", borderRadius: "12px",
    border: "1.5px solid #e2e8f0", background: "#f8fafc", color: "#1e293b",
    fontSize: "0.9rem", outline: "none", textAlign: "right" as const,
    fontFamily: "inherit", transition: "all 0.3s cubic-bezier(0.4,0,0.2,1)",
  };
  const focusIn = (e: React.FocusEvent<HTMLInputElement>) => { e.target.style.borderColor = "#14b8a6"; e.target.style.boxShadow = "0 0 0 4px rgba(20,184,166,0.1)"; e.target.style.background = "#fff"; };
  const focusOut = (e: React.FocusEvent<HTMLInputElement>) => { e.target.style.borderColor = "#e2e8f0"; e.target.style.boxShadow = "none"; e.target.style.background = "#f8fafc"; };

  return (
    <div dir="rtl" style={{ position: "fixed", inset: 0, zIndex: 100, display: "flex", fontFamily: "'Tajawal', sans-serif" }}>
      {/* ─── Left Branding Panel ─── */}
      <div className="auth-brand" style={{
        flex: "1 1 50%", background: "linear-gradient(160deg,#064e3b 0%,#0f766e 35%,#14b8a6 70%,#0d9488 100%)",
        display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
        position: "relative", overflow: "hidden", padding: "3rem 2rem",
      }}>
        <div style={{ position: "absolute", top: "-60px", left: "-60px", width: "280px", height: "280px", borderRadius: "50%", background: "rgba(255,255,255,0.06)", animation: "float 6s ease-in-out infinite" }} />
        <div style={{ position: "absolute", bottom: "60px", right: "-40px", width: "200px", height: "200px", borderRadius: "50%", background: "rgba(255,255,255,0.04)", animation: "float 8s ease-in-out infinite 1s" }} />
        <div style={{ position: "absolute", inset: 0, opacity: 0.04, backgroundImage: "radial-gradient(circle,rgba(255,255,255,0.8) 1px,transparent 1px)", backgroundSize: "30px 30px" }} />

        <div style={{ position: "relative", zIndex: 2, textAlign: "center", maxWidth: "400px" }}>
          <div style={{ width: "80px", height: "80px", borderRadius: "24px", background: "rgba(255,255,255,0.15)", backdropFilter: "blur(10px)", border: "1px solid rgba(255,255,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 2rem", fontSize: "2.5rem", animation: "fadeInUp 0.8s ease-out" }}>🔑</div>
          <h1 style={{ fontSize: "2.2rem", fontWeight: 900, color: "#fff", marginBottom: "0.75rem", lineHeight: 1.3 }}>تعيين كلمة مرور جديدة</h1>
          <p style={{ fontSize: "1.05rem", color: "rgba(255,255,255,0.8)", lineHeight: 1.8 }}>اختر كلمة مرور قوية وآمنة لحسابك</p>
        </div>
      </div>

      {/* ─── Right Form Panel ─── */}
      <div className="auth-form" style={{ flex: "1 1 50%", background: "#fff", display: "flex", alignItems: "center", justifyContent: "center", padding: "3rem 2rem", overflowY: "auto" }}>
        <div style={{ width: "100%", maxWidth: "420px", animation: "fadeInUp 0.6s ease-out" }}>
          {!success ? (
            <>
              <h2 style={{ fontSize: "1.85rem", fontWeight: 800, color: "#0f172a", marginBottom: "0.4rem" }}>كلمة مرور جديدة</h2>
              <p style={{ color: "#64748b", fontSize: "0.95rem", marginBottom: "1.75rem" }}>أدخل كلمة المرور الجديدة لحسابك</p>

              {!ready && (
                <div style={{ background: "rgba(245,158,11,0.06)", color: "#d97706", border: "1px solid rgba(245,158,11,0.15)", borderRadius: "12px", padding: "0.7rem 1rem", fontSize: "0.85rem", fontWeight: 600, textAlign: "center", marginBottom: "1rem" }}>
                  ⏳ جاري التحقق من الرابط...
                </div>
              )}

              <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.2rem" }}>
                {error && <div style={{ background: "rgba(239,68,68,0.06)", color: "#dc2626", border: "1px solid rgba(239,68,68,0.15)", borderRadius: "12px", padding: "0.7rem 1rem", fontSize: "0.85rem", fontWeight: 600, textAlign: "center" }}>⚠️ {error}</div>}

                <div>
                  <label htmlFor="new-password" style={{ display: "block", fontSize: "0.85rem", fontWeight: 700, color: "#374151", marginBottom: "0.5rem" }}>كلمة المرور الجديدة</label>
                  <div style={{ position: "relative" }}>
                    <span style={{ position: "absolute", right: "14px", top: "50%", transform: "translateY(-50%)", fontSize: "1.05rem", opacity: 0.4, pointerEvents: "none" }}>🔑</span>
                    <input id="new-password" type="password" dir="ltr" placeholder="6 أحرف على الأقل" value={password} onChange={e => setPassword(e.target.value)} style={inputStyle} onFocus={focusIn} onBlur={focusOut} required />
                  </div>
                </div>

                <div>
                  <label htmlFor="confirm-password" style={{ display: "block", fontSize: "0.85rem", fontWeight: 700, color: "#374151", marginBottom: "0.5rem" }}>تأكيد كلمة المرور</label>
                  <div style={{ position: "relative" }}>
                    <span style={{ position: "absolute", right: "14px", top: "50%", transform: "translateY(-50%)", fontSize: "1.05rem", opacity: 0.4, pointerEvents: "none" }}>🔒</span>
                    <input id="confirm-password" type="password" dir="ltr" placeholder="أعد إدخال كلمة المرور" value={confirm} onChange={e => setConfirm(e.target.value)} style={inputStyle} onFocus={focusIn} onBlur={focusOut} required />
                  </div>
                </div>

                <button type="submit" disabled={loading || !ready} style={{
                  width: "100%", padding: "0.9rem", borderRadius: "14px", border: "none",
                  background: loading || !ready ? "#94a3b8" : "linear-gradient(135deg,#0f766e,#14b8a6,#0d9488)",
                  color: "#fff", fontSize: "1rem", fontWeight: 800, fontFamily: "inherit",
                  cursor: loading || !ready ? "not-allowed" : "pointer",
                  boxShadow: loading ? "none" : "0 4px 20px rgba(20,184,166,0.3)",
                  transition: "all 0.3s cubic-bezier(0.4,0,0.2,1)",
                }}>
                  {loading ? <span style={{ display: "flex", alignItems: "center", gap: "0.5rem", justifyContent: "center" }}><span className="auth-spinner" />جاري التحديث...</span> : "تحديث كلمة المرور 🔐"}
                </button>
              </form>
            </>
          ) : (
            <div style={{ textAlign: "center" }}>
              <div style={{ width: "80px", height: "80px", borderRadius: "50%", background: "rgba(34,197,94,0.08)", border: "2px solid rgba(34,197,94,0.2)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1.5rem", fontSize: "2.5rem" }}>✅</div>
              <h2 style={{ fontSize: "1.6rem", fontWeight: 800, color: "#0f172a", marginBottom: "0.75rem" }}>تم تحديث كلمة المرور!</h2>
              <p style={{ color: "#64748b", fontSize: "0.95rem", marginBottom: "2rem" }}>جاري تحويلك لصفحة تسجيل الدخول...</p>
              <Link href="/login" style={{ color: "#0f766e", fontWeight: 700, fontSize: "0.9rem" }}>العودة لتسجيل الدخول ←</Link>
            </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        .auth-spinner { display: inline-block; width: 18px; height: 18px; border: 2.5px solid rgba(255,255,255,0.3); border-top: 2.5px solid #fff; border-radius: 50%; animation: spin 0.7s linear infinite; }
        @media (max-width: 768px) {
          .auth-brand { display: none !important; }
          .auth-form { flex: 1 1 100% !important; background: linear-gradient(180deg,#f0fdfa 0%,#fff 30%) !important; }
        }
      `}</style>
    </div>
  );
}
