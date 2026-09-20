"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { X, GraduationCap, Sparkles, Wand2 } from "lucide-react";
import { useAppStore } from "@/lib/store";
import { ROUTES } from "@/lib/routes";
import { Button } from "@/components/ui/button";
import { IconBadge } from "@/components/ui/icon-badge";

export interface AssignmentModalProps {
  open?: boolean;
  isOpen?: boolean;
  onClose: () => void;
}

export const AssignmentModal: React.FC<AssignmentModalProps> = ({
  open,
  isOpen,
  onClose,
}) => {
  const router = useRouter();
  const isModalVisible = open ?? isOpen ?? false;
  const { assignment, setAssignment } = useAppStore();

  const [instructions, setInstructions] = useState("");
  const [essayType, setEssayType] = useState("Argumentative");
  const [educationLevel, setEducationLevel] = useState("High School");
  const [isChecking, setIsChecking] = useState(false);

  // Initialize form state from store or mock defaults
  useEffect(() => {
    if (assignment) {
      setInstructions(assignment.instructions || "");
      if (assignment.essayType) {
        setEssayType(assignment.essayType);
      }
      if (assignment.educationLevel) {
        setEducationLevel(assignment.educationLevel);
      }
    } else {
      setInstructions(
        "Write an argumentative essay exploring the ethical implications and academic benefits of adopting generative AI in modern curricula. Address counterarguments and incorporate at least two scholarly references."
      );
      setEssayType("Argumentative");
      setEducationLevel("High School");
    }
  }, [assignment, isModalVisible]);

  // Handle ESC key to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isModalVisible) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isModalVisible, onClose]);

  if (!isModalVisible) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsChecking(true);

    // Save into Zustand store
    setAssignment({
      instructions: instructions.trim(),
      essayType,
      educationLevel,
    });

    // Simulate re-analysis call
    setTimeout(() => {
      setIsChecking(false);
      onClose();
      router.push(ROUTES.results);
    }, 900);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-typography-heading/40 backdrop-blur-sm animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        className="w-full max-w-xl bg-white rounded-2xl border border-border shadow-soft-lg overflow-hidden transition-all scale-100"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="assignment-modal-title"
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-surface-panel/80">
          <div className="flex items-center gap-3">
            <IconBadge shape="square" size="sm">
              <GraduationCap className="w-4 h-4 text-primary" />
            </IconBadge>
            <div>
              <h3
                id="assignment-modal-title"
                className="text-base font-semibold text-typography-heading"
              >
                Assignment Criteria
              </h3>
              <p className="text-xs text-typography-muted">
                Align diagnostic checks with your teacher&apos;s prompt and grade level
              </p>
            </div>
          </div>

          {/* Visible close button (X icon top-right) */}
          <button
            type="button"
            onClick={onClose}
            aria-label="Close modal"
            className="w-8 h-8 rounded-full flex items-center justify-center text-typography-muted hover:text-typography-heading hover:bg-white border border-transparent hover:border-border transition-colors focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* 1. Assignment Instructions Textarea */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label
                htmlFor="instructions-field"
                className="block text-xs font-semibold uppercase tracking-wider text-typography-heading"
              >
                Assignment instructions
              </label>
              <span className="text-[11px] text-typography-muted">
                Prompt or rubric
              </span>
            </div>
            <textarea
              id="instructions-field"
              rows={4}
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              placeholder="Paste your assignment prompt, rubric guidelines, or specific questions you need to answer..."
              className="w-full rounded-xl border border-border bg-white p-3.5 text-sm text-typography-heading placeholder:text-typography-muted/70 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all resize-y leading-relaxed"
            />
          </div>

          {/* 2. Detected Essay Type & 3. Education Level */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Detected Essay Type */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label
                  htmlFor="essay-type-field"
                  className="block text-xs font-semibold uppercase tracking-wider text-typography-heading"
                >
                  Detected essay type
                </label>
                <span className="inline-flex items-center gap-1 text-[10px] font-medium text-primary bg-primary-light px-2 py-0.5 rounded-full">
                  <Wand2 className="w-2.5 h-2.5" />
                  Auto-detected
                </span>
              </div>
              <div className="relative">
                <select
                  id="essay-type-field"
                  value={essayType}
                  onChange={(e) => setEssayType(e.target.value)}
                  className="w-full appearance-none rounded-xl border border-border bg-white px-3.5 py-2.5 text-sm font-medium text-typography-heading focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all cursor-pointer"
                >
                  <option value="Argumentative">Argumentative</option>
                  <option value="Narrative">Narrative</option>
                  <option value="Expository">Expository</option>
                  <option value="Persuasive">Persuasive</option>
                  <option value="Descriptive">Descriptive</option>
                  <option value="Compare & Contrast">Compare &amp; Contrast</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-typography-muted">
                  <svg
                    className="w-4 h-4 fill-current"
                    viewBox="0 0 20 20"
                  >
                    <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Education Level */}
            <div className="space-y-1.5">
              <label
                htmlFor="education-level-field"
                className="block text-xs font-semibold uppercase tracking-wider text-typography-heading"
              >
                Education Level
              </label>
              <div className="relative">
                <select
                  id="education-level-field"
                  value={educationLevel}
                  onChange={(e) => setEducationLevel(e.target.value)}
                  className="w-full appearance-none rounded-xl border border-border bg-white px-3.5 py-2.5 text-sm font-medium text-typography-heading focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all cursor-pointer"
                >
                  <option value="Middle School">Middle School</option>
                  <option value="High School">High School</option>
                  <option value="Undergraduate">Undergraduate</option>
                  <option value="Graduate">Graduate</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-typography-muted">
                  <svg
                    className="w-4 h-4 fill-current"
                    viewBox="0 0 20 20"
                  >
                    <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Modal Actions */}
          <div className="flex flex-col-reverse sm:flex-row sm:items-center sm:justify-end gap-3 pt-4 border-t border-border mt-6">
            <Button
              type="button"
              variant="secondary"
              size="md"
              onClick={onClose}
              disabled={isChecking}
              className="w-full sm:w-auto"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="md"
              isLoading={isChecking}
              className="w-full sm:w-auto shadow-elevation"
            >
              {isChecking ? (
                "Re-analyzing draft..."
              ) : (
                <>
                  <Sparkles className="w-4 h-4 mr-1.5" />
                  Check against my assignment
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
