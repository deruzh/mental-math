import { useCallback, useEffect, useRef, useState } from 'react';
import { useStore } from '../state/store';
import { uniformWeightsAll } from '../scheduler/weights';
import { pickTask } from '../scheduler/pickTask';
import { useAutoInput } from '../input/useAutoInput';
import { TaskView } from './TaskView';
import { Task } from '../generators/types';
import { t } from '../i18n/ru';

const DURATION_MS = 60_000;

export function ChallengeScreen() {
  const setScreen = useStore((s) => s.setScreen);
  const recordAnswer = useStore((s) => s.recordAnswer);
  const recordChallengeScore = useStore((s) => s.recordChallengeScore);
  const bestScore = useStore((s) => s.bestChallengeScore);

  const weightsRef = useRef(uniformWeightsAll());
  const [task, setTask] = useState<Task | null>(() => pickTask(weightsRef.current));
  const [score, setScore] = useState(0);
  const [answered, setAnswered] = useState(0);
  const [avgMs, setAvgMs] = useState(0);
  const [remaining, setRemaining] = useState(DURATION_MS);
  const [finished, setFinished] = useState(false);
  const startedAtRef = useRef<number>(Date.now());
  const newBestRef = useRef(false);

  useEffect(() => {
    startedAtRef.current = Date.now();
    const interval = setInterval(() => {
      const elapsed = Date.now() - startedAtRef.current;
      const left = Math.max(0, DURATION_MS - elapsed);
      setRemaining(left);
      if (left <= 0) {
        clearInterval(interval);
        setFinished(true);
      }
    }, 100);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (finished) {
      const isBest = score > bestScore;
      newBestRef.current = isBest;
      recordChallengeScore(score);
    }
  }, [finished, score, bestScore, recordChallengeScore]);

  const handleComplete = useCallback(
    (_finished: Task, elapsedMs: number, isCorrect: boolean) => {
      recordAnswer(isCorrect, elapsedMs);
      setAnswered((a) => a + 1);
      if (isCorrect) {
        setScore((s) => s + 1);
        setAvgMs((prev) => (prev * score + elapsedMs) / (score + 1));
      }
      setTask(pickTask(weightsRef.current));
    },
    [recordAnswer, score],
  );

  const { buffer, wrongFlash } = useAutoInput({
    task,
    enabled: !finished,
    onComplete: handleComplete,
  });

  const restart = () => {
    weightsRef.current = uniformWeightsAll();
    setTask(pickTask(weightsRef.current));
    setScore(0);
    setAnswered(0);
    setAvgMs(0);
    setRemaining(DURATION_MS);
    setFinished(false);
    startedAtRef.current = Date.now();
  };

  const seconds = Math.ceil(remaining / 1000);

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-8 px-4 py-10">
      <header className="flex items-center justify-between">
        <button
          onClick={() => setScreen('home')}
          className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
        >
          {t.back}
        </button>
        <div className="flex gap-6 text-sm">
          <Pill label={t.timeLeft} value={`${seconds} ${t.seconds}`} highlight={seconds <= 10} />
          <Pill label={t.score} value={String(score)} />
        </div>
      </header>

      <main className="flex flex-col items-center gap-10 py-10">
        {finished ? (
          <Summary
            score={score}
            answered={answered}
            avgMs={avgMs}
            bestScore={bestScore}
            newBest={newBestRef.current}
            onRestart={restart}
            onExit={() => setScreen('home')}
          />
        ) : (
          <TaskView task={task} buffer={buffer} wrongFlash={wrongFlash} />
        )}
      </main>
    </div>
  );
}

function Pill({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div
      className={[
        'flex flex-col items-center rounded-lg border px-4 py-1.5',
        highlight ? 'border-red-400 bg-red-50 text-red-600' : 'border-slate-300 bg-white',
      ].join(' ')}
    >
      <span className="text-xs uppercase tracking-wider text-slate-400">{label}</span>
      <span className="font-semibold">{value}</span>
    </div>
  );
}

function Summary({
  score,
  answered,
  avgMs,
  bestScore,
  newBest,
  onRestart,
  onExit,
}: {
  score: number;
  answered: number;
  avgMs: number;
  bestScore: number;
  newBest: boolean;
  onRestart: () => void;
  onExit: () => void;
}) {
  return (
    <div className="flex w-full max-w-md flex-col items-center gap-4 rounded-2xl border border-slate-200 bg-white p-8 shadow-lg">
      <h2 className="text-2xl font-bold text-slate-800">{t.done}</h2>
      <div className="text-center">
        <p className="text-sm text-slate-500">{t.yourScore}</p>
        <p className="text-5xl font-bold text-blue-600">{score}</p>
        {newBest && <p className="mt-1 text-sm font-semibold text-green-600">{t.newBest}</p>}
      </div>
      <div className="grid w-full grid-cols-2 gap-3 text-center text-sm text-slate-600">
        <div className="rounded-lg bg-slate-50 p-3">
          <div className="text-xs text-slate-400">{t.totalAnswered}</div>
          <div className="font-semibold text-slate-800">{answered}</div>
        </div>
        <div className="rounded-lg bg-slate-50 p-3">
          <div className="text-xs text-slate-400">{t.avgTime}</div>
          <div className="font-semibold text-slate-800">
            {avgMs > 0 ? `${(avgMs / 1000).toFixed(1)} ${t.seconds}` : '—'}
          </div>
        </div>
      </div>
      <p className="text-xs text-slate-400">
        {t.bestScore}: {bestScore}
      </p>
      <div className="flex gap-3">
        <button
          onClick={onRestart}
          className="rounded-lg bg-blue-600 px-5 py-2 font-semibold text-white hover:bg-blue-700"
        >
          {t.playAgain}
        </button>
        <button
          onClick={onExit}
          className="rounded-lg border border-slate-300 bg-white px-5 py-2 text-slate-700 hover:bg-slate-50"
        >
          {t.backToMenu}
        </button>
      </div>
    </div>
  );
}
