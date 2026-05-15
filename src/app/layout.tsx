import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "جداول قطارات الرياض — Riyadh Train Schedules",
  description:
    "استعرض جداول القطارات واحجز تذكرتك في الرياض — محطة خالد، العليا، كافد، المطار والمزيد.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ar" dir="rtl">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Tajawal:wght@300;400;500;700;800;900&family=Inter:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="flex flex-col min-h-screen" style={{ overflowX: "hidden" }}>
        <Navbar />
        <main style={{ flex: 1, paddingTop: "5rem", paddingBottom: "3rem", paddingLeft: "clamp(1rem, 3vw, 3rem)", paddingRight: "clamp(1rem, 3vw, 3rem)", maxWidth: "1280px", marginLeft: "auto", marginRight: "auto", width: "100%", boxSizing: "border-box" }}>
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
