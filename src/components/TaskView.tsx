import { Task } from '../generators/types';

interface Props {
  task: Task | null;
  buffer: string;
  wrongFlash: boolean;
}

export function TaskView({ task, buffer, wrongFlash }: Props) {
  if (!task) return null;
  return (
    <div className="flex flex-col items-center gap-6">
      <div className="text-6xl font-light tracking-wide text-slate-800 select-none">
        {task.prompt}
      </div>
      <div
        className={[
          'min-w-[12rem] min-h-[5rem] px-8 py-3 rounded-2xl border-4 flex items-center justify-center text-5xl font-mono transition-colors',
          wrongFlash
            ? 'border-red-500 bg-red-50 text-red-600'
            : 'border-slate-300 bg-white text-slate-800',
        ].join(' ')}
      >
        {buffer || <span className="text-slate-300">_</span>}
      </div>
    </div>
  );
}
