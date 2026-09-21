"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Edit3,
  Eye,
  Check,
} from "lucide-react";
import { useAppStore, EssayIssue } from "@/lib/store";
import { MOCK_ISSUES } from "@/lib/mock-data";
import { ROUTES } from "@/lib/routes";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { AssignmentModal } from "@/components/assignment-modal";
import { StepTracker } from "@/components/step-tracker";

export default function EditorPage() {
  const router = useRouter();
  const {
    essayText,
    issues,
    activeIssueIndex,
    assignment,
    setEssayText,
    setActiveIssueIndex,
    toggleIssueResolved,
  } = useAppStore();

  const [isEditMode, setIsEditMode] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isRechecking, setIsRechecking] = useState(false);
  const [isWhyFixExpanded, setIsWhyFixExpanded] = useState(true);

  // Popover state for inline span interaction
  const [hoveredIssueId, setHoveredIssueId] = useState<string | null>(null);

  // Redirect to home if user lands on /editor with no essay text in store
  useEffect(() => {
    if (!essayText.trim()) {
      router.replace(ROUTES.home);
    }
  }, [essayText, router]);

  // Current issues safely clamped
  const currentIssues = issues.length > 0 ? issues : MOCK_ISSUES;
  const safeIndex = Math.min(
    Math.max(0, activeIssueIndex),
    currentIssues.length - 1
  );
  const activeIssue: EssayIssue = currentIssues[safeIndex] || currentIssues[0];

  const resolvedCount = currentIssues.filter((i) => i.resolved).length;
  const completionPercentage =
    currentIssues.length > 0
      ? Math.round((resolvedCount / currentIssues.length) * 100)
      : 0;

  const wordCount = essayText.trim()
    ? essayText.trim().split(/\s+/).filter(Boolean).length
    : 0;

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

  const handleRecheck = () => {
    setIsRechecking(true);
    setTimeout(() => {
      setIsRechecking(false);
      router.push(ROUTES.results);
    }, 1000);
  };

  // Build segmented highlighted text: all unresolved issues have Grammarly-style underlines
  const renderedHighlightedText = useMemo(() => {
    if (!essayText) return null;

    // Filter issues with valid spans and sort by start
    const sortedIssues = [...currentIssues]
      .map((issue, originalIndex) => ({ issue, originalIndex }))
      .filter(
        ({ issue }) =>
          issue.span &&
          issue.span.start >= 0 &&
          issue.span.end <= essayText.length &&
          issue.span.start < issue.span.end
      )
      .sort((a, b) => a.issue.span.start - b.issue.span.start);

    if (sortedIssues.length === 0) {
      return (
        <div className="whitespace-pre-wrap leading-relaxed text-typography-heading text-sm sm:text-base">
          {essayText}
        </div>
      );
    }

    const elements: React.ReactNode[] = [];
    let lastIndex = 0;

    sortedIssues.forEach(({ issue, originalIndex }) => {
      const { start, end } = issue.span;

      // Add unflagged text before this span
      if (start > lastIndex) {
        elements.push(
          <span key={`text-${lastIndex}-${start}`}>
            {essayText.slice(lastIndex, start)}
          </span>
        );
      }

      const isCurrentActive = originalIndex === safeIndex;
      const isHovered = hoveredIssueId === issue.id;
      const isResolved = issue.resolved;

      elements.push(
        <span
          key={`span-${issue.id}`}
          className="relative inline"
          onMouseEnter={() => setHoveredIssueId(issue.id)}
          onMouseLeave={() => setHoveredIssueId(null)}
        >
          <span
            onClick={() => setActiveIssueIndex(originalIndex)}
            className={`cursor-pointer transition-all duration-150 ${
              isResolved
                ? "text-typography-body opacity-80"
                : isCurrentActive
                ? "underline decoration-amber-500 decoration-2 underline-offset-4 bg-amber-100/40 text-typography-heading font-medium px-0.5 rounded-sm"
                : "underline decoration-amber-400 decoration-2 underline-offset-4 hover:bg-amber-50/60 text-typography-heading px-0.5 rounded-sm"
            }`}
            role="button"
            tabIndex={0}
            aria-label={`Flagged issue: ${issue.category}. ${issue.what}`}
          >
            {essayText.slice(start, end)}
          </span>

          {/* Inline Popover on Hover or Click */}
          {isHovered && (
            <span
              className="absolute left-0 bottom-full mb-2 z-30 w-72 p-3 bg-white border border-border rounded-xl shadow-soft-lg text-xs leading-normal pointer-events-auto block animate-in fade-in duration-100"
              onClick={(e) => e.stopPropagation()}
            >
              <span className="flex items-center justify-between pb-1.5 border-b border-border/70 mb-1.5">
                <span className="font-semibold text-typography-heading text-[11px] uppercase tracking-wider text-amber-700">
                  {issue.category}
                </span>
                <span className="text-[10px] text-typography-muted">
                  Issue {originalIndex + 1} of {currentIssues.length}
                </span>
              </span>

              <span className="block text-typography-heading font-medium mb-2.5">
                {issue.what}
              </span>

              <span className="flex items-center justify-between pt-1 border-t border-border/50 text-[11px]">
                <button
                  type="button"
                  onClick={() => toggleIssueResolved(issue.id)}
                  className="font-medium text-primary hover:underline"
                >
                  {issue.resolved ? "Mark unresolved" : "Mark resolved"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setActiveIssueIndex(originalIndex);
                    setIsWhyFixExpanded(true);
                  }}
                  className="text-typography-muted hover:text-typography-heading font-medium"
                >
                  View suggestion →
                </button>
              </span>
            </span>
          )}
        </span>
      );

      lastIndex = end;
    });

    // Add remaining text after last span
    if (lastIndex < essayText.length) {
      elements.push(
        <span key={`text-tail`}>{essayText.slice(lastIndex)}</span>
      );
    }

    return (
      <div className="text-typography-heading text-sm sm:text-base leading-7 font-normal whitespace-pre-wrap select-text">
        {elements}
      </div>
    );
  }, [essayText, currentIssues, safeIndex, hoveredIssueId, setActiveIssueIndex, toggleIssueResolved]);

  if (!essayText.trim()) {
    return (
      <div className="min-h-[300px] flex items-center justify-center p-4">
        <p className="text-xs text-typography-muted">Loading draft...</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-5xl mx-auto space-y-5 page-fade-in">
      {/* 1. Dashboard Pathway Step Tracker */}
      <StepTracker currentStep={2} />

      {/* 2. Compact Rubric / Assignment Context Bar (No AI slop or puffy banner) */}
      <div className="flex items-center justify-between py-2 px-3.5 rounded-xl bg-surface-panel border border-border text-xs">
        <div className="flex items-center gap-2 truncate text-typography-muted">
          {assignment?.instructions ? (
            <span className="truncate">
              <strong className="font-semibold text-typography-heading">
                {assignment.essayType || "Argumentative Essay"} ·{" "}
                {assignment.educationLevel || "Undergrad Y2"}
              </strong>
              : &ldquo;{assignment.instructions}&rdquo;
            </span>
          ) : (
            <span>No assignment prompt attached.</span>
          )}
        </div>

        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="text-xs font-semibold text-primary hover:underline ml-3 flex-shrink-0"
        >
          {assignment?.instructions ? "Edit prompt" : "+ Add prompt"}
        </button>
      </div>

      {/* 3. Core Two-Column Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT COLUMN: Essay Text Area with Legible Underline Highlighting */}
        <div className="lg:col-span-7 xl:col-span-8 space-y-2">
          <Card variant="default" className="shadow-soft bg-white border-border">
            {/* Header: Title, word count, view mode switcher, and plain text progress */}
            <CardHeader className="border-b border-border py-3 px-5 sm:px-6 flex flex-row items-center justify-between space-y-0">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <CardTitle className="text-sm sm:text-base font-semibold">
                    Essay Manuscript
                  </CardTitle>
                  <span className="text-xs text-typography-muted">
                    ({wordCount} words)
                  </span>
                </div>

                {/* View switcher */}
                <div className="hidden sm:flex items-center bg-surface-panel rounded-lg p-0.5 border border-border text-xs">
                  <button
                    type="button"
                    onClick={() => setIsEditMode(false)}
                    className={`inline-flex items-center gap-1 px-2.5 py-1 rounded text-xs transition-all ${
                      !isEditMode
                        ? "bg-white text-typography-heading font-medium shadow-soft"
                        : "text-typography-muted hover:text-typography-heading"
                    }`}
                  >
                    <Eye className="w-3.5 h-3.5" />
                    Highlighted
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsEditMode(true)}
                    className={`inline-flex items-center gap-1 px-2.5 py-1 rounded text-xs transition-all ${
                      isEditMode
                        ? "bg-white text-typography-heading font-medium shadow-soft"
                        : "text-typography-muted hover:text-typography-heading"
                    }`}
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    Edit
                  </button>
                </div>
              </div>

              {/* Plain text progress count (No puffy badge/pill) */}
              <div className="text-xs text-typography-muted font-medium">
                <span className="text-typography-heading font-semibold">
                  {resolvedCount} of {currentIssues.length}
                </span>{" "}
                resolved ({completionPercentage}%)
              </div>
            </CardHeader>

            {/* Text View / Edit Area */}
            <CardContent className="p-5 sm:p-6">
              {isEditMode ? (
                <div className="space-y-2">
                  <textarea
                    value={essayText}
                    onChange={(e) => setEssayText(e.target.value)}
                    rows={16}
                    className="w-full rounded-xl border border-border p-4 text-typography-heading font-sans text-sm sm:text-base leading-relaxed focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all resize-y"
                    placeholder="Write or edit your essay draft here..."
                  />
                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={() => setIsEditMode(false)}
                      className="text-xs text-primary hover:underline font-semibold"
                    >
                      Return to Highlighted View
                    </button>
                  </div>
                </div>
              ) : (
                <div className="min-h-[380px] p-2 sm:p-3 bg-white rounded-xl">
                  {renderedHighlightedText}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* RIGHT COLUMN: Grammarly-style Suggestion Card */}
        <div className="lg:col-span-5 xl:col-span-4 space-y-4">
          <Card variant="default" className="shadow-soft border-border bg-white overflow-hidden">
            {/* Header: Title, counter, and plain button for Mark Resolved */}
            <div className="px-5 py-3.5 border-b border-border bg-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-typography-heading">
                  {activeIssue?.category}
                </span>
                <span className="text-xs text-typography-muted">
                  · {safeIndex + 1} of {currentIssues.length}
                </span>
              </div>

              {/* Plain button without pill/badge treatment */}
              <button
                type="button"
                onClick={() => toggleIssueResolved(activeIssue.id)}
                className={`text-xs font-medium px-2.5 py-1 rounded border transition-colors flex items-center gap-1 ${
                  activeIssue.resolved
                    ? "border-emerald-300 text-emerald-700 bg-emerald-50 hover:bg-emerald-100"
                    : "border-border text-typography-body hover:bg-surface-panel hover:text-typography-heading"
                }`}
              >
                {activeIssue.resolved && <Check className="w-3 h-3 text-emerald-600" />}
                {activeIssue.resolved ? "Resolved" : "Mark Resolved"}
              </button>
            </div>

            {/* Body: One-line problem statement + expandable why/fix */}
            <div className="p-5 space-y-4">
              {/* Default one-line summary (max 10-12 words) */}
              <div>
                <p className="text-sm font-semibold text-typography-heading leading-snug">
                  {activeIssue?.what}
                </p>
              </div>

              {/* Compact Expandable Why & Fix */}
              <div className="border border-border/80 rounded-xl overflow-hidden bg-surface-panel/40">
                <button
                  type="button"
                  onClick={() => setIsWhyFixExpanded(!isWhyFixExpanded)}
                  className="w-full px-3.5 py-2.5 flex items-center justify-between text-xs font-medium text-typography-body hover:text-typography-heading hover:bg-surface-panel transition-colors"
                >
                  <span className="font-semibold text-primary">
                    {isWhyFixExpanded ? "Hide explanation & fix" : "Explanation & suggested fix"}
                  </span>
                  <ChevronDown
                    className={`w-3.5 h-3.5 transition-transform duration-200 ${
                      isWhyFixExpanded ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {isWhyFixExpanded && (
                  <div className="px-3.5 pb-3.5 pt-1 space-y-2.5 text-xs border-t border-border/60 bg-white">
                    <div>
                      <span className="font-semibold text-typography-muted block mb-0.5 text-[11px] uppercase tracking-wider">
                        Why it matters
                      </span>
                      <p className="text-typography-body leading-relaxed">
                        {activeIssue?.why}
                      </p>
                    </div>

                    <div>
                      <span className="font-semibold text-primary block mb-0.5 text-[11px] uppercase tracking-wider">
                        Suggested fix
                      </span>
                      <p className="text-typography-heading leading-relaxed font-medium">
                        {activeIssue?.how}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Navigation Controls: Clean Prev / Next buttons */}
            <div className="px-5 py-3 border-t border-border bg-white flex items-center justify-between text-xs">
              <button
                type="button"
                onClick={handlePrevIssue}
                disabled={safeIndex === 0}
                className="text-typography-body hover:text-typography-heading disabled:opacity-30 disabled:cursor-not-allowed font-medium flex items-center gap-0.5"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
                Previous
              </button>

              <div className="flex items-center gap-1.5">
                {currentIssues.map((issue, idx) => (
                  <button
                    key={issue.id}
                    type="button"
                    onClick={() => setActiveIssueIndex(idx)}
                    title={`Issue ${idx + 1}: ${issue.category}`}
                    className={`h-1.5 rounded-full transition-all ${
                      safeIndex === idx
                        ? "w-4 bg-primary"
                        : issue.resolved
                        ? "w-1.5 bg-emerald-500"
                        : "w-1.5 bg-border hover:bg-typography-muted"
                    }`}
                  />
                ))}
              </div>

              <button
                type="button"
                onClick={handleNextIssue}
                disabled={safeIndex === currentIssues.length - 1}
                className="text-typography-body hover:text-typography-heading disabled:opacity-30 disabled:cursor-not-allowed font-medium flex items-center gap-0.5"
              >
                Next
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Bottom Action: No sentence yapping! */}
            <div className="p-4 border-t border-border bg-surface-panel/40">
              <Button
                variant="primary"
                size="md"
                onClick={handleRecheck}
                isLoading={isRechecking}
                className="w-full font-semibold"
              >
                {isRechecking ? "Checking..." : "Re-check essay"}
              </Button>
            </div>
          </Card>
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
