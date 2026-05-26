import { useCallback, useEffect, useRef, useState } from 'react';
import { Task } from '../generators/types';

interface Options {
  task: Task | null;
  enabled: boolean;
  onComplete: (task: Task, elapsedMs: number, isCorrect: boolean) => void;
}

export function useAutoInput({ task, enabled, onComplete }: Options) {
  const [buffer, setBuffer] = useState('');
  const [wrongFlash, setWrongFlash] = useState(false);
  const startTimeRef = useRef<number>(Date.now());
  const hadWrongRef = useRef<boolean>(false);

  useEffect(() => {
    setBuffer('');
    setWrongFlash(false);
    startTimeRef.current = Date.now();
    hadWrongRef.current = false;
  }, [task]);

  const pushDigit = useCallback(
    (digit: string) => {
      if (!enabled || !task) return;
      if (!/^[0-9]$/.test(digit)) return;
      const answerStr = String(task.answer);
      setBuffer((b) => {
        const next = b + digit;
        if (next === answerStr) {
          const elapsed = Date.now() - startTimeRef.current;
          const isCorrect = !hadWrongRef.current;
          queueMicrotask(() => onComplete(task, elapsed, isCorrect));
          return '';
        }
        if (next.length >= answerStr.length) {
          setWrongFlash(true);
          hadWrongRef.current = true;
        } else {
          setWrongFlash(false);
        }
        return next;
      });
    },
    [task, enabled, onComplete],
  );

  const popDigit = useCallback(() => {
    if (!enabled || !task) return;
    setWrongFlash(false);
    setBuffer((b) => b.slice(0, -1));
  }, [task, enabled]);

  useEffect(() => {
    if (!enabled || !task) return;

    const handler = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return;

      if (e.key === 'Backspace') {
        e.preventDefault();
        popDigit();
        return;
      }

      if (/^[0-9]$/.test(e.key)) {
        e.preventDefault();
        pushDigit(e.key);
      }
    };

    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [task, enabled, pushDigit, popDigit]);

  return { buffer, wrongFlash, pushDigit, popDigit };
}
