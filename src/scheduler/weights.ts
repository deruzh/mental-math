import { flatLessons } from '../lessons';
import { generators } from '../generators/registry';

export const DECAY_TASKS = 20;

export function unlockedGeneratorIds(selectedIdx: number): string[] {
  return flatLessons.slice(0, selectedIdx + 1).map((l) => l.generatorId);
}

export function initialWeights(selectedIdx: number): Record<string, number> {
  const ids = unlockedGeneratorIds(selectedIdx);
  const focusId = ids[ids.length - 1];
  const weights: Record<string, number> = {};
  for (const id of ids) weights[id] = id === focusId ? 1 : 0;
  return weights;
}

export function uniformWeights(selectedIdx: number): Record<string, number> {
  const ids = unlockedGeneratorIds(selectedIdx);
  const w: Record<string, number> = {};
  const each = 1 / ids.length;
  for (const id of ids) w[id] = each;
  return w;
}

export function uniformWeightsAll(): Record<string, number> {
  const w: Record<string, number> = {};
  const each = 1 / generators.length;
  for (const g of generators) w[g.id] = each;
  return w;
}

export function decayWeights(
  weights: Record<string, number>,
  focusId: string,
): Record<string, number> {
  const ids = Object.keys(weights);
  const n = ids.length;
  if (n <= 1) return weights;
  const baseline = 1 / n;
  const step = (1 - baseline) / DECAY_TASKS;
  const currentFocus = weights[focusId] ?? baseline;
  const nextFocus = Math.max(baseline, currentFocus - step);
  const othersTotal = 1 - nextFocus;
  const perOther = othersTotal / (n - 1);
  const next: Record<string, number> = {};
  for (const id of ids) next[id] = id === focusId ? nextFocus : perOther;
  return next;
}
