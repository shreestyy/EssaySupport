"use client";

import React from "react";

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
    <div className={`w-full ${className}`}>
      <div className="flex items-center justify-between text-xs text-typography-muted mb-2">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-typography-heading">
            Essay Refiner
          </span>
          <span>·</span>
          <span>
            Step {currentStep} of 4: {STEPS[currentStep - 1].label}
          </span>
        </div>
      </div>

      {/* Thin step line indicator */}
      <div className="grid grid-cols-4 gap-2">
        {STEPS.map((step) => {
          const isCompleted = step.number < currentStep;
          const isCurrent = step.number === currentStep;

          return (
            <div key={step.number} className="flex flex-col gap-1.5">
              <div
                className={`h-1 rounded-full transition-all duration-300 ${
                  isCompleted
                    ? "bg-primary"
                    : isCurrent
                    ? "bg-primary"
                    : "bg-border"
                }`}
              />
              <span
                className={`text-[11px] truncate hidden sm:block ${
                  isCurrent
                    ? "font-semibold text-typography-heading"
                    : isCompleted
                    ? "text-typography-body font-medium"
                    : "text-typography-muted"
                }`}
              >
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

