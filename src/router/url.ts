import type { Screen } from '../state/store';
import { flatLessons } from '../lessons';

export interface Route {
  screen: Screen;
  lessonIdx?: number;
}

export function parseHash(hash: string): Route {
  const path = hash.replace(/^#/, '').replace(/^\/+/, '');
  if (path === '') return { screen: 'home' };
  if (path === 'challenge') return { screen: 'challenge' };
  if (path.startsWith('lesson/')) {
    const id = decodeURIComponent(path.slice('lesson/'.length));
    const idx = flatLessons.findIndex((l) => l.id === id);
    if (idx >= 0) return { screen: 'lesson', lessonIdx: idx };
  }
  return { screen: 'home' };
}

export function formatHash(route: Route): string {
  if (route.screen === 'challenge') return '#/challenge';
  if (route.screen === 'lesson' && route.lessonIdx != null) {
    const id = flatLessons[route.lessonIdx]?.id;
    if (id) return `#/lesson/${encodeURIComponent(id)}`;
  }
  return '#/';
}
