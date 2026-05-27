import { useCallback, useEffect, useMemo, useState } from 'react';
import { useStore } from '../state/store';
import { flatLessons } from '../lessons';
import { initialWeights, decayWeights } from '../scheduler/weights';
import { pickTask } from '../scheduler/pickTask';
import { useAutoInput } from '../input/useAutoInput';
import { useIsTouch } from '../input/useIsTouch';
import { TaskView } from './TaskView';
import { Numpad } from './Numpad';
import { StatsBar } from './StatsBar';
import { Task } from '../generators/types';
import { t } from '../i18n/ru';

export function LessonScreen() {
  const selectedIdx = useStore((s) => s.selectedLessonIdx);
  const setScreen = useStore((s) => s.setScreen);
  const recordAnswer = useStore((s) => s.recordAnswer);
  const focusOnly = useStore((s) => s.focusOnly);

  const focusId = useMemo(() => flatLessons[selectedIdx].generatorId, [selectedIdx]);
  const [weights, setWeights] = useState<Record<string, number>>(() =>
    initialWeights(selectedIdx),
  );
  const [task, setTask] = useState<Task | null>(() => pickTask(initialWeights(selectedIdx)));
  const [sessionCorrect, setSessionCorrect] = useState(0);
  const [sessionAnswered, setSessionAnswered] = useState(0);
  const [sessionAvgMs, setSessionAvgMs] = useState(0);

  useEffect(() => {
    const w = initialWeights(selectedIdx);
    setWeights(w);
    setTask(pickTask(w));
    setSessionCorrect(0);
    setSessionAnswered(0);
    setSessionAvgMs(0);
  }, [selectedIdx]);

  const handleComplete = useCallback(
    (finishedTask: Task, elapsedMs: number, isCorrect: boolean) => {
      recordAnswer(isCorrect, elapsedMs);
      setSessionAnswered((a) => a + 1);
      if (isCorrect) {
        setSessionCorrect((c) => c + 1);
        setSessionAvgMs((prev) => (prev * sessionCorrect + elapsedMs) / (sessionCorrect + 1));
      }
      setWeights((prev) => {
        const next = focusOnly ? prev : decayWeights(prev, focusId);
        setTask(pickTask(next));
        return next;
      });
      void finishedTask;
    },
    [recordAnswer, focusId, sessionCorrect, focusOnly],
  );

  const { buffer, wrongFlash, pushDigit, popDigit } = useAutoInput({
    task,
    enabled: true,
    onComplete: handleComplete,
  });
  const isTouch = useIsTouch();

  const handleBack = () => {
    if (sessionAnswered > 0 && !window.confirm(t.confirmExit)) return;
    setScreen('home');
  };

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-8 px-4 py-10">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-slate-800">
            {flatLessons[selectedIdx].titleRu}
          </h1>
          <p className="text-sm text-slate-500">{t.lessons}</p>
        </div>
        <button
          onClick={handleBack}
          className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
        >
          {t.backToMenu}
        </button>
      </header>

      <main className="flex flex-col items-center gap-10 py-10">
        <TaskView task={task} buffer={buffer} wrongFlash={wrongFlash} />
        {isTouch && <Numpad onDigit={pushDigit} onBackspace={popDigit} />}
      </main>

      <footer className="flex justify-center">
        <StatsBar
          correct={sessionCorrect}
          answered={sessionAnswered}
          avgTimeMs={sessionAvgMs}
          focusProbability={weights[focusId]}
        />
      </footer>
    </div>
  );
}
