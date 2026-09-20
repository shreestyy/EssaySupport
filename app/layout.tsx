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
  title: "Essay Support | MyThorneAI",
  description:
    "AI-powered essay diagnostic feedback and rubric alignment inside the MyThorneAI dashboard.",
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
        The parent dashboard provides the left rail sidebar and page wrapper.
      */}
      <body className="min-h-screen font-sans bg-surface-panel/80 text-typography-body antialiased">
        <main className="w-full">{children}</main>
      </body>
    </html>
  );
}
