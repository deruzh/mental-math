import { create } from 'zustand';
import { loadPersisted, savePersisted, PersistedState, Stats } from './persistence';
import { parseHash } from '../router/url';

export type Screen = 'home' | 'lesson' | 'challenge';

interface AppState {
  screen: Screen;
  selectedLessonIdx: number;
  stats: Stats;
  bestChallengeScore: number;
  focusOnly: boolean;
  setScreen: (s: Screen) => void;
  setSelectedLessonIdx: (i: number) => void;
  setFocusOnly: (v: boolean) => void;
  recordAnswer: (correct: boolean, elapsedMs: number) => void;
  recordChallengeScore: (score: number) => void;
}

const persisted = loadPersisted();
const initialRoute =
  typeof window !== 'undefined' ? parseHash(window.location.hash) : { screen: 'home' as Screen };

export const useStore = create<AppState>((set, get) => ({
  screen: initialRoute.screen,
  selectedLessonIdx: initialRoute.lessonIdx ?? persisted?.selectedLessonIdx ?? 0,
  stats: persisted?.stats ?? { totalCorrect: 0, totalAnswered: 0, avgTimeMs: 0 },
  bestChallengeScore: persisted?.bestChallengeScore ?? 0,
  focusOnly: persisted?.focusOnly ?? false,
  setScreen: (s) => set({ screen: s }),
  setSelectedLessonIdx: (i) => {
    set({ selectedLessonIdx: i });
    persist(get());
  },
  setFocusOnly: (v) => {
    set({ focusOnly: v });
    persist(get());
  },
  recordAnswer: (correct, elapsedMs) => {
    const prev = get().stats;
    const totalAnswered = prev.totalAnswered + 1;
    const totalCorrect = prev.totalCorrect + (correct ? 1 : 0);
    const avgTimeMs = correct
      ? (prev.avgTimeMs * prev.totalCorrect + elapsedMs) / Math.max(1, totalCorrect)
      : prev.avgTimeMs;
    set({ stats: { totalCorrect, totalAnswered, avgTimeMs } });
    persist(get());
  },
  recordChallengeScore: (score) => {
    if (score > get().bestChallengeScore) {
      set({ bestChallengeScore: score });
      persist(get());
    }
  },
}));

function persist(state: AppState) {
  const snapshot: PersistedState = {
    selectedLessonIdx: state.selectedLessonIdx,
    stats: state.stats,
    bestChallengeScore: state.bestChallengeScore,
    focusOnly: state.focusOnly,
  };
  savePersisted(snapshot);
}

export type { Stats };
