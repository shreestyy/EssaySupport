"use client";

import React, { useState, useRef, ChangeEvent, DragEvent } from "react";
import { useRouter } from "next/navigation";
import {
  UploadCloud,
  FileText,
  Sparkles,
  CheckCircle2,
  X,
  FileCode,
  ArrowRight,
  ShieldCheck,
  BookOpen,
} from "lucide-react";
import { useAppStore } from "@/lib/store";
import { MOCK_ISSUES, MOCK_ESSAY_TEXT } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import { IconBadge } from "@/components/ui/icon-badge";

export default function UploadPage() {
  const router = useRouter();
  const { essayText, setEssayText, setIssues, setActiveIssueIndex } =
    useAppStore();

  const [isDragging, setIsDragging] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const wordCount = essayText.trim()
    ? essayText.trim().split(/\s+/).filter(Boolean).length
    : 0;

  // Handle file selection from hidden file input
  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    await processUploadedFile(file);
  };

  // Handle file or text processing
  const processUploadedFile = async (file: File) => {
    setFileName(file.name);
    try {
      if (file.name.endsWith(".txt") || file.name.endsWith(".md")) {
        const text = await file.text();
        setEssayText(text);
      } else {
        // For docx/pdf or other files without a heavy binary parser on client:
        // Attempt text extraction or load realistic sample text with document context
        const raw = await file.text();
        // If it looks like plain text or markdown
        if (raw && !raw.includes("\u0000")) {
          setEssayText(raw);
        } else {
          // Binary docx/pdf fallback for demo: populate with academic draft
          setEssayText(MOCK_ESSAY_TEXT);
        }
      }
    } catch (err) {
      console.error("Error reading file:", err);
      setEssayText(MOCK_ESSAY_TEXT);
    }
  };

  // Drag and drop handlers
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

    // Check for files first
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      await processUploadedFile(file);
      return;
    }

    // Check for raw text dropped
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
    setFileName("Sample_Undergraduate_Essay.txt");
  };

  // Mock analysis trigger
  const handleAnalyzeEssay = async () => {
    if (!essayText.trim()) return;

    setIsAnalyzing(true);

    // Simulate AI diagnostic analysis latency
    setTimeout(() => {
      // Populate issues in Zustand store
      setIssues(MOCK_ISSUES);
      setActiveIssueIndex(0);
      setIsAnalyzing(false);
      router.push("/editor");
    }, 1200);
  };

  const isTextEmpty = !essayText.trim();

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-white flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 page-fade-in">
      <div className="max-w-[700px] w-full mx-auto space-y-8">
        {/* Header section */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-light text-primary text-xs font-semibold shadow-soft">
            <Sparkles className="w-3.5 h-3.5" />
            MyThorneAI Diagnostic Suite
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-typography-heading">
            Check your essay
          </h1>
          <p className="text-sm sm:text-base text-typography-body max-w-lg mx-auto leading-relaxed">
            Upload your draft or paste your text below for instant diagnostic
            critique, thesis evaluation, and rubric-aligned insights.
          </p>
        </div>

        {/* Upload & Drop Zone Card */}
        <div className="space-y-4">
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`relative rounded-2xl border-2 border-dashed transition-all duration-200 bg-surface-panel p-6 sm:p-8 ${
              isDragging
                ? "border-primary bg-primary-light/20 scale-[1.008]"
                : "border-border hover:border-border/80 focus-within:border-primary/60 focus-within:ring-4 focus-within:ring-primary/5"
            }`}
          >
            {/* Hidden native file input */}
            <input
              ref={fileInputRef}
              type="file"
              accept=".txt,.docx,.doc,.pdf,.md,.rtf"
              onChange={handleFileChange}
              className="hidden"
            />

            {/* If no essay text is present, show the upload prompt with active overlay textarea */}
            {isTextEmpty ? (
              <div className="flex flex-col items-center justify-center text-center py-8 space-y-4">
                <IconBadge shape="square" size="lg" className="shadow-soft">
                  <UploadCloud className="w-6 h-6" />
                </IconBadge>

                <div className="space-y-1.5">
                  <p className="text-base font-semibold text-typography-heading">
                    Paste or upload your essay
                  </p>
                  <p className="text-xs sm:text-sm text-typography-body">
                    Drag and drop your file here, or{" "}
                    <button
                      type="button"
                      onClick={handleTriggerUpload}
                      className="text-primary font-semibold hover:underline focus:outline-none focus:ring-1 focus:ring-primary rounded"
                    >
                      Upload a file
                    </button>
                  </p>
                </div>

                <div className="flex items-center gap-2 pt-2 text-[11px] text-typography-muted">
                  <span className="px-2.5 py-1 rounded-full bg-white border border-border">
                    .TXT
                  </span>
                  <span className="px-2.5 py-1 rounded-full bg-white border border-border">
                    .DOCX
                  </span>
                  <span className="px-2.5 py-1 rounded-full bg-white border border-border">
                    .PDF
                  </span>
                  <span className="px-2.5 py-1 rounded-full bg-white border border-border">
                    Direct Paste
                  </span>
                </div>

                {/* Direct typing / paste textarea overlay inside the drop zone */}
                <div className="w-full pt-4">
                  <div className="relative">
                    <textarea
                      value={essayText}
                      onChange={(e) => setEssayText(e.target.value)}
                      placeholder="Or click here to start typing or paste your essay text directly..."
                      rows={4}
                      className="w-full rounded-xl border border-border bg-white p-3.5 text-sm text-typography-heading placeholder:text-typography-muted/70 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all resize-y"
                    />
                  </div>
                </div>
              </div>
            ) : (
              /* When text is present, display active editable textarea with toolbar */
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
                      Replace file
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
                  <span>Draft saved locally in store</span>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-typography-heading">
                      {wordCount}
                    </span>{" "}
                    words • {essayText.length} characters
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Sample essay helper link */}
          <div className="flex items-center justify-between px-1 text-xs text-typography-muted">
            <span>Need an example to try?</span>
            <button
              type="button"
              onClick={handleLoadSample}
              className="text-primary font-medium hover:underline flex items-center gap-1"
            >
              <Sparkles className="w-3.5 h-3.5" />
              Load sample argumentative essay
            </button>
          </div>
        </div>

        {/* Primary Action Button */}
        <div className="flex flex-col items-center gap-3 pt-2">
          <Button
            variant="primary"
            size="lg"
            disabled={isTextEmpty}
            isLoading={isAnalyzing}
            onClick={handleAnalyzeEssay}
            className="w-full sm:w-auto sm:min-w-[240px] shadow-md hover:shadow-elevation py-3.5 text-base font-semibold"
          >
            {isAnalyzing ? "Analyzing your essay..." : "Check my Essay"}
          </Button>

          <p className="text-[11px] text-typography-muted flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            Academic privacy guaranteed • Submissions are not used for public AI training
          </p>
        </div>
      </div>
    </div>
  );
}
