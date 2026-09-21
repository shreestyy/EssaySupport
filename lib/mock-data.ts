export interface EssayIssue {
  id: string;
  category: string;
  span: { start: number; end: number };
  what: string;
  why: string;
  how: string;
  resolved: boolean;
}

export interface Assignment {
  instructions: string;
  essayType: string;
  educationLevel: string;
}

export interface DraftHistoryItem {
  draftNumber: number;
  scores: number;
  timestamp: string;
}

export const MOCK_ASSIGNMENT: Assignment = {
  instructions:
    "Evaluate whether generative AI should be integrated or restricted in undergraduate curricula, addressing ethics and learning outcomes.",
  essayType: "Argumentative Essay",
  educationLevel: "Undergrad Y2",
};

export const MOCK_ESSAY_TEXT = `The proliferation of generative artificial intelligence in academia has provoked a polarized discourse between outright prohibition and uncritical adoption. Rather than viewing machine learning tools as existential threats to academic integrity, universities must adopt proactive integration frameworks that cultivate algorithmic literacy while safeguarding authentic cognitive inquiry.

In recent semesters, university administrations have reacted reactively with blanket bans and automated detection software. However, studies consistently demonstrate that AI detection tools exhibit significant false-positive rates, particularly disfavoring non-native English speakers. Banning these technologies merely drives their usage underground, exacerbating inequities between students who access private tutoring and those who rely on institutional guidance.

Fundamentally, higher education has historically adapted to technological disruptions, from pocket calculators in mathematics to search engines in historical research. When institutions emphasize iterative drafting, metacognitive reflection, and oral defenses over static summative assessments, generative tools transform from cheating shortcuts into cognitive scaffolding. Therefore, progressive curricula that mandate transparent citation and critical evaluation of AI outputs prepare students far more effectively for the realities of modern intellectual labor.`;

export const MOCK_ISSUES: EssayIssue[] = [
  {
    id: "issue-1",
    category: "Thesis Precision",
    span: { start: 147, end: 326 },
    what: "Compound thesis lacks a concrete operational mechanism.",
    why: "Combining algorithmic literacy and inquiry without defining their link weakens the core claim's focus.",
    how: "Specify how students should interrogate machine outputs rather than surrender analytical judgment.",
    resolved: false,
  },
  {
    id: "issue-2",
    category: "Word Choice",
    span: { start: 367, end: 410 },
    what: "Redundant phrasing in 'reacted reactively'.",
    why: "Using 'reactively' immediately after 'reacted' creates awkward repetition.",
    how: "Replace with 'responded defensively' or 'instituted reactionary bans'.",
    resolved: false,
  },
  {
    id: "issue-3",
    category: "Evidence & Citation",
    span: { start: 421, end: 554 },
    what: "Empirical claim on error rates lacks citation.",
    why: "Citing error rates without a source weakens argument credibility.",
    how: "Cite research (e.g. Liang et al., 2023) to substantiate detector bias.",
    resolved: false,
  },
  {
    id: "issue-4",
    category: "Argument Transition",
    span: { start: 708, end: 855 },
    what: "Historical analogy needs closer contextual framing.",
    why: "Calculators perform arithmetic, whereas generative models synthesize language and semantics.",
    how: "Briefly distinguish numerical calculation from semantic synthesis.",
    resolved: true,
  },
];

export const MOCK_DRAFT_HISTORY: DraftHistoryItem[] = [
  {
    draftNumber: 1,
    scores: 68,
    timestamp: "Draft 1 • Sep 14",
  },
  {
    draftNumber: 2,
    scores: 76,
    timestamp: "Draft 2 • Sep 15",
  },
  {
    draftNumber: 3,
    scores: 84,
    timestamp: "Draft 3 • Sep 16",
  },
  {
    draftNumber: 4,
    scores: 92,
    timestamp: "Draft 4 • Sep 17",
  },
];
