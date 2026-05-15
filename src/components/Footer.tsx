"use client";

import Link from "next/link";

const footerLinks = {
  routes: [
    { href: "/", label: "الرئيسية" },
    { href: "/book", label: "حجز تذكرة" },
    { href: "/login", label: "تسجيل الدخول" },
  ],
  admin: [
    { href: "/admin/login", label: "بوابة الموظفين" },
    { href: "/admin", label: "لوحة التحكم" },
  ],
  stations: [
    "محطة خالد",
    "مطار الملك خالد",
    "العليا",
    "مركز كافد المالي",
  ],
};

export default function Footer() {
  return (
    <footer
      style={{
        background: "linear-gradient(180deg, transparent 0%, rgba(5,11,24,0.95) 20%, #050b18 100%)",
        borderTop: "1px solid rgba(148,163,184,0.06)",
      }}
    >
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-12">
        {/* Main footer grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center text-lg"
                style={{
                  background: "linear-gradient(135deg, rgba(20,184,166,0.15), rgba(16,185,129,0.1))",
                  border: "1px solid rgba(20,184,166,0.2)",
                }}
              >
                🚆
              </div>
              <span
                className="font-extrabold text-base"
                style={{
                  background: "linear-gradient(135deg, #14b8a6, #10b981)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                قطارات الرياض
              </span>
            </div>
            <p className="text-sm leading-relaxed" style={{ color: "#64748b" }}>
              نظام حجز وإدارة رحلات القطارات في مدينة الرياض.
              رحلات يومية من محطة خالد إلى جميع أنحاء المدينة.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-bold mb-4" style={{ color: "#e2e8f0" }}>
              روابط سريعة
            </h4>
            <ul className="flex flex-col gap-2.5">
              {footerLinks.routes.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm transition-colors duration-200"
                    style={{ color: "#64748b" }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = "#14b8a6")}
                    onMouseLeave={(e) => (e.currentTarget.style.color = "#64748b")}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Admin Links */}
          <div>
            <h4 className="text-sm font-bold mb-4" style={{ color: "#e2e8f0" }}>
              الإدارة
            </h4>
            <ul className="flex flex-col gap-2.5">
              {footerLinks.admin.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm transition-colors duration-200"
                    style={{ color: "#64748b" }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = "#14b8a6")}
                    onMouseLeave={(e) => (e.currentTarget.style.color = "#64748b")}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Stations */}
          <div>
            <h4 className="text-sm font-bold mb-4" style={{ color: "#e2e8f0" }}>
              المحطات الرئيسية
            </h4>
            <ul className="flex flex-col gap-2.5">
              {footerLinks.stations.map((s) => (
                <li key={s} className="flex items-center gap-2">
                  <span
                    className="w-1.5 h-1.5 rounded-full"
                    style={{ background: "#14b8a6" }}
                  />
                  <span className="text-sm" style={{ color: "#64748b" }}>
                    {s}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div
          className="h-px mb-6"
          style={{
            background: "linear-gradient(90deg, transparent, rgba(148,163,184,0.1), transparent)",
          }}
        />

        {/* Bottom bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs" style={{ color: "#475569" }}>
            © {new Date().getFullYear()} جداول قطارات الرياض — جميع الحقوق محفوظة 🇸🇦
          </p>
          <div className="flex items-center gap-4">
            <span className="text-xs" style={{ color: "#475569" }}>
              الإصدار 1.0
            </span>
            <span className="text-xs" style={{ color: "#334155" }}>|</span>
            <span className="text-xs" style={{ color: "#475569" }}>
              المملكة العربية السعودية
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
