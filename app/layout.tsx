import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { PostSecondaryTabs } from "@/components/post-secondary-tabs";

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
        Embedded into MyThorneAI dashboard content area.
        The parent dashboard provides the left rail sidebar.
        Post-Secondary tabs header wraps the Essay Refiner sub-feature.
      */}
      <body className="min-h-screen font-sans bg-surface-panel/80 text-typography-body antialiased">
        <div className="w-full max-w-5xl mx-auto pt-6 sm:pt-8 px-4 sm:px-6">
          <PostSecondaryTabs />
          <main className="w-full pb-12">{children}</main>
        </div>
      </body>
    </html>
  );
}
