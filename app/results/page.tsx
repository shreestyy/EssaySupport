"use client";

import React, { useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, RotateCcw } from "lucide-react";
import { useAppStore } from "@/lib/store";
import { MOCK_ISSUES } from "@/lib/mock-data";
import { ROUTES } from "@/lib/routes";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { StepTracker } from "@/components/step-tracker";

function getDynamicResultsContent(resolvedCount: number, totalCount: number) {
  if (totalCount === 0) {
    return {
      heading: "Ready for Review",
      subtitle: "Add or paste an essay draft to check for improvements.",
    };
  }

  const ratio = resolvedCount / totalCount;

  if (resolvedCount === totalCount) {
    return {
      heading: "All issues resolved",
      subtitle: "All flagged diagnostic items have been addressed.",
    };
  }

  if (ratio >= 0.75) {
    return {
      heading: "Great progress",
      subtitle: "Most flagged suggestions are resolved.",
    };
  }

  if (resolvedCount > 0) {
    return {
      heading: "Revision in progress",
      subtitle: `${resolvedCount} of ${totalCount} items resolved so far.`,
    };
  }

  return {
    heading: "Review complete",
    subtitle: "Review suggestions in the editor to refine your draft.",
  };
}

export default function ResultsPage() {
  const router = useRouter();
  const {
    issues,
    essayText,
    setActiveIssueIndex,
    resetToMockData,
  } = useAppStore();

  useEffect(() => {
    if (!essayText.trim() && issues.length === 0) {
      router.replace(ROUTES.home);
    }
  }, [essayText, issues, router]);

  const currentIssues = issues.length > 0 ? issues : MOCK_ISSUES;
  const totalCount = currentIssues.length;
  const resolvedCount = currentIssues.filter((i) => i.resolved).length;
  const percentage =
    totalCount > 0 ? Math.round((resolvedCount / totalCount) * 100) : 0;

  const content = useMemo(
    () => getDynamicResultsContent(resolvedCount, totalCount),
    [resolvedCount, totalCount]
  );

  const handleBackToEditor = () => {
    const firstUnresolvedIndex = currentIssues.findIndex((i) => !i.resolved);
    const targetIndex = firstUnresolvedIndex !== -1 ? firstUnresolvedIndex : 0;
    setActiveIssueIndex(targetIndex);
    router.push(ROUTES.editor);
  };

  const handleSeeProgress = () => {
    router.push(ROUTES.progress);
  };

  if (!essayText.trim() && issues.length === 0) {
    return (
      <div className="min-h-[300px] flex items-center justify-center p-4">
        <p className="text-xs text-typography-muted">Loading...</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6 page-fade-in">
      {/* 1. Dashboard Pathway Step Tracker */}
      <StepTracker currentStep={3} />

      {/* 2. Main Results Card */}
      <Card
        variant="default"
        className="rounded-2xl border border-border bg-white p-6 sm:p-8 shadow-soft space-y-6"
      >
        {/* Header: Clean, direct, no puffy status badge */}
        <div className="space-y-1">
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-typography-heading">
            {content.heading}
          </h2>
          <p className="text-sm text-typography-muted">
            {content.subtitle}
          </p>
        </div>

        {/* Progress Bar Section */}
        <div className="bg-surface-panel rounded-xl p-5 border border-border space-y-2.5">
          <div className="flex items-center justify-between text-sm">
            <span className="font-semibold text-typography-heading">
              Progress
            </span>
            <span className="font-semibold text-typography-heading">
              {resolvedCount} of {totalCount} resolved ({percentage}%)
            </span>
          </div>

          <div className="w-full bg-white border border-border rounded-full h-2 p-0.5 overflow-hidden">
            <div
              className="bg-primary h-full rounded-full transition-all duration-500 ease-out"
              style={{ width: `${Math.max(percentage, 2)}%` }}
            />
          </div>

          <div className="flex items-center justify-between text-xs text-typography-muted pt-0.5">
            <span>
              {totalCount - resolvedCount === 0
                ? "All items complete"
                : `${totalCount - resolvedCount} unresolved ${
                    totalCount - resolvedCount === 1 ? "issue" : "issues"
                  } remaining`}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
          <Button
            variant="secondary"
            size="md"
            onClick={handleBackToEditor}
            className="w-full sm:w-auto font-medium"
          >
            <ArrowLeft className="w-4 h-4 mr-1.5" />
            Back to editor
          </Button>

          <Button
            variant="primary"
            size="md"
            onClick={handleSeeProgress}
            className="w-full sm:w-auto font-semibold"
          >
            See progress
            <ArrowRight className="w-4 h-4 ml-1.5" />
          </Button>
        </div>
      </Card>

      {/* Demo reset link */}
      <div className="text-center">
        <button
          type="button"
          onClick={resetToMockData}
          className="text-xs text-typography-muted hover:text-primary transition-colors inline-flex items-center gap-1"
        >
          <RotateCcw className="w-3 h-3" />
          Reset demo issues
        </button>
      </div>
    </div>
  );
}
