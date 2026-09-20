"use client";

import React from "react";
import { Check } from "lucide-react";

export interface StepTrackerProps {
  currentStep: 1 | 2 | 3 | 4;
  className?: string;
}

interface StepItem {
  number: number;
  label: string;
  shortLabel: string;
}

const STEPS: StepItem[] = [
  { number: 1, label: "Upload Draft", shortLabel: "Upload" },
  { number: 2, label: "Diagnostic Editor", shortLabel: "Editor" },
  { number: 3, label: "Results Report", shortLabel: "Results" },
  { number: 4, label: "Progress Trajectory", shortLabel: "Progress" },
];

export const StepTracker: React.FC<StepTrackerProps> = ({
  currentStep,
  className = "",
}) => {
  return (
    <div
      className={`rounded-2xl border border-border bg-white p-4 sm:p-5 shadow-soft ${className}`}
    >
      {/* Eyebrow label matching dashboard style (e.g. "FALL 2026 • WEEK 4" / "NEXT UP • TODAY") */}
      <div className="flex items-center justify-between pb-3 mb-3 border-b border-border/70 text-[11px] font-bold uppercase tracking-wider text-typography-muted">
        <span>Academic Suite • Essay Support</span>
        <span className="text-primary font-semibold">
          Step {currentStep} of 4
        </span>
      </div>

      {/* Horizontal step-circle pattern borrowing from Career Readiness Pathway */}
      <div className="flex items-center justify-between w-full">
        {STEPS.map((step, idx) => {
          const isCompleted = step.number < currentStep;
          const isCurrent = step.number === currentStep;

          return (
            <React.Fragment key={step.number}>
              {/* Step Node */}
              <div className="flex flex-col items-center gap-1.5 flex-shrink-0">
                <div
                  className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-200 select-none ${
                    isCompleted
                      ? "bg-primary text-white shadow-soft"
                      : isCurrent
                      ? "bg-primary text-white ring-4 ring-primary-light shadow-elevation"
                      : "bg-surface-panel text-typography-muted border border-border"
                  }`}
                  aria-current={isCurrent ? "step" : undefined}
                >
                  {isCompleted ? (
                    <Check className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[2.5]" />
                  ) : (
                    <span>{step.number}</span>
                  )}
                </div>

                <span
                  className={`text-[11px] sm:text-xs transition-colors hidden xs:inline ${
                    isCurrent
                      ? "font-semibold text-typography-heading"
                      : isCompleted
                      ? "font-medium text-typography-body"
                      : "text-typography-muted"
                  }`}
                >
                  <span className="sm:hidden">{step.shortLabel}</span>
                  <span className="hidden sm:inline">{step.label}</span>
                </span>
              </div>

              {/* Connector line between steps */}
              {idx < STEPS.length - 1 && (
                <div
                  className={`h-[2px] flex-1 mx-2 sm:mx-3 transition-colors duration-200 rounded-full ${
                    step.number < currentStep ? "bg-primary" : "bg-border"
                  }`}
                />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};
