"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { getCurrentUser, logout, AuthUser } from "@/controllers/authService";

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

const navLinks = [
  { href: "/", label: "الرئيسية", icon: "🏠" },
  { href: "/book", label: "حجز تذكرة", icon: "🎫" },
  { href: "/login", label: "تسجيل الدخول", icon: "🔑" },
  { href: "/admin/login", label: "بوابة الموظفين", icon: "🛡️" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [user, setUser] = useState<AuthUser | null>(null);
  const [mounted, setMounted] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    setMounted(true);
    setUser(getCurrentUser());
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [pathname]);

  const handleLogout = () => {
    logout();
    setUser(null);
    window.location.href = "/login";
  };

  const isAuthPage = pathname === "/login" || pathname === "/register" || pathname === "/admin/login";

  return (
    <nav
      id="main-navbar"
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
      style={{
        background: scrolled
          ? "rgba(5, 11, 24, 0.92)"
          : "rgba(5, 11, 24, 0.7)",
        backdropFilter: "blur(24px)",
        WebkitBackdropFilter: "blur(24px)",
        borderBottom: scrolled
          ? "1px solid rgba(20, 184, 166, 0.1)"
          : "1px solid rgba(148, 163, 184, 0.04)",
        boxShadow: scrolled ? "0 4px 30px rgba(0,0,0,0.15)" : "none",
      }}
    >
      <div className="max-w-7xl mx-auto px-4 md:px-8 flex items-center justify-between h-16 md:h-18" style={{ maxWidth: "1280px", boxSizing: "border-box" }}>
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
                <span className="text-sm">{link.icon}</span>
                {link.label}
              </Link>
            );
          })}

          {/* Auth Status */}
          {mounted && user && (
            <div
              className="flex items-center gap-3 mr-3 pr-3"
              style={{ borderRight: "1px solid rgba(148,163,184,0.1)" }}
            >
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg" style={{ background: "rgba(20,184,166,0.06)" }}>
                <span className="text-xs">{user.role === "admin" ? "👑" : "👤"}</span>
                <span className="text-xs font-semibold" style={{ color: "#e2e8f0" }}>{user.name}</span>
              </div>
              <button
                id="logout-btn"
                onClick={handleLogout}
                className="px-3 py-1.5 rounded-lg text-xs font-bold transition-all"
                style={{
                  color: "#f87171",
                  background: "rgba(239,68,68,0.06)",
                  border: "1px solid rgba(239,68,68,0.12)",
                  cursor: "pointer",
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
              <span>{link.icon}</span>
              {link.label}
            </Link>
          ))}
          {mounted && user && (
            <button
              onClick={() => { handleLogout(); setMobileOpen(false); }}
              className="flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-semibold w-full"
              style={{ color: "#f87171", background: "none", border: "none", cursor: "pointer" }}
            >
              🚪 خروج ({user.name})
            </button>
          )}
        </div>
      )}
    </nav>
  );
}
