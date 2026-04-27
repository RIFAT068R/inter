import type { AnalyzerResult, AnalyzerTrait } from "@/lib/storage";

const TRAITS = [
  "Leadership",
  "Confidence",
  "Responsibility",
  "Decision Making",
  "Positivity",
  "Practicality",
] as const;

type Trait = AnalyzerTrait;

type AnalyzerAnswerInput = {
  prompt: string;
  answer: string;
};

type SignalRule = {
  phrase: string;
  traits: Partial<Record<Trait, number>>;
  tone?: "positive" | "negative";
};

const STRONG_SIGNALS: SignalRule[] = [
  { phrase: "help", traits: { Leadership: 1, Positivity: 1, Responsibility: 1 }, tone: "positive" },
  { phrase: "solve", traits: { "Decision Making": 2, Practicality: 2 }, tone: "positive" },
  { phrase: "lead", traits: { Leadership: 2, Confidence: 1 }, tone: "positive" },
  { phrase: "inform", traits: { Responsibility: 2, "Decision Making": 1 }, tone: "positive" },
  { phrase: "organize", traits: { Leadership: 1, Practicality: 2, "Decision Making": 1 }, tone: "positive" },
  { phrase: "calm", traits: { Confidence: 2, Positivity: 1 }, tone: "positive" },
  { phrase: "protect", traits: { Responsibility: 2, Leadership: 1 }, tone: "positive" },
  { phrase: "support", traits: { Leadership: 1, Positivity: 2, Responsibility: 1 }, tone: "positive" },
  { phrase: "team", traits: { Leadership: 2, Positivity: 1 }, tone: "positive" },
  { phrase: "responsibility", traits: { Responsibility: 3 }, tone: "positive" },
  { phrase: "action", traits: { "Decision Making": 2, Confidence: 1 }, tone: "positive" },
  { phrase: "quickly", traits: { "Decision Making": 1, Practicality: 1 }, tone: "positive" },
  { phrase: "safely", traits: { Responsibility: 1, Practicality: 2 }, tone: "positive" },
];

const WEAK_SIGNALS: SignalRule[] = [
  { phrase: "run away", traits: { Confidence: -3, Leadership: -2 }, tone: "negative" },
  { phrase: "ignore", traits: { Responsibility: -3, Leadership: -1 }, tone: "negative" },
  { phrase: "panic", traits: { Confidence: -3, "Decision Making": -2 }, tone: "negative" },
  { phrase: "blame", traits: { Responsibility: -3, Leadership: -2 }, tone: "negative" },
  { phrase: "fight unnecessarily", traits: { Positivity: -2, Practicality: -3 }, tone: "negative" },
  { phrase: "do nothing", traits: { "Decision Making": -3, Leadership: -2 }, tone: "negative" },
  { phrase: "wait only", traits: { Practicality: -2, "Decision Making": -2 }, tone: "negative" },
  { phrase: "fear", traits: { Confidence: -2, Positivity: -1 }, tone: "negative" },
  { phrase: "confused", traits: { "Decision Making": -2, Confidence: -2 }, tone: "negative" },
  { phrase: "hopeless", traits: { Positivity: -3, Confidence: -1 }, tone: "negative" },
];

const SAMPLE_STYLE = "Keep the answer calm, direct, action-focused, and useful: state what you will do, who you will help, and how you will handle it safely.";
const DISCLAIMER = "This is practice feedback, not official ISSB evaluation.";

export function parseManualAnswers(text: string) {
  return text
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .map((answer, index) => ({
      prompt: `Answer ${index + 1}`,
      answer,
    }));
}

export function parseImportedWatAnswers(answers: AnalyzerAnswerInput[]) {
  return answers.filter((entry) => entry.answer.trim().length > 0);
}

export function analyzeAnswers(answers: AnalyzerAnswerInput[]): AnalyzerResult {
  const analyzedAnswers = answers.map((entry) => analyzeSingleAnswer(entry));
  const leadershipIndex =
    analyzedAnswers.length === 0
      ? 0
      : analyzedAnswers.reduce((sum, entry) => sum + entry.overall, 0) / analyzedAnswers.length;

  const traitAverages = Object.fromEntries(
    TRAITS.map((trait) => [
      trait,
      analyzedAnswers.length === 0
        ? 0
        : analyzedAnswers.reduce((sum, entry) => sum + entry.scores[trait], 0) / analyzedAnswers.length,
    ]),
  ) as Record<Trait, number>;

  const rankedTraits = [...TRAITS].sort((left, right) => traitAverages[right] - traitAverages[left]);
  const strengths = rankedTraits.slice(0, 3).filter((trait) => traitAverages[trait] >= 6.5);
  const weakAreas = rankedTraits.slice(-3).filter((trait) => traitAverages[trait] <= 5.5);

  const improvementTips = buildImprovementTips(weakAreas, answers.length);

  return {
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
    leadershipIndex,
    strengths,
    weakAreas,
    improvementTips,
    sampleAnswerStyle: SAMPLE_STYLE,
    disclaimer: DISCLAIMER,
    answers: analyzedAnswers,
  };
}

export function formatScore(value: number) {
  return value.toFixed(1);
}

function analyzeSingleAnswer(entry: AnalyzerAnswerInput) {
  const normalized = entry.answer.toLowerCase();
  const scores = Object.fromEntries(TRAITS.map((trait) => [trait, 5])) as Record<Trait, number>;

  for (const signal of STRONG_SIGNALS) {
    if (normalized.includes(signal.phrase)) {
      applySignal(scores, signal.traits);
    }
  }

  for (const signal of WEAK_SIGNALS) {
    if (normalized.includes(signal.phrase)) {
      applySignal(scores, signal.traits);
    }
  }

  if (entry.answer.trim().length >= 35) {
    scores.Practicality += 1;
    scores["Decision Making"] += 1;
  }

  if (normalized.includes("i will") || normalized.includes("i can") || normalized.includes("i would")) {
    scores.Confidence += 1;
    scores["Decision Making"] += 1;
  }

  if (normalized.includes("together") || normalized.includes("others") || normalized.includes("people")) {
    scores.Leadership += 1;
    scores.Positivity += 1;
  }

  for (const trait of TRAITS) {
    scores[trait] = clamp(scores[trait], 1, 10);
  }

  const overall = TRAITS.reduce((sum, trait) => sum + scores[trait], 0) / TRAITS.length;
  const feedback = buildAnswerFeedback(scores, normalized, entry.answer.trim().length);

  return {
    prompt: entry.prompt,
    answer: entry.answer,
    scores,
    feedback,
    overall,
  };
}

function applySignal(scores: Record<Trait, number>, traits: Partial<Record<Trait, number>>) {
  for (const [trait, value] of Object.entries(traits) as [Trait, number][]) {
    scores[trait] += value;
  }
}

function buildAnswerFeedback(scores: Record<Trait, number>, normalizedAnswer: string, answerLength: number) {
  const notes: string[] = [];

  if (scores.Leadership >= 7) {
    notes.push("Shows initiative.");
  }

  if (scores.Responsibility >= 7) {
    notes.push("Good sense of duty.");
  }

  if (scores["Decision Making"] < 5.5) {
    notes.push("Add a clearer next step.");
  }

  if (scores.Confidence < 5.5 || normalizedAnswer.includes("maybe")) {
    notes.push("Use more decisive wording.");
  }

  if (scores.Positivity < 5.5) {
    notes.push("Keep the tone constructive.");
  }

  if (answerLength < 18) {
    notes.push("Make it slightly more complete.");
  }

  if (notes.length === 0) {
    notes.push("Balanced answer. Keep it direct and action-led.");
  }

  return notes.slice(0, 3).join(" ");
}

function buildImprovementTips(weakAreas: string[], answerCount: number) {
  const tips = [
    "Start with a direct action instead of description only.",
    "Mention safety, support, or responsibility where relevant.",
    "Use short decisive phrases such as 'I will help' or 'I will inform and act'.",
  ];

  if (weakAreas.includes("Confidence")) {
    tips.unshift("Avoid hesitant wording and write in a firm first-person voice.");
  }

  if (weakAreas.includes("Decision Making")) {
    tips.unshift("Show one clear next step quickly instead of waiting passively.");
  }

  if (answerCount < 5) {
    tips.push("Analyze a larger set of answers to get steadier practice feedback.");
  }

  return tips.slice(0, 4);
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}
