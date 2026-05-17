"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import { register as mockRegister } from "@/controllers/authService";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPw, setShowPw] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(""); setSuccess("");
    if (!name.trim() || !email.trim() || !password.trim()) { setError("يرجى تعبئة جميع الحقول"); return; }
    if (password.length < 6) { setError("كلمة المرور يجب أن تكون 6 أحرف على الأقل"); return; }
    if (password !== confirm) { setError("كلمتا المرور غير متطابقتين"); return; }

    setLoading(true);

    // ── Supabase Auth ──
    if (isSupabaseConfigured()) {
      try {
        const { data, error: authError } = await supabase.auth.signUp({
          email: email.trim(),
          password,
          options: {
            data: { full_name: name.trim() },
          },
        });

        if (authError) {
          setLoading(false);
          if (authError.message.includes("already registered")) {
            setError("هذا البريد الإلكتروني مسجّل بالفعل");
          } else if (authError.message.includes("password")) {
            setError("كلمة المرور ضعيفة جداً. استخدم 6 أحرف على الأقل");
          } else {
            setError("حدث خطأ أثناء إنشاء الحساب: " + authError.message);
          }
          return;
        }

        // Insert profile record
        if (data.user) {
          await supabase.from("profiles").upsert({
            id: data.user.id,
            full_name: name.trim(),
            email: email.trim().toLowerCase(),
            role: "passenger",
          });
        }

        setLoading(false);
        setSuccess("تم إنشاء حسابك بنجاح! 🎉 تحقق من بريدك الإلكتروني لتأكيد الحساب");
        return;
      } catch {
        setLoading(false);
        setError("حدث خطأ في الاتصال بالخادم");
        return;
      }
    }

    // ── Fallback: mock auth ──
    setTimeout(() => {
      const result = mockRegister(name.trim(), email.trim(), password);
      setLoading(false);
      if (!result.success) { setError(result.message); return; }
      setSuccess("تم إنشاء الحساب بنجاح! جاري التحويل...");
      setTimeout(() => router.push("/login"), 1500);
    }, 600);
  };

  const inputStyle: React.CSSProperties = {
    width: "100%", padding: "0.85rem 1rem 0.85rem 1rem", borderRadius: "12px",
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
        <div style={{ position: "absolute", top: "40%", left: "15%", width: "120px", height: "120px", borderRadius: "30%", background: "rgba(255,255,255,0.03)", transform: "rotate(45deg)", animation: "float 7s ease-in-out infinite 0.5s" }} />
        <div style={{ position: "absolute", inset: 0, opacity: 0.04, backgroundImage: "radial-gradient(circle,rgba(255,255,255,0.8) 1px,transparent 1px)", backgroundSize: "30px 30px" }} />

        <div style={{ position: "relative", zIndex: 2, textAlign: "center", maxWidth: "400px" }}>
          <div style={{ width: "80px", height: "80px", borderRadius: "24px", background: "rgba(255,255,255,0.15)", backdropFilter: "blur(10px)", border: "1px solid rgba(255,255,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 2rem", fontSize: "2.5rem", animation: "fadeInUp 0.8s ease-out" }}>🎫</div>
          <h1 style={{ fontSize: "2.2rem", fontWeight: 900, color: "#fff", marginBottom: "0.75rem", lineHeight: 1.3, animation: "fadeInUp 0.8s ease-out 0.1s both" }}>انضم إلينا اليوم</h1>
          <p style={{ fontSize: "1.05rem", color: "rgba(255,255,255,0.8)", marginBottom: "2.5rem", lineHeight: 1.8, animation: "fadeInUp 0.8s ease-out 0.2s both" }}>أنشئ حسابك واستمتع بحجز تذاكر القطارات في الرياض بكل سهولة</p>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", animation: "fadeInUp 0.8s ease-out 0.3s both" }}>
            {[{ i: "✨", t: "تسجيل سريع وسهل" }, { i: "📱", t: "إدارة حجوزاتك من أي مكان" }, { i: "🎁", t: "عروض حصرية للأعضاء" }].map((f, idx) => (
              <div key={idx} style={{ display: "flex", alignItems: "center", gap: "0.75rem", background: "rgba(255,255,255,0.1)", backdropFilter: "blur(8px)", borderRadius: "12px", padding: "0.7rem 1.2rem", border: "1px solid rgba(255,255,255,0.12)" }}>
                <span style={{ fontSize: "1.15rem" }}>{f.i}</span>
                <span style={{ color: "rgba(255,255,255,0.95)", fontSize: "0.9rem", fontWeight: 600 }}>{f.t}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ─── Right Form Panel ─── */}
      <div className="auth-form" style={{ flex: "1 1 50%", background: "#fff", display: "flex", alignItems: "center", justifyContent: "center", padding: "2rem", overflowY: "auto" }}>
        <div style={{ width: "100%", maxWidth: "420px", animation: "fadeInUp 0.6s ease-out" }}>
          <h2 style={{ fontSize: "1.85rem", fontWeight: 800, color: "#0f172a", marginBottom: "0.4rem" }}>إنشاء حساب جديد</h2>
          <p style={{ color: "#64748b", fontSize: "0.95rem", marginBottom: "1.5rem" }}>أدخل بياناتك لإنشاء حساب مسافر</p>

          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            {error && <div style={{ background: "rgba(239,68,68,0.06)", color: "#dc2626", border: "1px solid rgba(239,68,68,0.15)", borderRadius: "12px", padding: "0.7rem 1rem", fontSize: "0.85rem", fontWeight: 600, textAlign: "center" }}>⚠️ {error}</div>}
            {success && <div style={{ background: "rgba(34,197,94,0.06)", color: "#16a34a", border: "1px solid rgba(34,197,94,0.15)", borderRadius: "12px", padding: "0.85rem 1rem", fontSize: "0.85rem", fontWeight: 600, textAlign: "center", lineHeight: 1.6 }}>✅ {success}</div>}

            {/* Name */}
            <div>
              <label htmlFor="register-name" style={{ display: "block", fontSize: "0.85rem", fontWeight: 700, color: "#374151", marginBottom: "0.4rem" }}>الاسم الكامل</label>
              <div style={{ position: "relative" }}>
                <span style={{ position: "absolute", right: "14px", top: "50%", transform: "translateY(-50%)", fontSize: "1rem", opacity: 0.4, pointerEvents: "none" }}>👤</span>
                <input id="register-name" type="text" placeholder="مثال: خالد الفهد" value={name} onChange={e => setName(e.target.value)} style={{ ...inputStyle, paddingRight: "2.75rem" }} onFocus={focusIn} onBlur={focusOut} required />
              </div>
            </div>

            {/* Email */}
            <div>
              <label htmlFor="register-email" style={{ display: "block", fontSize: "0.85rem", fontWeight: 700, color: "#374151", marginBottom: "0.4rem" }}>البريد الإلكتروني</label>
              <div style={{ position: "relative" }}>
                <span style={{ position: "absolute", right: "14px", top: "50%", transform: "translateY(-50%)", fontSize: "1rem", opacity: 0.4, pointerEvents: "none" }}>📧</span>
                <input id="register-email" type="email" dir="ltr" placeholder="example@email.com" value={email} onChange={e => setEmail(e.target.value)} style={{ ...inputStyle, paddingRight: "2.75rem" }} onFocus={focusIn} onBlur={focusOut} required />
              </div>
            </div>

            {/* Password */}
            <div>
              <label htmlFor="register-password" style={{ display: "block", fontSize: "0.85rem", fontWeight: 700, color: "#374151", marginBottom: "0.4rem" }}>كلمة المرور</label>
              <div style={{ position: "relative" }}>
                <span style={{ position: "absolute", right: "14px", top: "50%", transform: "translateY(-50%)", fontSize: "1rem", opacity: 0.4, pointerEvents: "none" }}>🔑</span>
                <input id="register-password" type={showPw ? "text" : "password"} dir="ltr" placeholder="6 أحرف على الأقل" value={password} onChange={e => setPassword(e.target.value)} style={{ ...inputStyle, paddingRight: "2.75rem", paddingLeft: "2.75rem" }} onFocus={focusIn} onBlur={focusOut} required />
                <button type="button" onClick={() => setShowPw(!showPw)} style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", fontSize: "0.9rem", opacity: 0.5, padding: "4px" }}>{showPw ? "🙈" : "👁️"}</button>
              </div>
            </div>

            {/* Confirm */}
            <div>
              <label htmlFor="register-confirm" style={{ display: "block", fontSize: "0.85rem", fontWeight: 700, color: "#374151", marginBottom: "0.4rem" }}>تأكيد كلمة المرور</label>
              <div style={{ position: "relative" }}>
                <span style={{ position: "absolute", right: "14px", top: "50%", transform: "translateY(-50%)", fontSize: "1rem", opacity: 0.4, pointerEvents: "none" }}>🔒</span>
                <input id="register-confirm" type="password" dir="ltr" placeholder="أعد إدخال كلمة المرور" value={confirm} onChange={e => setConfirm(e.target.value)} style={{ ...inputStyle, paddingRight: "2.75rem" }} onFocus={focusIn} onBlur={focusOut} required />
              </div>
            </div>

            <button id="register-submit" type="submit" disabled={loading} style={{
              width: "100%", padding: "0.9rem", borderRadius: "14px", border: "none",
              background: loading ? "#94a3b8" : "linear-gradient(135deg,#0f766e,#14b8a6,#0d9488)",
              color: "#fff", fontSize: "1rem", fontWeight: 800, fontFamily: "inherit",
              cursor: loading ? "not-allowed" : "pointer",
              boxShadow: loading ? "none" : "0 4px 20px rgba(20,184,166,0.3)",
              transition: "all 0.3s cubic-bezier(0.4,0,0.2,1)",
            }}
              onMouseEnter={e => { if (!loading) { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 8px 30px rgba(20,184,166,0.4)"; } }}
              onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = loading ? "none" : "0 4px 20px rgba(20,184,166,0.3)"; }}
            >
              {loading ? <span style={{ display: "flex", alignItems: "center", gap: "0.5rem", justifyContent: "center" }}><span className="auth-spinner" />جاري إنشاء الحساب...</span> : "إنشاء حساب 🚀"}
            </button>
          </form>

          <div style={{ display: "flex", alignItems: "center", gap: "1rem", margin: "1.25rem 0" }}>
            <div style={{ flex: 1, height: "1px", background: "linear-gradient(to left,transparent,#e2e8f0)" }} />
            <span style={{ color: "#94a3b8", fontSize: "0.8rem", fontWeight: 600 }}>أو</span>
            <div style={{ flex: 1, height: "1px", background: "linear-gradient(to right,transparent,#e2e8f0)" }} />
          </div>

          <p style={{ textAlign: "center", fontSize: "0.9rem", color: "#64748b", margin: 0 }}>
            لديك حساب بالفعل؟{" "}
            <Link href="/login" style={{ color: "#0f766e", fontWeight: 700, textDecoration: "none" }}>تسجيل الدخول</Link>
          </p>
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
