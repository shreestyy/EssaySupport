import React from "react";
import Link from "next/link";
import { Sparkles, BookOpen, Layers } from "lucide-react";
import { Button } from "./ui/button";

export const Navbar: React.FC = () => {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-white/95 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Left-aligned brand */}
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center text-white shadow-soft group-hover:bg-primary-hover transition-colors">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-lg font-bold text-typography-heading tracking-tight">
                MyThorneAI
              </span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-primary-light text-primary border border-primary/10">
                Essay Support
              </span>
            </div>
          </Link>
        </div>

        {/* Center / Right navigation */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-1 text-sm font-medium text-typography-body mr-2">
            <Link
              href="/"
              className="px-3 py-1.5 rounded-full hover:text-typography-heading hover:bg-surface-panel transition-colors"
            >
              Upload
            </Link>
            <Link
              href="/editor"
              className="px-3 py-1.5 rounded-full hover:text-typography-heading hover:bg-surface-panel transition-colors"
            >
              Editor & Analysis
            </Link>
            <Link
              href="/progress"
              className="px-3 py-1.5 rounded-full hover:text-typography-heading hover:bg-surface-panel transition-colors"
            >
              Progress
            </Link>
          </div>

          <Link href="/editor">
            <Button variant="primary" size="sm">
              <Sparkles className="w-3.5 h-3.5" />
              View Analysis
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
};
