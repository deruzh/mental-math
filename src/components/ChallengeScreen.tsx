import { useCallback, useEffect, useRef, useState } from 'react';
import { useStore } from '../state/store';
import { uniformWeightsAll } from '../scheduler/weights';
import { pickTask } from '../scheduler/pickTask';
import { useAutoInput } from '../input/useAutoInput';
import { useIsTouch } from '../input/useIsTouch';
import { TaskView } from './TaskView';
import { Numpad } from './Numpad';
import { Task } from '../generators/types';
import { t } from '../i18n/ru';

const DURATION_MS = 60_000;
const BASE_POINTS = 100;
const MAX_SPEED_BONUS = 500;
const FAST_THRESHOLD_MS = 5_000;
const STREAK_MULTIPLIER_STEP = 0.1;
const MAX_STREAK_MULTIPLIER = 3;

function computePoints(elapsedMs: number, streakAfter: number) {
  const speedBonus = Math.max(
    0,
    Math.round((MAX_SPEED_BONUS * (FAST_THRESHOLD_MS - elapsedMs)) / FAST_THRESHOLD_MS),
  );
  const multiplier = Math.min(
    MAX_STREAK_MULTIPLIER,
    1 + Math.max(0, streakAfter - 1) * STREAK_MULTIPLIER_STEP,
  );
  return {
    points: Math.round((BASE_POINTS + speedBonus) * multiplier),
    multiplier,
  };
}

export function ChallengeScreen() {
  const setScreen = useStore((s) => s.setScreen);
  const recordAnswer = useStore((s) => s.recordAnswer);
  const recordChallengeScore = useStore((s) => s.recordChallengeScore);
  const bestScore = useStore((s) => s.bestChallengeScore);

  const weightsRef = useRef(uniformWeightsAll());
  const [task, setTask] = useState<Task | null>(() => pickTask(weightsRef.current));
  const [score, setScore] = useState(0);
  const [answered, setAnswered] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [streak, setStreak] = useState(0);
  const [maxStreak, setMaxStreak] = useState(0);
  const [avgMs, setAvgMs] = useState(0);
  const [remaining, setRemaining] = useState(DURATION_MS);
  const [finished, setFinished] = useState(false);
  const startedAtRef = useRef<number>(Date.now());
  const newBestRef = useRef(false);
  const streakRef = useRef(0);
  const correctCountRef = useRef(0);
  const totalElapsedRef = useRef(0);

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
        const newStreak = streakRef.current + 1;
        streakRef.current = newStreak;
        setStreak(newStreak);
        setMaxStreak((m) => Math.max(m, newStreak));

        const { points } = computePoints(elapsedMs, newStreak);
        setScore((s) => s + points);

        correctCountRef.current += 1;
        totalElapsedRef.current += elapsedMs;
        setCorrectCount(correctCountRef.current);
        setAvgMs(totalElapsedRef.current / correctCountRef.current);
      } else {
        streakRef.current = 0;
        setStreak(0);
      }
      setTask(pickTask(weightsRef.current));
    },
    [recordAnswer],
  );

  const { buffer, wrongFlash, pushDigit, popDigit } = useAutoInput({
    task,
    enabled: !finished,
    onComplete: handleComplete,
  });
  const isTouch = useIsTouch();

  const restart = () => {
    weightsRef.current = uniformWeightsAll();
    setTask(pickTask(weightsRef.current));
    setScore(0);
    setAnswered(0);
    setCorrectCount(0);
    setStreak(0);
    setMaxStreak(0);
    setAvgMs(0);
    setRemaining(DURATION_MS);
    setFinished(false);
    startedAtRef.current = Date.now();
    streakRef.current = 0;
    correctCountRef.current = 0;
    totalElapsedRef.current = 0;
  };

  const seconds = Math.ceil(remaining / 1000);
  const currentMultiplier = computePoints(0, Math.max(1, streak)).multiplier;

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-8 px-4 py-10">
      <header className="flex items-center justify-between">
        <button
          onClick={() => setScreen('home')}
          className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
        >
          {t.back}
        </button>
        <div className="flex gap-3 text-sm sm:gap-6">
          <Pill label={t.timeLeft} value={`${seconds} ${t.seconds}`} highlight={seconds <= 10} />
          <Pill label={t.score} value={score.toLocaleString('ru-RU')} />
          {streak >= 2 && (
            <Pill
              label={t.streak}
              value={`×${streak} · ${currentMultiplier.toFixed(1)}x`}
              accent
            />
          )}
        </div>
      </header>

      <main className="flex flex-col items-center gap-10 py-10">
        {finished ? (
          <Summary
            score={score}
            answered={answered}
            correctCount={correctCount}
            maxStreak={maxStreak}
            avgMs={avgMs}
            bestScore={bestScore}
            newBest={newBestRef.current}
            onRestart={restart}
            onExit={() => setScreen('home')}
          />
        ) : (
          <>
            <TaskView task={task} buffer={buffer} wrongFlash={wrongFlash} />
            {isTouch && <Numpad onDigit={pushDigit} onBackspace={popDigit} />}
          </>
        )}
      </main>
    </div>
  );
}

function Pill({
  label,
  value,
  highlight,
  accent,
}: {
  label: string;
  value: string;
  highlight?: boolean;
  accent?: boolean;
}) {
  const tone = highlight
    ? 'border-red-400 bg-red-50 text-red-600'
    : accent
      ? 'border-amber-400 bg-amber-50 text-amber-700'
      : 'border-slate-300 bg-white';
  return (
    <div className={`flex flex-col items-center rounded-lg border px-4 py-1.5 ${tone}`}>
      <span className="text-xs uppercase tracking-wider text-slate-400">{label}</span>
      <span className="font-semibold">{value}</span>
    </div>
  );
}

function Summary({
  score,
  answered,
  correctCount,
  maxStreak,
  avgMs,
  bestScore,
  newBest,
  onRestart,
  onExit,
}: {
  score: number;
  answered: number;
  correctCount: number;
  maxStreak: number;
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
        <p className="text-6xl font-extrabold text-blue-600 tracking-tight">
          {score.toLocaleString('ru-RU')}
        </p>
        {newBest && <p className="mt-1 text-sm font-semibold text-green-600">{t.newBest}</p>}
      </div>
      <div className="grid w-full grid-cols-2 gap-3 text-center text-sm text-slate-600">
        <div className="rounded-lg bg-slate-50 p-3">
          <div className="text-xs text-slate-400">{t.correct}</div>
          <div className="font-semibold text-slate-800">
            {correctCount} / {answered}
          </div>
        </div>
        <div className="rounded-lg bg-slate-50 p-3">
          <div className="text-xs text-slate-400">{t.maxStreak}</div>
          <div className="font-semibold text-slate-800">×{maxStreak}</div>
        </div>
        <div className="rounded-lg bg-slate-50 p-3">
          <div className="text-xs text-slate-400">{t.avgTime}</div>
          <div className="font-semibold text-slate-800">
            {avgMs > 0 ? `${(avgMs / 1000).toFixed(1)} ${t.seconds}` : '—'}
          </div>
        </div>
        <div className="rounded-lg bg-slate-50 p-3">
          <div className="text-xs text-slate-400">{t.bestScore}</div>
          <div className="font-semibold text-slate-800">{bestScore.toLocaleString('ru-RU')}</div>
        </div>
      </div>
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
