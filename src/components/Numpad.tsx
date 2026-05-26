interface Props {
  onDigit: (digit: string) => void;
  onBackspace: () => void;
  disabled?: boolean;
}

const KEYS = ['1', '2', '3', '4', '5', '6', '7', '8', '9'];

export function Numpad({ onDigit, onBackspace, disabled }: Props) {
  const handleDigit = (d: string) => (e: React.PointerEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (disabled) return;
    onDigit(d);
  };
  const handleBackspace = (e: React.PointerEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (disabled) return;
    onBackspace();
  };

  return (
    <div
      className="grid w-full max-w-xs grid-cols-3 gap-3 select-none"
      style={{ touchAction: 'manipulation' }}
    >
      {KEYS.map((k) => (
        <button
          key={k}
          type="button"
          onPointerDown={handleDigit(k)}
          disabled={disabled}
          className="rounded-2xl border border-slate-300 bg-white py-5 text-3xl font-semibold text-slate-800 shadow-sm active:bg-slate-200 disabled:opacity-50"
        >
          {k}
        </button>
      ))}
      <button
        type="button"
        onPointerDown={handleBackspace}
        disabled={disabled}
        aria-label="Backspace"
        className="rounded-2xl border border-slate-300 bg-white py-5 text-2xl font-semibold text-slate-600 shadow-sm active:bg-slate-200 disabled:opacity-50"
      >
        ⌫
      </button>
      <button
        key="0"
        type="button"
        onPointerDown={handleDigit('0')}
        disabled={disabled}
        className="rounded-2xl border border-slate-300 bg-white py-5 text-3xl font-semibold text-slate-800 shadow-sm active:bg-slate-200 disabled:opacity-50"
      >
        0
      </button>
      <div />
    </div>
  );
}
