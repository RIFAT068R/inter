import type { WatSession } from "@/lib/storage";

export function sanitizeWords(wordsText: string) {
  return wordsText
    .split(/\r?\n/)
    .map((word) => word.trim())
    .filter(Boolean);
}

export function formatAverageLength(value: number) {
  return `${value.toFixed(1)} chars`;
}

export function analyzeWatSession(session: WatSession) {
  const totalWords = session.words.length;
  const completedAnswers = session.answers.filter((entry) => entry.answer.trim()).length;
  const skippedAnswers = totalWords - completedAnswers;
  const averageAnswerLength =
    totalWords === 0 ? 0 : session.answers.reduce((sum, entry) => sum + entry.answer.trim().length, 0) / totalWords;

  const completionRate = totalWords === 0 ? 0 : completedAnswers / totalWords;
  const summary =
    completionRate >= 0.85
      ? "Strong pace. You sustained response output across most prompts and kept session momentum under pressure."
      : completionRate >= 0.6
        ? "Stable base. You are responding to most prompts, but there is room to improve speed and consistency."
        : "Your response flow is still breaking under the timer. Focus on shorter, decisive answers before aiming for depth.";

  const insights = [
    {
      title: "Completion Rate",
      description: `${Math.round(completionRate * 100)}% of prompts received a response. Higher completion usually reflects stronger timing control.`,
    },
    {
      title: "Answer Depth",
      description:
        averageAnswerLength >= 18
          ? "Your answers show healthy detail. Maintain clarity while preserving speed."
          : "Your answers are brief. Practice producing complete thoughts with the same speed.",
    },
    {
      title: "Skipped Pressure",
      description:
        skippedAnswers === 0
          ? "No skipped prompts. This is a strong sign of rhythm and confidence."
          : `${skippedAnswers} skipped prompts suggest timer pressure. Aim to reduce hesitation on difficult words.`,
    },
  ];

  return {
    totalWords,
    completedAnswers,
    skippedAnswers,
    averageAnswerLength,
    summary,
    insights,
  };
}
