import { modules, flatLessons } from '../lessons';
import { t } from '../i18n/ru';

interface Props {
  selectedIdx: number;
  onPick: (idx: number) => void;
}

export function LessonPicker({ selectedIdx, onPick }: Props) {
  return (
    <div className="flex flex-col gap-6">
      <p className="text-sm text-slate-500">{t.lessonPickerHint}</p>
      <div className="grid gap-4">
        {modules.map((m) => (
          <div key={m.id} className="rounded-xl border border-slate-200 bg-white p-4">
            <h3 className="mb-3 text-lg font-semibold text-slate-700">{m.titleRu}</h3>
            <div className="flex flex-wrap gap-2">
              {m.lessons.map((l) => {
                const idx = flatLessons.findIndex((x) => x.id === l.id);
                const unlocked = idx <= selectedIdx;
                const isSelected = idx === selectedIdx;
                return (
                  <button
                    key={l.id}
                    onClick={() => onPick(idx)}
                    className={[
                      'rounded-lg border px-4 py-2 text-sm transition-colors',
                      isSelected
                        ? 'border-blue-500 bg-blue-500 text-white'
                        : unlocked
                          ? 'border-slate-300 bg-slate-50 text-slate-700 hover:border-blue-400'
                          : 'border-slate-200 bg-slate-50 text-slate-400 hover:border-blue-300',
                    ].join(' ')}
                  >
                    <div className="font-medium">{l.titleRu}</div>
                    <div className="text-xs opacity-80">
                      {isSelected ? t.current : unlocked ? t.unlocked : t.locked}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
