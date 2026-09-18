"use client";

import React, { useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Sparkles,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  FileText,
  RotateCcw,
} from "lucide-react";
import { useAppStore } from "@/lib/store";
import { MOCK_ISSUES } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { IconBadge } from "@/components/ui/icon-badge";

// Helper function to dynamically adjust copy and tone based on resolved count
function getDynamicResultsContent(resolvedCount: number, totalCount: number) {
  if (totalCount === 0) {
    return {
      heading: "Ready for Diagnostic Review",
      subtitle:
        "Upload or input your essay draft to generate personalized diagnostic feedback.",
      badge: "No issues loaded",
      badgeColor: "bg-surface-panel text-typography-muted border-border",
      iconColor: "text-primary",
    };
  }

  const ratio = resolvedCount / totalCount;

  if (resolvedCount === totalCount) {
    return {
      heading: "Outstanding Work!",
      subtitle:
        "You have addressed all flagged diagnostic issues. Your essay is polished, rigorous, and ready for submission.",
      badge: "All issues resolved",
      badgeColor: "bg-emerald-50 text-emerald-700 border-emerald-200",
      iconColor: "text-emerald-600",
    };
  }

  if (ratio >= 0.75) {
    return {
      heading: "Great Progress!",
      subtitle:
        "You've resolved the vast majority of flagged items. Just a final touch will bring your draft to top form.",
      badge: "Nearly complete",
      badgeColor: "bg-primary-light text-primary border-primary/20",
      iconColor: "text-primary",
    };
  }

  if (resolvedCount > 0) {
    return {
      heading: "Moving in the Right Direction!",
      subtitle:
        "You're making steady improvements. Continue working through the remaining suggestions in your editor.",
      badge: "Work in progress",
      badgeColor: "bg-amber-50 text-amber-700 border-amber-200",
      iconColor: "text-amber-500",
    };
  }

  // 0 resolved out of total
  return {
    heading: "Diagnostic Review Complete",
    subtitle:
      "We flagged key opportunities to strengthen your thesis, evidence, and sentence structure before submitting.",
    badge: "Pending revisions",
    badgeColor: "bg-surface-panel text-typography-heading border-border",
    iconColor: "text-primary",
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

  // Redirect to / if user lands on /results with no essay in store
  React.useEffect(() => {
    if (!essayText.trim() && issues.length === 0) {
      router.replace("/");
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

  // Handle "Back to editor" navigation:
  // Instead of resetting to 0, set activeIssueIndex to the first unresolved issue
  const handleBackToEditor = () => {
    const firstUnresolvedIndex = currentIssues.findIndex((i) => !i.resolved);
    const targetIndex = firstUnresolvedIndex !== -1 ? firstUnresolvedIndex : 0;
    setActiveIssueIndex(targetIndex);
    router.push("/editor");
  };

  const handleSeeProgress = () => {
    router.push("/progress");
  };

  if (!essayText.trim() && issues.length === 0) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-4">
        <p className="text-xs text-typography-muted">Redirecting to upload...</p>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-white flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 page-fade-in">
      <div className="max-w-[650px] w-full mx-auto space-y-8">
        {/* Main Centered Results Card */}
        <Card
          variant="default"
          className="rounded-2xl border border-border p-6 sm:p-10 shadow-soft space-y-8"
        >
          {/* Header & Dynamic Heading */}
          <div className="text-center space-y-3">
            <div className="flex justify-center">
              <span
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${content.badgeColor}`}
              >
                <Sparkles className={`w-3.5 h-3.5 ${content.iconColor}`} />
                {content.badge}
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-typography-heading">
              {content.heading}
            </h1>

            <p className="text-sm sm:text-base text-typography-body leading-relaxed max-w-md mx-auto">
              {content.subtitle}
            </p>
          </div>

          {/* Horizontal Progress Bar Section */}
          <div className="bg-surface-panel rounded-2xl p-5 sm:p-6 border border-border space-y-3.5">
            <div className="flex items-center justify-between text-sm">
              <span className="font-semibold text-typography-heading flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-primary" />
                Issue Resolution
              </span>
              <span className="font-bold text-typography-heading">
                {resolvedCount} of {totalCount} fixed
                <span className="text-xs font-normal text-typography-muted ml-1.5">
                  ({percentage}%)
                </span>
              </span>
            </div>

            {/* Track & Bar */}
            <div className="w-full bg-white border border-border rounded-full h-3.5 p-0.5 overflow-hidden shadow-inner">
              <div
                className="bg-primary h-full rounded-full transition-all duration-700 ease-out shadow-soft"
                style={{ width: `${Math.max(percentage, 4)}%` }}
              />
            </div>

            {/* Quick breakdown footer */}
            <div className="flex items-center justify-between text-xs text-typography-muted pt-1">
              <span>{totalCount - resolvedCount} issues remaining</span>
              <span>Target: 100% resolution</span>
            </div>
          </div>

          {/* Action Buttons: Secondary "Back to editor" + Primary "See my Progress" */}
          <div className="flex flex-col-reverse sm:flex-row items-center justify-center gap-3.5 pt-2">
            <Button
              variant="secondary"
              size="lg"
              onClick={handleBackToEditor}
              className="w-full sm:w-auto sm:min-w-[180px] shadow-soft py-3 font-semibold"
            >
              <ArrowLeft className="w-4 h-4 mr-1.5" />
              Back to editor
            </Button>

            <Button
              variant="primary"
              size="lg"
              onClick={handleSeeProgress}
              className="w-full sm:w-auto sm:min-w-[200px] shadow-elevation py-3 font-semibold"
            >
              See my Progress
              <ArrowRight className="w-4 h-4 ml-1.5" />
            </Button>
          </div>
        </Card>

        {/* Subtle footer reset link */}
        <div className="flex items-center justify-center gap-2 text-xs text-typography-muted">
          <span>Need to restart demo data?</span>
          <button
            type="button"
            onClick={resetToMockData}
            className="text-primary hover:underline font-medium inline-flex items-center gap-1"
          >
            <RotateCcw className="w-3 h-3" />
            Reset all issues
          </button>
        </div>
      </div>
    </div>
  );
}
