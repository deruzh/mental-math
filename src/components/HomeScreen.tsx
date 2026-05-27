import { useStore } from '../state/store';
import { LessonPicker } from './LessonPicker';
import { t } from '../i18n/ru';
import { formatMs } from '../utils/formatTime';

export function HomeScreen() {
  const setScreen = useStore((s) => s.setScreen);
  const selectedLessonIdx = useStore((s) => s.selectedLessonIdx);
  const setSelectedLessonIdx = useStore((s) => s.setSelectedLessonIdx);
  const stats = useStore((s) => s.stats);
  const bestScore = useStore((s) => s.bestChallengeScore);
  const focusOnly = useStore((s) => s.focusOnly);
  const setFocusOnly = useStore((s) => s.setFocusOnly);

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-8 px-4 py-10">
      <header className="flex flex-col gap-1">
        <h1 className="text-3xl font-bold text-slate-800">{t.appTitle}</h1>
      </header>

      <section className="rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 p-6 text-white shadow-lg">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-2xl font-semibold">{t.challenge}</h2>
            <p className="mt-1 text-sm text-white/80">{t.challengeDescription}</p>
            <p className="mt-3 text-sm">
              {t.bestScore}: <span className="font-semibold">{bestScore}</span>
            </p>
          </div>
          <button
            onClick={() => setScreen('challenge')}
            className="rounded-lg bg-white px-5 py-2.5 font-semibold text-blue-600 shadow hover:bg-slate-50"
          >
            {t.startChallenge}
          </button>
        </div>
      </section>

      <section>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-slate-700">{t.lessons}</h2>
          <label className="flex cursor-pointer items-center gap-2 text-sm text-slate-600">
            <input
              type="checkbox"
              checked={focusOnly}
              onChange={(e) => setFocusOnly(e.target.checked)}
              className="h-4 w-4 cursor-pointer accent-blue-600"
            />
            <span title={t.focusOnlyHint}>{t.focusOnlyLabel}</span>
          </label>
        </div>
        <LessonPicker
          selectedIdx={selectedLessonIdx}
          onPick={(idx) => {
            setSelectedLessonIdx(idx);
            setScreen('lesson');
          }}
        />
      </section>

      <section className="rounded-xl border border-slate-200 bg-white p-4 text-sm text-slate-600">
        <h3 className="mb-2 font-semibold text-slate-700">{t.lifetimeStats}</h3>
        <div className="flex gap-6">
          <div>
            {t.correct}:{' '}
            <span className="font-semibold text-slate-800">
              {stats.totalCorrect} / {stats.totalAnswered}
            </span>
          </div>
          <div>
            {t.avgTime}:{' '}
            <span className="font-semibold text-slate-800">{formatMs(stats.avgTimeMs)}</span>
          </div>
        </div>
      </section>
    </div>
  );
}
