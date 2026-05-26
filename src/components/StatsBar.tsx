import { t } from '../i18n/ru';
import { formatMs } from '../utils/formatTime';

interface Props {
  correct: number;
  answered: number;
  avgTimeMs: number;
  focusProbability?: number;
}

export function StatsBar({ correct, answered, avgTimeMs, focusProbability }: Props) {
  return (
    <div className="flex gap-6 text-sm text-slate-600">
      <Stat label={t.correct} value={`${correct} / ${answered}`} />
      <Stat label={t.avgTime} value={formatMs(avgTimeMs)} />
      {focusProbability !== undefined && (
        <Stat label={t.focusProbability} value={`${Math.round(focusProbability * 100)}%`} />
      )}
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col items-center">
      <span className="text-xs uppercase tracking-wider text-slate-400">{label}</span>
      <span className="font-semibold text-slate-700">{value}</span>
    </div>
  );
}
