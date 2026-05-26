import { useEffect, useState } from 'react';

export function useIsTouch(): boolean {
  const [isTouch, setIsTouch] = useState<boolean>(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return false;
    return window.matchMedia('(hover: none) and (pointer: coarse)').matches;
  });

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;
    const mq = window.matchMedia('(hover: none) and (pointer: coarse)');
    const onChange = (e: MediaQueryListEvent) => setIsTouch(e.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  return isTouch;
}
