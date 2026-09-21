"use client";

import React, { useState, useRef, ChangeEvent, DragEvent, useEffect } from "react";
import { useRouter } from "next/navigation";
import { UploadCloud, FileText, X, ChevronDown, ChevronUp } from "lucide-react";
import { useAppStore } from "@/lib/store";
import { MOCK_ISSUES, MOCK_ESSAY_TEXT } from "@/lib/mock-data";
import { ROUTES } from "@/lib/routes";
import { Button } from "@/components/ui/button";
import { StepTracker } from "@/components/step-tracker";

export default function UploadPage() {
  const router = useRouter();
  const {
    essayText,
    setEssayText,
    setIssues,
    setActiveIssueIndex,
    assignment,
    setAssignment,
  } = useAppStore();

  const [isDragging, setIsDragging] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Assignment prompt optional section state
  const [showPromptSection, setShowPromptSection] = useState(false);
  const [instructions, setInstructions] = useState("");
  const [essayType, setEssayType] = useState("Argumentative Essay");
  const [educationLevel, setEducationLevel] = useState("Undergrad Y2");

  useEffect(() => {
    if (assignment) {
      setInstructions(assignment.instructions || "");
      if (assignment.essayType) setEssayType(assignment.essayType);
      if (assignment.educationLevel) setEducationLevel(assignment.educationLevel);
    }
  }, [assignment]);

  const wordCount = essayText.trim()
    ? essayText.trim().split(/\s+/).filter(Boolean).length
    : 0;

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    await processUploadedFile(file);
  };

  const processUploadedFile = async (file: File) => {
    setFileName(file.name);
    try {
      if (file.name.endsWith(".txt") || file.name.endsWith(".md")) {
        const text = await file.text();
        setEssayText(text);
      } else {
        const raw = await file.text();
        if (raw && !raw.includes("\u0000")) {
          setEssayText(raw);
        } else {
          setEssayText(MOCK_ESSAY_TEXT);
        }
      }
    } catch (err) {
      console.error("Error reading file:", err);
      setEssayText(MOCK_ESSAY_TEXT);
    }
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = async (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      await processUploadedFile(file);
      return;
    }

    const droppedText = e.dataTransfer.getData("text");
    if (droppedText) {
      setEssayText(droppedText);
      setFileName(null);
    }
  };

  const handleTriggerUpload = () => {
    fileInputRef.current?.click();
  };

  const handleClearText = () => {
    setEssayText("");
    setFileName(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleLoadSample = () => {
    setEssayText(MOCK_ESSAY_TEXT);
    setFileName("Sample_Undergrad_Essay.txt");
  };

  const handleSavePrompt = () => {
    if (instructions.trim()) {
      setAssignment({
        instructions: instructions.trim(),
        essayType,
        educationLevel,
      });
    }
  };

  const handleAnalyzeEssay = async () => {
    if (!essayText.trim()) return;

    // Save prompt if user typed into it
    if (instructions.trim()) {
      setAssignment({
        instructions: instructions.trim(),
        essayType,
        educationLevel,
      });
    }

    setIsAnalyzing(true);

    setTimeout(() => {
      setIssues(MOCK_ISSUES);
      setActiveIssueIndex(0);
      setIsAnalyzing(false);
      router.push(ROUTES.editor);
    }, 1100);
  };

  const isTextEmpty = !essayText.trim();

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6 page-fade-in">
      {/* 1. Dashboard Pathway Step Tracker */}
      <StepTracker currentStep={1} />

      {/* 2. Main Upload Card */}
      <div className="rounded-2xl border border-border bg-white p-6 sm:p-8 shadow-soft space-y-6">
        {/* Header */}
        <div className="space-y-1">
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-typography-heading">
            Check your essay
          </h2>
          <p className="text-sm text-typography-muted">
            Paste or upload your draft below for feedback.
          </p>
        </div>

        {/* Upload & Drop Zone Box */}
        <div className="space-y-4">
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`relative rounded-2xl border-2 border-dashed transition-all duration-200 bg-surface-panel p-6 sm:p-8 ${
              isDragging
                ? "border-primary bg-primary-light/20"
                : "border-border hover:border-border/80 focus-within:border-primary/60"
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".txt,.docx,.doc,.pdf,.md,.rtf"
              onChange={handleFileChange}
              className="hidden"
            />

            {isTextEmpty ? (
              <div className="flex flex-col items-center justify-center text-center py-4 space-y-3">
                <div className="w-10 h-10 rounded-full bg-white border border-border flex items-center justify-center text-primary shadow-soft">
                  <UploadCloud className="w-5 h-5" />
                </div>

                <div className="space-y-1">
                  <p className="text-sm font-semibold text-typography-heading">
                    Drag and drop your file here, or{" "}
                    <button
                      type="button"
                      onClick={handleTriggerUpload}
                      className="text-primary hover:underline font-semibold"
                    >
                      browse
                    </button>
                  </p>
                  <p className="text-xs text-typography-muted">
                    Supports .txt, .docx, .pdf, or paste directly below
                  </p>
                </div>

                <div className="w-full pt-2">
                  <textarea
                    value={essayText}
                    onChange={(e) => setEssayText(e.target.value)}
                    placeholder="Or paste essay text directly here..."
                    rows={5}
                    className="w-full rounded-xl border border-border bg-white p-3.5 text-sm text-typography-heading placeholder:text-typography-muted/70 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all resize-y"
                  />
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-border/80 text-xs text-typography-muted">
                  <div className="flex items-center gap-2 font-medium text-typography-heading">
                    <FileText className="w-4 h-4 text-primary" />
                    <span>{fileName || "Direct Text Draft"}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={handleTriggerUpload}
                      className="text-primary hover:underline font-medium"
                    >
                      Replace
                    </button>
                    <span>•</span>
                    <button
                      type="button"
                      onClick={handleClearText}
                      className="text-typography-muted hover:text-red-600 transition-colors flex items-center gap-1"
                    >
                      <X className="w-3.5 h-3.5" />
                      Clear
                    </button>
                  </div>
                </div>

                <textarea
                  value={essayText}
                  onChange={(e) => setEssayText(e.target.value)}
                  rows={10}
                  className="w-full rounded-xl border border-border bg-white p-4 text-sm sm:text-base leading-relaxed text-typography-heading focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all resize-y"
                  placeholder="Paste or write your essay here..."
                />

                <div className="flex items-center justify-between text-xs text-typography-muted pt-1">
                  <span>{wordCount} words · {essayText.length} characters</span>
                  <button
                    type="button"
                    onClick={handleClearText}
                    className="hover:underline text-typography-muted"
                  >
                    Clear text
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Sample essay helper */}
          <div className="flex items-center justify-between px-1 text-xs text-typography-muted">
            <span>Need an example?</span>
            <button
              type="button"
              onClick={handleLoadSample}
              className="text-primary font-medium hover:underline"
            >
              Load sample argumentative essay
            </button>
          </div>
        </div>

        {/* 3. Surface Assignment Prompt Option Earlier (Low-friction, optional) */}
        <div className="rounded-xl border border-border bg-surface-panel/60 p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-typography-heading">
                Assignment prompt
              </span>
              <span className="text-[11px] text-typography-muted">
                (optional)
              </span>
            </div>

            <button
              type="button"
              onClick={() => setShowPromptSection(!showPromptSection)}
              className="text-xs font-medium text-primary hover:underline flex items-center gap-1"
            >
              {showPromptSection ? (
                <>
                  <span>Hide</span>
                  <ChevronUp className="w-3 h-3" />
                </>
              ) : instructions.trim() ? (
                <>
                  <span>Edit prompt</span>
                  <ChevronDown className="w-3 h-3" />
                </>
              ) : (
                <>
                  <span>+ Add assignment prompt</span>
                  <ChevronDown className="w-3 h-3" />
                </>
              )}
            </button>
          </div>

          {/* Compact 1-line display when collapsed and prompt is populated */}
          {!showPromptSection && instructions.trim() && (
            <p className="text-xs text-typography-body truncate">
              <span className="font-semibold text-typography-heading">
                {essayType} · {educationLevel}:
              </span>{" "}
              &ldquo;{instructions}&rdquo;
            </p>
          )}

          {/* Expanded Prompt Inputs */}
          {showPromptSection && (
            <div className="space-y-3 pt-1 border-t border-border/70">
              <div>
                <label className="block text-[11px] font-semibold text-typography-muted mb-1">
                  Assignment instructions / prompt
                </label>
                <textarea
                  rows={3}
                  value={instructions}
                  onChange={(e) => {
                    setInstructions(e.target.value);
                    handleSavePrompt();
                  }}
                  onBlur={handleSavePrompt}
                  placeholder="Paste teacher instructions, prompt, or rubric guidelines..."
                  className="w-full rounded-lg border border-border bg-white p-3 text-xs sm:text-sm text-typography-heading placeholder:text-typography-muted/70 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-typography-muted mb-1">
                    Essay Type
                  </label>
                  <select
                    value={essayType}
                    onChange={(e) => {
                      setEssayType(e.target.value);
                      setAssignment({
                        instructions: instructions.trim(),
                        essayType: e.target.value,
                        educationLevel,
                      });
                    }}
                    className="w-full rounded-lg border border-border bg-white px-3 py-2 text-xs font-medium text-typography-heading focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent cursor-pointer"
                  >
                    <option value="Argumentative Essay">Argumentative Essay</option>
                    <option value="Narrative Essay">Narrative Essay</option>
                    <option value="Expository Essay">Expository Essay</option>
                    <option value="Persuasive Essay">Persuasive Essay</option>
                    <option value="Descriptive Essay">Descriptive Essay</option>
                    <option value="Compare & Contrast">Compare &amp; Contrast</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-typography-muted mb-1">
                    Education Level
                  </label>
                  <select
                    value={educationLevel}
                    onChange={(e) => {
                      setEducationLevel(e.target.value);
                      setAssignment({
                        instructions: instructions.trim(),
                        essayType,
                        educationLevel: e.target.value,
                      });
                    }}
                    className="w-full rounded-lg border border-border bg-white px-3 py-2 text-xs font-medium text-typography-heading focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent cursor-pointer"
                  >
                    <option value="Middle School">Middle School</option>
                    <option value="High School">High School</option>
                    <option value="Undergrad Y2">Undergrad Y2</option>
                    <option value="Undergraduate">Undergraduate</option>
                    <option value="Graduate">Graduate</option>
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Action Button: Clean, no self-narrating yapping */}
        <div className="pt-2">
          <Button
            variant="primary"
            size="lg"
            disabled={isTextEmpty}
            isLoading={isAnalyzing}
            onClick={handleAnalyzeEssay}
            className="w-full sm:w-auto sm:min-w-[200px] font-semibold"
          >
            {isAnalyzing ? "Checking..." : "Check essay"}
          </Button>
        </div>
      </div>
    </div>
  );
}
