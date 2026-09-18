"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Sparkles,
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  RotateCcw,
  BookOpen,
  Edit3,
  Eye,
  X,
  Plus,
  ArrowDown,
  Info,
} from "lucide-react";
import { useAppStore, EssayIssue } from "@/lib/store";
import { MOCK_ISSUES, MOCK_ESSAY_TEXT } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { IconBadge } from "@/components/ui/icon-badge";
import { CircularProgress } from "@/components/circular-progress";
import { AssignmentModal } from "@/components/assignment-modal";

export default function EditorPage() {
  const router = useRouter();
  const {
    essayText,
    issues,
    activeIssueIndex,
    assignment,
    setEssayText,
    setIssues,
    setActiveIssueIndex,
    toggleIssueResolved,
    resetToMockData,
  } = useAppStore();

  const [isEditMode, setIsEditMode] = useState(false);
  const [showBanner, setShowBanner] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isRechecking, setIsRechecking] = useState(false);

  // Redirect to / if user lands on /editor with no essay text in the store
  useEffect(() => {
    if (!essayText.trim()) {
      router.replace("/");
    }
  }, [essayText, router]);

  // Current active issue safely clamped
  const currentIssues = issues.length > 0 ? issues : MOCK_ISSUES;
  const safeIndex = Math.min(
    Math.max(0, activeIssueIndex),
    currentIssues.length - 1
  );
  const activeIssue: EssayIssue = currentIssues[safeIndex] || currentIssues[0];

  // Completion calculation for circular progress
  const resolvedCount = currentIssues.filter((i) => i.resolved).length;
  const completionPercentage =
    currentIssues.length > 0
      ? Math.round((resolvedCount / currentIssues.length) * 100)
      : 0;

  const wordCount = essayText.trim()
    ? essayText.trim().split(/\s+/).filter(Boolean).length
    : 0;

  // Navigation between issues (clamped)
  const handlePrevIssue = () => {
    if (safeIndex > 0) {
      setActiveIssueIndex(safeIndex - 1);
    }
  };

  const handleNextIssue = () => {
    if (safeIndex < currentIssues.length - 1) {
      setActiveIssueIndex(safeIndex + 1);
    }
  };

  // Re-check action with subtle loading state
  const handleRecheck = () => {
    setIsRechecking(true);
    setTimeout(() => {
      setIsRechecking(false);
      router.push("/results");
    }, 1100);
  };

  // Compute text highlighting safely
  const renderedHighlightedText = useMemo(() => {
    if (!essayText) return null;
    if (!activeIssue || !activeIssue.span) {
      return (
        <div className="space-y-4 whitespace-pre-wrap leading-relaxed">
          {essayText}
        </div>
      );
    }

    const { start, end } = activeIssue.span;
    const clampedStart = Math.max(0, Math.min(start, essayText.length));
    const clampedEnd = Math.max(clampedStart, Math.min(end, essayText.length));

    const before = essayText.slice(0, clampedStart);
    const highlighted = essayText.slice(clampedStart, clampedEnd);
    const after = essayText.slice(clampedEnd);

    return (
      <div className="text-typography-heading text-sm sm:text-base leading-7 font-normal whitespace-pre-wrap select-text">
        <span>{before}</span>
        <mark
          className="bg-amber-100/90 text-amber-950 font-medium px-1 py-0.5 rounded border-b-2 border-accent transition-all duration-200 shadow-sm inline"
          title={`Active Issue: ${activeIssue.what}`}
        >
          {highlighted}
        </mark>
        <span>{after}</span>
      </div>
    );
  }, [essayText, activeIssue]);

  if (!essayText.trim()) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-4">
        <p className="text-xs text-typography-muted">Redirecting to upload...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white page-fade-in">
      {/* Top Header / Breadcrumb Bar */}
      <div className="border-b border-border bg-white px-4 sm:px-6 lg:px-8 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-medium text-typography-body hover:text-typography-heading transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Upload New Draft
          </Link>

          <div className="flex items-center gap-3">
            <Button
              variant="secondary"
              size="sm"
              onClick={resetToMockData}
              title="Reset state to mock essay and issues"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset Demo
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Dismissible Assignment Prompt Banner */}
        {showBanner && (
          <div className="relative rounded-2xl border border-primary/20 bg-primary-light/40 p-4 sm:px-6 sm:py-3.5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 transition-all duration-200">
            <div className="flex items-center gap-3">
              <IconBadge shape="circle" size="sm" className="bg-primary/10 text-primary">
                <Info className="w-4 h-4" />
              </IconBadge>
              <p className="text-xs sm:text-sm font-medium text-typography-heading">
                {assignment?.instructions ? (
                  <span>
                    Active Rubric: <strong className="font-semibold">{assignment.essayType}</strong> ({assignment.educationLevel})
                  </span>
                ) : (
                  "Add your assignment instructions for deeper feedback."
                )}
              </p>
            </div>

            <div className="flex items-center gap-2.5 self-end sm:self-auto">
              <button
                type="button"
                onClick={() => setIsModalOpen(true)}
                className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:text-primary-hover hover:underline transition-colors px-2 py-1 rounded-full bg-white border border-primary/20 shadow-soft"
              >
                <Plus className="w-3.5 h-3.5" />
                {assignment?.instructions ? "Edit prompt" : "Add prompt +"}
              </button>
              <button
                type="button"
                onClick={() => setShowBanner(false)}
                className="p-1 text-typography-muted hover:text-typography-heading transition-colors rounded-full hover:bg-white/80"
                title="Dismiss banner"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Core Workspace: Two-Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* ========================================================= */}
          {/* LEFT / MAIN COLUMN: Editable Text Area with Visual Highlight */}
          {/* ========================================================= */}
          <div className="lg:col-span-7 xl:col-span-8 space-y-4">
            <Card variant="default" className="shadow-soft">
              {/* Header inside Editor Card */}
              <CardHeader className="border-b border-border py-3.5 px-6 flex flex-row items-center justify-between space-y-0">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    <CardTitle className="text-base font-semibold">
                      Essay Manuscript
                    </CardTitle>
                    <span className="text-xs text-typography-muted">
                      ({wordCount} words)
                    </span>
                  </div>

                  {/* Mode switcher: Highlight vs Edit */}
                  <div className="hidden sm:flex items-center bg-surface-panel rounded-full p-0.5 border border-border">
                    <button
                      type="button"
                      onClick={() => setIsEditMode(false)}
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium transition-all ${
                        !isEditMode
                          ? "bg-white text-primary shadow-soft"
                          : "text-typography-body hover:text-typography-heading"
                      }`}
                    >
                      <Eye className="w-3.5 h-3.5" />
                      Highlighted View
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsEditMode(true)}
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium transition-all ${
                        isEditMode
                          ? "bg-white text-primary shadow-soft"
                          : "text-typography-body hover:text-typography-heading"
                      }`}
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      Direct Edit
                    </button>
                  </div>
                </div>

                {/* Top-Right Secondary Small Circular Progress Indicator */}
                <div className="flex items-center gap-2">
                  <span className="hidden sm:inline text-xs font-medium text-typography-muted">
                    Resolved
                  </span>
                  <CircularProgress percentage={completionPercentage} size={36} />
                </div>
              </CardHeader>

              {/* Editor / Text Content Area */}
              <CardContent className="p-6">
                {isEditMode ? (
                  <div className="space-y-3">
                    <textarea
                      value={essayText}
                      onChange={(e) => setEssayText(e.target.value)}
                      rows={16}
                      className="w-full rounded-xl border border-border p-4 text-typography-heading font-sans text-sm sm:text-base leading-relaxed focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all resize-y"
                      placeholder="Write or edit your essay draft here..."
                    />
                    <div className="flex justify-between items-center text-xs text-typography-muted">
                      <span>Editing mode active • Changes save to store instantly</span>
                      <button
                        type="button"
                        onClick={() => setIsEditMode(false)}
                        className="text-primary hover:underline font-semibold"
                      >
                        Return to Highlighted View
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="min-h-[380px] p-2 sm:p-3 bg-surface-panel/40 rounded-xl border border-border/60">
                    {renderedHighlightedText}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Quick helper note under editor */}
            <div className="flex items-center justify-between px-2 text-xs text-typography-muted">
              <span className="flex items-center gap-1.5">
                <span className="inline-block w-2.5 h-2.5 rounded-sm bg-amber-200 border border-accent"></span>
                Amber highlight marks flagged text for Issue #{safeIndex + 1}
              </span>
              <button
                type="button"
                onClick={() => setIsEditMode(!isEditMode)}
                className="text-primary hover:underline font-medium sm:hidden"
              >
                {isEditMode ? "Switch to Highlight View" : "Switch to Edit Mode"}
              </button>
            </div>
          </div>

          {/* ========================================================= */}
          {/* RIGHT / SIDE COLUMN: The "Suggestion Card" & Action Flow  */}
          {/* ========================================================= */}
          <div className="lg:col-span-5 xl:col-span-4 space-y-4">
            {/* The Unified Suggestion Card */}
            <Card variant="default" className="shadow-soft border-border overflow-hidden">
              {/* Card Header: Category & Counter */}
              <div className="px-6 py-4 border-b border-border bg-surface-panel flex items-center justify-between">
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-primary">
                    {activeIssue?.category || "Diagnostic Finding"}
                  </span>
                  <p className="text-xs text-typography-muted">
                    Issue {safeIndex + 1} of {currentIssues.length}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => toggleIssueResolved(activeIssue.id)}
                  className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold transition-colors border ${
                    activeIssue.resolved
                      ? "bg-emerald-50 text-emerald-700 border-emerald-300 hover:bg-emerald-100"
                      : "bg-white text-typography-body border-border hover:text-typography-heading hover:bg-surface-panel"
                  }`}
                >
                  <CheckCircle2
                    className={`w-3.5 h-3.5 ${
                      activeIssue.resolved ? "text-emerald-600" : "text-typography-muted"
                    }`}
                  />
                  {activeIssue.resolved ? "Resolved" : "Mark Resolved"}
                </button>
              </div>

              {/* Connected Three-Section Flow: What -> Why -> How */}
              <div className="p-6 space-y-4 relative">
                {/* Vertical flowline/connector */}
                <div
                  className="absolute left-[38px] top-[42px] bottom-[50px] w-[2px] bg-border border-l-2 border-dashed border-primary/30 pointer-events-none"
                  aria-hidden="true"
                />

                {/* 1. "WHAT" Block */}
                <div className="relative flex items-start gap-3.5">
                  <div className="w-6 h-6 rounded-full bg-amber-100 text-amber-700 border border-amber-300 flex items-center justify-center text-xs font-bold flex-shrink-0 z-10 shadow-soft">
                    1
                  </div>
                  <div className="flex-1 bg-surface-panel rounded-xl p-3.5 border border-border/80 shadow-soft">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-typography-muted block mb-1">
                      What
                    </span>
                    <p className="text-sm font-semibold text-typography-heading leading-snug">
                      {activeIssue?.what}
                    </p>
                  </div>
                </div>

                {/* 2. "WHY" Block */}
                <div className="relative flex items-start gap-3.5">
                  <div className="w-6 h-6 rounded-full bg-primary-light text-primary border border-primary/20 flex items-center justify-center text-xs font-bold flex-shrink-0 z-10 shadow-soft">
                    2
                  </div>
                  <div className="flex-1 bg-surface-panel rounded-xl p-3.5 border border-border/80 shadow-soft">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-typography-muted block mb-1">
                      Why It Matters
                    </span>
                    <p className="text-xs sm:text-sm text-typography-body leading-relaxed">
                      {activeIssue?.why}
                    </p>
                  </div>
                </div>

                {/* 3. "HOW" Block */}
                <div className="relative flex items-start gap-3.5">
                  <div className="w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center text-xs font-bold flex-shrink-0 z-10 shadow-elevation">
                    3
                  </div>
                  <div className="flex-1 bg-primary-light/40 border border-primary/30 rounded-xl p-3.5 shadow-soft">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-primary flex items-center gap-1 mb-1">
                      <Sparkles className="w-3 h-3" />
                      How to Fix It
                    </span>
                    <p className="text-xs sm:text-sm text-typography-heading leading-relaxed font-normal">
                      {activeIssue?.how}
                    </p>
                  </div>
                </div>
              </div>

              {/* Navigation Controls: Previous / Next buttons */}
              <div className="px-6 py-3.5 border-t border-border bg-white flex items-center justify-between">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={handlePrevIssue}
                  disabled={safeIndex === 0}
                  className="px-3 py-1.5"
                >
                  <ChevronLeft className="w-4 h-4 mr-0.5" />
                  Previous
                </Button>

                {/* Issue dots */}
                <div className="flex items-center gap-1.5">
                  {currentIssues.map((issue, idx) => (
                    <button
                      key={issue.id}
                      type="button"
                      onClick={() => setActiveIssueIndex(idx)}
                      title={`Jump to issue ${idx + 1}`}
                      className={`h-2 rounded-full transition-all ${
                        safeIndex === idx
                          ? "w-5 bg-primary"
                          : issue.resolved
                          ? "w-2 bg-emerald-500"
                          : "w-2 bg-border hover:bg-typography-muted"
                      }`}
                    />
                  ))}
                </div>

                <Button
                  variant="secondary"
                  size="sm"
                  onClick={handleNextIssue}
                  disabled={safeIndex === currentIssues.length - 1}
                  className="px-3 py-1.5"
                >
                  Next
                  <ChevronRight className="w-4 h-4 ml-0.5" />
                </Button>
              </div>

              {/* Bottom Re-check Primary CTA */}
              <div className="p-4 border-t border-border bg-surface-panel/60">
                <Button
                  variant="primary"
                  size="md"
                  onClick={handleRecheck}
                  isLoading={isRechecking}
                  className="w-full shadow-elevation font-semibold"
                >
                  {isRechecking ? (
                    "Re-evaluating draft..."
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 mr-2" />
                      Check my Essay
                    </>
                  )}
                </Button>
                <p className="text-[11px] text-center text-typography-muted mt-2">
                  Re-analyzes manuscript & updates diagnostic score
                </p>
              </div>
            </Card>
          </div>
        </div>
      </div>

      {/* Assignment Instructions Modal */}
      <AssignmentModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}
