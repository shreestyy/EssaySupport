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
    "Write a persuasive 800-1,000 word argumentative essay evaluating whether generative artificial intelligence should be integrated or restricted within undergraduate curricula. Support your thesis with contemporary ethical considerations and learning theories.",
  essayType: "Argumentative Essay",
  educationLevel: "Undergraduate (Year 2)",
};

export const MOCK_ESSAY_TEXT = `The proliferation of generative artificial intelligence in academia has provoked a polarized discourse between outright prohibition and uncritical adoption. Rather than viewing machine learning tools as existential threats to academic integrity, universities must adopt proactive integration frameworks that cultivate algorithmic literacy while safeguarding authentic cognitive inquiry.

In recent semesters, university administrations have reacted reactively with blanket bans and automated detection software. However, studies consistently demonstrate that AI detection tools exhibit significant false-positive rates, particularly disfavoring non-native English speakers. Banning these technologies merely drives their usage underground, exacerbating inequities between students who access private tutoring and those who rely on institutional guidance.

Fundamentally, higher education has historically adapted to technological disruptions, from pocket calculators in mathematics to search engines in historical research. When institutions emphasize iterative drafting, metacognitive reflection, and oral defenses over static summative assessments, generative tools transform from cheating shortcuts into cognitive scaffolding. Therefore, progressive curricula that mandate transparent citation and critical evaluation of AI outputs prepare students far more effectively for the realities of modern intellectual labor.`;

export const MOCK_ISSUES: EssayIssue[] = [
  {
    id: "issue-1",
    category: "Thesis Precision",
    span: { start: 147, end: 326 },
    what: "Compound thesis statement could be sharpened for rhetorical punch.",
    why: "While your argument is clear, combining algorithmic literacy and authentic cognitive inquiry without defining their operational link weakens the core claim's immediacy.",
    how: "Consider specifying the concrete mechanism: e.g., 'universities must implement structured pedagogical integration that equips students to interrogate machine outputs rather than surrender analytical judgment.'",
    resolved: false,
  },
  {
    id: "issue-2",
    category: "Word Choice & Redundancy",
    span: { start: 367, end: 410 },
    what: "Redundant phrasing: 'reacted reactively'.",
    why: "Using the adverb 'reactively' right after the verb 'reacted' creates awkward tautology and detracts from academic tone.",
    how: "Replace with 'have responded defensively with blanket bans' or simply 'have instituted reactionary bans.'",
    resolved: false,
  },
  {
    id: "issue-3",
    category: "Evidence & Citation",
    span: { start: 421, end: 554 },
    what: "Unsubstantiated empirical claim regarding AI detection error rates.",
    why: "Mentioning 'studies consistently demonstrate' without citing specific peer-reviewed research or institutional data weakens academic authority.",
    how: "Cite specific empirical research (e.g., Liang et al., 2023 regarding detector bias against non-native writers) to substantiate your claim.",
    resolved: false,
  },
  {
    id: "issue-4",
    category: "Argumentative Transition",
    span: { start: 708, end: 855 },
    what: "Historical analogy requires closer contextual anchoring.",
    why: "Comparing AI to calculators is common, but requires brief qualification regarding how generative models fundamentally synthesize language rather than compute discrete numerical solutions.",
    how: "Briefly distinguish quantitative computation from semantic synthesis before asserting the pedagogical parallel.",
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
