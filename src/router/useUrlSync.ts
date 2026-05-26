import { useEffect } from 'react';
import { useStore } from '../state/store';
import { parseHash, formatHash } from './url';

export function useUrlSync() {
  const screen = useStore((s) => s.screen);
  const selectedLessonIdx = useStore((s) => s.selectedLessonIdx);
  const setScreen = useStore((s) => s.setScreen);
  const setSelectedLessonIdx = useStore((s) => s.setSelectedLessonIdx);

  useEffect(() => {
    const target = formatHash({ screen, lessonIdx: selectedLessonIdx });
    const current = window.location.hash || '#/';
    if (current === target) return;
    history.pushState(null, '', target);
  }, [screen, selectedLessonIdx]);

  useEffect(() => {
    const apply = () => {
      const route = parseHash(window.location.hash);
      if (route.lessonIdx != null) setSelectedLessonIdx(route.lessonIdx);
      setScreen(route.screen);
    };
    window.addEventListener('popstate', apply);
    window.addEventListener('hashchange', apply);
    return () => {
      window.removeEventListener('popstate', apply);
      window.removeEventListener('hashchange', apply);
    };
  }, [setScreen, setSelectedLessonIdx]);
}
