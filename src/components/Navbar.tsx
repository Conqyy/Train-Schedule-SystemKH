"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect, useCallback } from "react";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import { getCurrentUser, logout as mockLogout, AuthUser } from "@/controllers/authService";

/* SVG Train Icon */
function TrainIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 2C8.13 2 5 3.13 5 5v12c0 1.66 1.34 3 3 3l-1.5 1.5v.5h2l1.5-1.5h4l1.5 1.5h2v-.5L16 20c1.66 0 3-1.34 3-3V5c0-1.87-3.13-3-7-3z" fill="url(#trainGrad)" />
      <rect x="7" y="6" width="10" height="5" rx="1.5" fill="rgba(255,255,255,0.9)" />
      <circle cx="9" cy="16" r="1.5" fill="rgba(255,255,255,0.9)" />
      <circle cx="15" cy="16" r="1.5" fill="rgba(255,255,255,0.9)" />
      <rect x="11" y="3.5" width="2" height="2" rx="0.5" fill="rgba(255,255,255,0.7)" />
      <defs>
        <linearGradient id="trainGrad" x1="5" y1="2" x2="19" y2="22" gradientUnits="userSpaceOnUse">
          <stop stopColor="#14b8a6" />
          <stop offset="1" stopColor="#10b981" />
        </linearGradient>
      </defs>
    </svg>
  );
}

/* SVG Icons for sidebar */
function HomeIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  );
}
function TicketIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z" />
      <path d="M13 5v2" /><path d="M13 17v2" /><path d="M13 11v2" />
    </svg>
  );
}
function ReservationsIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="18" height="18" x="3" y="4" rx="2" ry="2" /><line x1="16" x2="16" y1="2" y2="6" /><line x1="8" x2="8" y1="2" y2="6" /><line x1="3" x2="21" y1="10" y2="10" />
      <path d="m9 16 2 2 4-4" />
    </svg>
  );
}
function SettingsIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </svg>
  );
}
function AdminIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  );
}
function LogoutIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" x2="9" y1="12" y2="12" />
    </svg>
  );
}

interface UserProfile {
  name: string;
  email: string;
  role: "admin" | "passenger";
}

export default function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [mounted, setMounted] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const loadUser = useCallback(async () => {
    if (isSupabaseConfigured()) {
      const { data: { user: authUser } } = await supabase.auth.getUser();
      if (authUser) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("full_name, role")
          .eq("id", authUser.id)
          .single();
        setUser({
          name: profile?.full_name || authUser.email?.split("@")[0] || "مستخدم",
          email: authUser.email || "",
          role: profile?.role || "passenger",
        });
        return;
      }
    }
    // Fallback to mock
    const mockUser = getCurrentUser();
    if (mockUser) {
      setUser({ name: mockUser.name, email: mockUser.email, role: mockUser.role });
    } else {
      setUser(null);
    }
  }, []);

  useEffect(() => {
    setMounted(true);
    loadUser();
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);

    // Listen for Supabase auth changes
    let subscription: { unsubscribe: () => void } | null = null;
    if (isSupabaseConfigured()) {
      const { data } = supabase.auth.onAuthStateChange(() => {
        loadUser();
      });
      subscription = data.subscription;
    }

    return () => {
      window.removeEventListener("scroll", handleScroll);
      subscription?.unsubscribe();
    };
  }, [pathname, loadUser]);

  const handleLogout = async () => {
    if (isSupabaseConfigured()) {
      await supabase.auth.signOut();
    }
    mockLogout();
    setUser(null);
    setSidebarOpen(false);
    window.location.href = "/login";
  };

  const isAuthPage = pathname === "/login" || pathname === "/register" || pathname === "/admin/login" || pathname === "/forgot-password" || pathname === "/update-password";

  // Navigation links - different for logged-in vs logged-out
  const guestLinks = [
    { href: "/", label: "الرئيسية", icon: <HomeIcon /> },
    { href: "/book", label: "حجز تذكرة", icon: <TicketIcon /> },
    { href: "/login", label: "تسجيل الدخول", icon: <></> },
    { href: "/admin/login", label: "بوابة الموظفين", icon: <AdminIcon /> },
  ];

  const userLinks = [
    { href: "/", label: "الرئيسية", icon: <HomeIcon /> },
    { href: "/book", label: "حجز تذكرة", icon: <TicketIcon /> },
    { href: "/my-reservations", label: "حجوزاتي", icon: <ReservationsIcon /> },
  ];

  const navLinks = user ? userLinks : guestLinks;

  // Sidebar links for logged-in users
  const sidebarLinks = [
    { href: "/", label: "الرئيسية", icon: <HomeIcon />, emoji: "🏠" },
    { href: "/book", label: "حجز تذكرة", icon: <TicketIcon />, emoji: "🎫" },
    { href: "/my-reservations", label: "حجوزاتي", icon: <ReservationsIcon />, emoji: "📋" },
    ...(user?.role === "admin" ? [{ href: "/admin", label: "لوحة الإدارة", icon: <AdminIcon />, emoji: "🛡️" }] : []),
  ];

  const settingsLink = { href: "#", label: "الإعدادات", icon: <SettingsIcon />, emoji: "⚙️" };

  return (
    <>
      <nav
        id="main-navbar"
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
        style={{
          background: scrolled ? "rgba(5, 11, 24, 0.92)" : "rgba(5, 11, 24, 0.7)",
          backdropFilter: "blur(24px)",
          WebkitBackdropFilter: "blur(24px)",
          borderBottom: scrolled ? "1px solid rgba(20, 184, 166, 0.1)" : "1px solid rgba(148, 163, 184, 0.04)",
          boxShadow: scrolled ? "0 4px 30px rgba(0,0,0,0.15)" : "none",
        }}
      >
        <div className="max-w-7xl mx-auto px-4 md:px-8 flex items-center justify-between h-16 md:h-18" style={{ maxWidth: "1280px", boxSizing: "border-box" }}>
          {/* Left: Sidebar toggle + Logo */}
          <div className="flex items-center gap-3">
            {/* Sidebar toggle (only for logged-in users) */}
            {mounted && user && !isAuthPage && (
              <button
                id="sidebar-toggle"
                onClick={() => setSidebarOpen(!sidebarOpen)}
                aria-label="القائمة الجانبية"
                style={{
                  background: "none", border: "none", cursor: "pointer", padding: "6px",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  borderRadius: "10px", transition: "all 0.2s",
                }}
                onMouseEnter={e => { e.currentTarget.style.background = "rgba(20,184,166,0.08)"; }}
                onMouseLeave={e => { e.currentTarget.style.background = "none"; }}
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round">
                  <line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" />
                </svg>
              </button>
            )}

            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 no-underline group">
              <div
                className="flex items-center justify-center w-9 h-9 rounded-xl transition-all duration-300 group-hover:scale-110"
                style={{
                  background: "linear-gradient(135deg, rgba(20,184,166,0.15), rgba(16,185,129,0.1))",
                  border: "1px solid rgba(20,184,166,0.2)",
                }}
              >
                <TrainIcon />
              </div>
              <div className="flex flex-col">
                <span
                  className="font-extrabold text-base tracking-tight leading-tight"
                  style={{
                    background: "linear-gradient(135deg, #14b8a6, #10b981)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}
                >
                  قطارات الرياض
                </span>
                <span className="text-[10px] font-medium leading-tight" style={{ color: "#64748b" }}>
                  Riyadh Trains
                </span>
              </div>
            </Link>
          </div>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200"
                  style={{
                    color: isActive ? "#14b8a6" : "#94a3b8",
                    background: isActive ? "rgba(20,184,166,0.08)" : "transparent",
                    borderBottom: isActive ? "2px solid #14b8a6" : "2px solid transparent",
                  }}
                >
                  <span style={{ display: "flex", alignItems: "center" }}>{link.icon}</span>
                  {link.label}
                </Link>
              );
            })}

            {/* Auth Status / User Profile */}
            {mounted && user && (
              <div
                className="flex items-center gap-3 mr-3 pr-3"
                style={{ borderRight: "1px solid rgba(148,163,184,0.1)" }}
              >
                <div
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg cursor-pointer"
                  style={{ background: "rgba(20,184,166,0.06)" }}
                  onClick={() => setSidebarOpen(true)}
                >
                  {/* Avatar */}
                  <div style={{
                    width: "26px", height: "26px", borderRadius: "8px",
                    background: "linear-gradient(135deg, #0f766e, #14b8a6)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: "0.7rem", color: "#fff", fontWeight: 800,
                  }}>
                    {user.name.charAt(0)}
                  </div>
                  <span className="text-xs font-semibold" style={{ color: "#e2e8f0" }}>{user.name}</span>
                  <span className="text-[9px] px-1.5 py-0.5 rounded-full" style={{
                    color: user.role === "admin" ? "#fbbf24" : "#14b8a6",
                    background: user.role === "admin" ? "rgba(251,191,36,0.1)" : "rgba(20,184,166,0.1)",
                    fontWeight: 700,
                  }}>
                    {user.role === "admin" ? "مشرف" : "مسافر"}
                  </span>
                </div>
                <button
                  id="logout-btn"
                  onClick={handleLogout}
                  className="px-3 py-1.5 rounded-lg text-xs font-bold transition-all"
                  style={{
                    color: "#f87171", background: "rgba(239,68,68,0.06)",
                    border: "1px solid rgba(239,68,68,0.12)", cursor: "pointer",
                  }}
                >
                  خروج
                </button>
              </div>
            )}
          </div>

          {/* Mobile Toggle */}
          <button
            id="mobile-menu-toggle"
            className="md:hidden flex flex-col gap-1.5 p-2"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="القائمة"
            style={{ background: "none", border: "none", cursor: "pointer" }}
          >
            {[0, 1, 2].map((i) => (
              <span
                key={i}
                className="block w-5 h-0.5 rounded transition-all duration-200"
                style={{
                  background: "#94a3b8",
                  transform:
                    mobileOpen && i === 0 ? "rotate(45deg) translate(2px, 6px)" :
                    mobileOpen && i === 2 ? "rotate(-45deg) translate(2px, -6px)" : "none",
                  opacity: mobileOpen && i === 1 ? 0 : 1,
                }}
              />
            ))}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileOpen && (
          <div
            className="md:hidden px-4 pb-4 animate-slide-in"
            style={{ borderTop: "1px solid rgba(148,163,184,0.06)" }}
          >
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-semibold transition-colors"
                style={{
                  color: pathname === link.href ? "#14b8a6" : "#94a3b8",
                  background: pathname === link.href ? "rgba(20,184,166,0.08)" : "transparent",
                }}
              >
                <span style={{ display: "flex" }}>{link.icon}</span>
                {link.label}
              </Link>
            ))}
            {mounted && user && (
              <button
                onClick={() => { handleLogout(); setMobileOpen(false); }}
                className="flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-semibold w-full"
                style={{ color: "#f87171", background: "none", border: "none", cursor: "pointer" }}
              >
                <LogoutIcon /> خروج ({user.name})
              </button>
            )}
          </div>
        )}
      </nav>

      {/* ─── Sidebar Drawer ─── */}
      {mounted && user && !isAuthPage && (
        <>
          {/* Backdrop */}
          <div
            onClick={() => setSidebarOpen(false)}
            style={{
              position: "fixed", inset: 0, zIndex: 55,
              background: "rgba(0,0,0,0.5)",
              backdropFilter: "blur(4px)",
              opacity: sidebarOpen ? 1 : 0,
              pointerEvents: sidebarOpen ? "auto" : "none",
              transition: "opacity 0.3s ease",
            }}
          />

          {/* Sidebar Panel */}
          <aside
            id="sidebar-drawer"
            style={{
              position: "fixed", top: 0, right: 0, bottom: 0, zIndex: 60,
              width: "280px", maxWidth: "85vw",
              background: "rgba(8, 15, 30, 0.97)",
              backdropFilter: "blur(24px)",
              borderLeft: "1px solid rgba(71,85,105,0.25)",
              boxShadow: "-8px 0 40px rgba(0,0,0,0.3)",
              transform: sidebarOpen ? "translateX(0)" : "translateX(100%)",
              transition: "transform 0.3s cubic-bezier(0.4,0,0.2,1)",
              display: "flex", flexDirection: "column",
              fontFamily: "'Tajawal', sans-serif",
            }}
            dir="rtl"
          >
            {/* Sidebar Header - User Profile */}
            <div style={{
              padding: "1.5rem 1.25rem", borderBottom: "1px solid rgba(71,85,105,0.2)",
              background: "linear-gradient(180deg, rgba(20,184,166,0.05) 0%, transparent 100%)",
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.75rem" }}>
                <div style={{
                  width: "44px", height: "44px", borderRadius: "14px",
                  background: "linear-gradient(135deg, #0f766e, #14b8a6)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: "1.1rem", color: "#fff", fontWeight: 800,
                  border: "2px solid rgba(20,184,166,0.3)",
                  boxShadow: "0 4px 16px rgba(20,184,166,0.2)",
                }}>
                  {user.name.charAt(0)}
                </div>
                <div>
                  <p style={{ fontSize: "0.95rem", fontWeight: 800, color: "#f1f5f9", margin: 0 }}>{user.name}</p>
                  <p style={{ fontSize: "0.72rem", color: "#64748b", margin: 0, direction: "ltr" }}>{user.email}</p>
                </div>
              </div>
              <span style={{
                display: "inline-flex", alignItems: "center", gap: "0.3rem",
                fontSize: "0.68rem", fontWeight: 700, padding: "0.2rem 0.6rem", borderRadius: "999px",
                color: user.role === "admin" ? "#fbbf24" : "#4ade80",
                background: user.role === "admin" ? "rgba(251,191,36,0.08)" : "rgba(34,197,94,0.08)",
                border: `1px solid ${user.role === "admin" ? "rgba(251,191,36,0.15)" : "rgba(34,197,94,0.15)"}`,
              }}>
                <span style={{
                  width: "5px", height: "5px", borderRadius: "50%",
                  background: user.role === "admin" ? "#fbbf24" : "#4ade80",
                }} />
                {user.role === "admin" ? "مشرف النظام" : "حساب مسافر"}
              </span>
            </div>

            {/* Sidebar Navigation Links */}
            <div style={{ flex: 1, padding: "0.75rem", overflowY: "auto" }}>
              <p style={{ fontSize: "0.68rem", fontWeight: 700, color: "#475569", padding: "0.5rem 0.75rem", margin: 0, textTransform: "uppercase", letterSpacing: "1px" }}>
                القائمة
              </p>
              {sidebarLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setSidebarOpen(false)}
                    style={{
                      display: "flex", alignItems: "center", gap: "0.75rem",
                      padding: "0.75rem 1rem", borderRadius: "12px",
                      color: isActive ? "#14b8a6" : "#94a3b8",
                      background: isActive ? "rgba(20,184,166,0.1)" : "transparent",
                      fontWeight: isActive ? 700 : 600, fontSize: "0.88rem",
                      textDecoration: "none", transition: "all 0.2s",
                      marginBottom: "0.25rem",
                      borderRight: isActive ? "3px solid #14b8a6" : "3px solid transparent",
                    }}
                  >
                    <span style={{ display: "flex", opacity: isActive ? 1 : 0.6 }}>{link.icon}</span>
                    {link.label}
                  </Link>
                );
              })}


            </div>

            {/* Sidebar Footer - Logout */}
            <div style={{ padding: "1rem 1.25rem", borderTop: "1px solid rgba(71,85,105,0.2)" }}>
              <button
                onClick={handleLogout}
                style={{
                  display: "flex", alignItems: "center", gap: "0.75rem",
                  width: "100%", padding: "0.7rem 1rem", borderRadius: "12px",
                  color: "#f87171", background: "rgba(239,68,68,0.06)",
                  border: "1px solid rgba(239,68,68,0.12)",
                  fontWeight: 700, fontSize: "0.85rem", cursor: "pointer",
                  fontFamily: "inherit", transition: "all 0.2s",
                }}
              >
                <LogoutIcon />
                تسجيل الخروج
              </button>
              <p style={{ textAlign: "center", marginTop: "0.75rem", fontSize: "0.6rem", color: "#475569" }}>
                نظام قطارات الرياض v1.0 🇸🇦
              </p>
            </div>
          </aside>
        </>
      )}
    </>
  );
}
