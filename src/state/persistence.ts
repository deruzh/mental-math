const KEY = 'mental-math:v1';

export interface Stats {
  totalCorrect: number;
  totalAnswered: number;
  avgTimeMs: number;
}

export interface PersistedState {
  selectedLessonIdx: number;
  stats: Stats;
  bestChallengeScore: number;
}

export function loadPersisted(): PersistedState | null {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return null;
    return JSON.parse(raw) as PersistedState;
  } catch {
    return null;
  }
}

export function savePersisted(state: PersistedState): void {
  try {
    localStorage.setItem(KEY, JSON.stringify(state));
  } catch {
    // ignore quota / disabled storage
  }
}
