import { create } from "zustand";
import {
  EssayIssue,
  Assignment,
  DraftHistoryItem,
  MOCK_ESSAY_TEXT,
  MOCK_ISSUES,
  MOCK_ASSIGNMENT,
  MOCK_DRAFT_HISTORY,
} from "./mock-data";

export type { EssayIssue, Assignment, DraftHistoryItem };

export interface AppState {
  essayText: string;
  issues: EssayIssue[];
  activeIssueIndex: number;
  assignment: Assignment | null;
  draftHistory: DraftHistoryItem[];

  // Actions & Setters
  setEssayText: (t: string) => void;
  setIssues: (i: EssayIssue[]) => void;
  setActiveIssueIndex: (index: number) => void;
  resolveIssue: (id: string) => void;
  unresolveIssue: (id: string) => void;
  toggleIssueResolved: (id: string) => void;
  setAssignment: (a: Assignment | null) => void;
  addDraftHistory: (draft: DraftHistoryItem) => void;
  startNewEssay: () => void;
  resetToMockData: () => void;
}

export const useAppStore = create<AppState>((set) => ({
  essayText: "",
  issues: [],
  activeIssueIndex: 0,
  assignment: MOCK_ASSIGNMENT,
  draftHistory: MOCK_DRAFT_HISTORY,

  setEssayText: (essayText) => set({ essayText }),

  setIssues: (issues) => set({ issues }),

  setActiveIssueIndex: (activeIssueIndex) => set({ activeIssueIndex }),

  resolveIssue: (id) =>
    set((state) => ({
      issues: state.issues.map((issue) =>
        issue.id === id ? { ...issue, resolved: true } : issue
      ),
    })),

  unresolveIssue: (id) =>
    set((state) => ({
      issues: state.issues.map((issue) =>
        issue.id === id ? { ...issue, resolved: false } : issue
      ),
    })),

  toggleIssueResolved: (id) =>
    set((state) => ({
      issues: state.issues.map((issue) =>
        issue.id === id ? { ...issue, resolved: !issue.resolved } : issue
      ),
    })),

  setAssignment: (assignment) => set({ assignment }),

  addDraftHistory: (draft) =>
    set((state) => ({
      draftHistory: [...state.draftHistory, draft],
    })),

  // Resets current essay draft & issues for a new submission,
  // intentionally preserving draftHistory so the user's progress trajectory persists across sessions.
  startNewEssay: () =>
    set({
      essayText: "",
      issues: [],
      activeIssueIndex: 0,
      assignment: null,
    }),

  resetToMockData: () =>
    set({
      essayText: MOCK_ESSAY_TEXT,
      issues: MOCK_ISSUES,
      activeIssueIndex: 0,
      assignment: MOCK_ASSIGNMENT,
      draftHistory: MOCK_DRAFT_HISTORY,
    }),
}));
