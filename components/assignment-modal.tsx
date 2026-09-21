"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { X } from "lucide-react";
import { useAppStore } from "@/lib/store";
import { ROUTES } from "@/lib/routes";
import { Button } from "@/components/ui/button";

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
  const [essayType, setEssayType] = useState("Argumentative Essay");
  const [educationLevel, setEducationLevel] = useState("Undergrad Y2");
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
        "Evaluate whether generative AI should be integrated or restricted in undergraduate curricula, addressing ethics and learning outcomes."
      );
      setEssayType("Argumentative Essay");
      setEducationLevel("Undergrad Y2");
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
        className="w-full max-w-lg bg-white rounded-2xl border border-border shadow-soft-lg overflow-hidden transition-all scale-100"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="assignment-modal-title"
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-white">
          <div>
            <h3
              id="assignment-modal-title"
              className="text-base font-semibold text-typography-heading"
            >
              Assignment Criteria
            </h3>
            <p className="text-xs text-typography-muted">
              Add prompt instructions and rubric guidelines
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close modal"
            className="w-8 h-8 rounded-full flex items-center justify-center text-typography-muted hover:text-typography-heading hover:bg-surface-panel transition-colors focus:outline-none"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* 1. Assignment Instructions Textarea */}
          <div className="space-y-1">
            <label
              htmlFor="instructions-field"
              className="block text-xs font-semibold text-typography-heading"
            >
              Assignment instructions
            </label>
            <textarea
              id="instructions-field"
              rows={4}
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              placeholder="Paste teacher instructions, rubric guidelines, or questions..."
              className="w-full rounded-xl border border-border bg-white p-3 text-xs sm:text-sm text-typography-heading placeholder:text-typography-muted/70 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all resize-y leading-relaxed"
            />
          </div>

          {/* 2. Detected Essay Type & 3. Education Level */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label
                htmlFor="essay-type-field"
                className="block text-xs font-semibold text-typography-heading"
              >
                Essay type
              </label>
              <select
                id="essay-type-field"
                value={essayType}
                onChange={(e) => setEssayType(e.target.value)}
                className="w-full rounded-xl border border-border bg-white px-3 py-2 text-xs sm:text-sm font-medium text-typography-heading focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent cursor-pointer"
              >
                <option value="Argumentative Essay">Argumentative Essay</option>
                <option value="Narrative Essay">Narrative Essay</option>
                <option value="Expository Essay">Expository Essay</option>
                <option value="Persuasive Essay">Persuasive Essay</option>
                <option value="Descriptive Essay">Descriptive Essay</option>
                <option value="Compare & Contrast">Compare &amp; Contrast</option>
              </select>
            </div>

            <div className="space-y-1">
              <label
                htmlFor="education-level-field"
                className="block text-xs font-semibold text-typography-heading"
              >
                Education level
              </label>
              <select
                id="education-level-field"
                value={educationLevel}
                onChange={(e) => setEducationLevel(e.target.value)}
                className="w-full rounded-xl border border-border bg-white px-3 py-2 text-xs sm:text-sm font-medium text-typography-heading focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent cursor-pointer"
              >
                <option value="Middle School">Middle School</option>
                <option value="High School">High School</option>
                <option value="Undergrad Y2">Undergrad Y2</option>
                <option value="Undergraduate">Undergraduate</option>
                <option value="Graduate">Graduate</option>
              </select>
            </div>
          </div>

          {/* Modal Actions */}
          <div className="flex flex-col-reverse sm:flex-row sm:items-center sm:justify-end gap-2.5 pt-3 border-t border-border mt-4">
            <Button
              type="button"
              variant="secondary"
              size="md"
              onClick={onClose}
              disabled={isChecking}
              className="w-full sm:w-auto font-medium"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="md"
              isLoading={isChecking}
              className="w-full sm:w-auto font-semibold"
            >
              {isChecking ? "Checking..." : "Check against assignment"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
