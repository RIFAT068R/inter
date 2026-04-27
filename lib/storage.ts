export type WatAnswer = {
  index: number;
  word: string;
  answer: string;
  status: "completed" | "skipped";
};

export type WatSession = {
  id: string;
  createdAt: string;
  completedAt: string | null;
  timerSeconds: number;
  words: string[];
  currentIndex: number;
  answers: WatAnswer[];
};

export type AnalyzerInput = {
  id: string;
  createdAt: string;
  answers: {
    prompt: string;
    answer: string;
  }[];
  importedFromLatestWat: boolean;
};

export type AnalyzerResult = {
  id: string;
  createdAt: string;
  leadershipIndex: number;
  strengths: string[];
  weakAreas: string[];
  improvementTips: string[];
  sampleAnswerStyle: string;
  disclaimer: string;
  answers: {
    prompt: string;
    answer: string;
    scores: Record<string, number>;
    feedback: string;
    overall: number;
  }[];
};

const CURRENT_SESSION_KEY = "nextleader-wat-current-session";
const HISTORY_KEY = "nextleader-wat-history";
const LAST_ANALYZER_INPUT_KEY = "nextleader-analyzer-input";
const LAST_ANALYZER_RESULT_KEY = "nextleader-analyzer-result";

export function createWatSession(words: string[], timerSeconds: number): WatSession {
  return {
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
    completedAt: null,
    timerSeconds,
    words,
    currentIndex: 0,
    answers: words.map((word, index) => ({
      index,
      word,
      answer: "",
      status: "skipped",
    })),
  };
}

function canUseStorage() {
  return typeof window !== "undefined";
}

export function saveWatSession(session: WatSession) {
  if (!canUseStorage()) {
    return;
  }

  window.localStorage.setItem(CURRENT_SESSION_KEY, JSON.stringify(session));
}

export function getCurrentWatSession(): WatSession | null {
  if (!canUseStorage()) {
    return null;
  }

  const raw = window.localStorage.getItem(CURRENT_SESSION_KEY);
  return raw ? (JSON.parse(raw) as WatSession) : null;
}

export function saveWatSessionAnswer(sessionId: string, index: number, answer: string): WatSession | null {
  const session = getCurrentWatSession();

  if (!session || session.id !== sessionId) {
    return null;
  }

  session.answers[index] = {
    ...session.answers[index],
    answer,
    status: answer.trim() ? "completed" : "skipped",
  };

  session.currentIndex = index + 1;
  saveWatSession(session);
  return session;
}

export function completeWatSession(sessionId: string): WatSession | null {
  const session = getCurrentWatSession();

  if (!session || session.id !== sessionId) {
    return null;
  }

  session.completedAt = new Date().toISOString();
  saveWatHistory(session);
  window.localStorage.removeItem(CURRENT_SESSION_KEY);
  window.localStorage.setItem("nextleader-wat-last-result", JSON.stringify(session));
  return session;
}

export function getLatestCompletedWatSession(): WatSession | null {
  if (!canUseStorage()) {
    return null;
  }

  const raw = window.localStorage.getItem("nextleader-wat-last-result");
  return raw ? (JSON.parse(raw) as WatSession) : null;
}

export function getWatHistory(): WatSession[] {
  if (!canUseStorage()) {
    return [];
  }

  const raw = window.localStorage.getItem(HISTORY_KEY);
  return raw ? (JSON.parse(raw) as WatSession[]) : [];
}

export function saveAnalyzerInput(input: AnalyzerInput) {
  if (!canUseStorage()) {
    return;
  }

  window.localStorage.setItem(LAST_ANALYZER_INPUT_KEY, JSON.stringify(input));
}

export function getAnalyzerInput(): AnalyzerInput | null {
  if (!canUseStorage()) {
    return null;
  }

  const raw = window.localStorage.getItem(LAST_ANALYZER_INPUT_KEY);
  return raw ? (JSON.parse(raw) as AnalyzerInput) : null;
}

export function saveAnalyzerResult(result: AnalyzerResult) {
  if (!canUseStorage()) {
    return;
  }

  window.localStorage.setItem(LAST_ANALYZER_RESULT_KEY, JSON.stringify(result));
}

export function getAnalyzerResult(): AnalyzerResult | null {
  if (!canUseStorage()) {
    return null;
  }

  const raw = window.localStorage.getItem(LAST_ANALYZER_RESULT_KEY);
  return raw ? (JSON.parse(raw) as AnalyzerResult) : null;
}

function saveWatHistory(session: WatSession) {
  if (!canUseStorage()) {
    return;
  }

  const history = getWatHistory();
  window.localStorage.setItem(HISTORY_KEY, JSON.stringify([session, ...history].slice(0, 12)));
}
