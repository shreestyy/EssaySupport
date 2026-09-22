import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Essay Refiner | MyThorneAI",
  description:
    "Diagnostic feedback and essay refining inside MyThorneAI Post-Secondary dashboard.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      {/* 
        Embedded directly into MyThorneAI dashboard Post-Secondary tab content slot.
        The parent dashboard provides the left rail sidebar, page title ("Post-Secondary"),
        and tab bar (College | Scholarships | Essay Refiner | Loans).
      */}
      <body className="min-h-screen font-sans bg-surface-panel/80 text-typography-body antialiased">
        <div className="w-full max-w-5xl mx-auto py-6 sm:py-8 px-4 sm:px-6">
          <main className="w-full">{children}</main>
        </div>
      </body>
    </html>
  );
}
