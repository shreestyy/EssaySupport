"use client";

import React from "react";
import Link from "next/link";
import { ROUTES } from "@/lib/routes";

export interface PostSecondaryTabsProps {
  activeTab?: "college" | "scholarships" | "essay-refiner" | "loans";
  className?: string;
}

export const PostSecondaryTabs: React.FC<PostSecondaryTabsProps> = ({
  activeTab = "essay-refiner",
  className = "",
}) => {
  const tabs = [
    { id: "college", label: "College", href: "#" },
    { id: "scholarships", label: "Scholarships", href: "#" },
    { id: "essay-refiner", label: "Essay Refiner", href: ROUTES.home },
    { id: "loans", label: "Loans", href: "#" },
  ];

  return (
    <div className={`w-full ${className}`}>
      {/* Section Heading */}
      <div className="mb-3">
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-typography-heading">
          Post-Secondary
        </h1>
      </div>

      {/* Tabs Row: Simple underlined text links, thin bottom border, no pill/badge styling */}
      <nav
        aria-label="Post-Secondary Tabs"
        className="flex items-center gap-6 sm:gap-8 border-b border-border text-sm font-medium"
      >
        {tabs.map((tab) => {
          const isActive = tab.id === activeTab;
          return (
            <Link
              key={tab.id}
              href={tab.href}
              className={`pb-3 transition-colors relative ${
                isActive
                  ? "text-primary font-semibold border-b-2 border-primary -mb-[1px]"
                  : "text-typography-muted hover:text-typography-body"
              }`}
              aria-current={isActive ? "page" : undefined}
            >
              {tab.label}
            </Link>
          );
        })}
      </nav>
    </div>
  );
};
