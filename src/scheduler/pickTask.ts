import { generatorById } from '../generators/registry';
import { Task } from '../generators/types';

export function pickGeneratorId(weights: Record<string, number>): string {
  const entries = Object.entries(weights);
  const total = entries.reduce((s, [, w]) => s + w, 0);
  let r = Math.random() * total;
  for (const [id, w] of entries) {
    r -= w;
    if (r <= 0) return id;
  }
  return entries[entries.length - 1][0];
}

export function pickTask(weights: Record<string, number>): Task {
  const id = pickGeneratorId(weights);
  return generatorById[id].generate();
}
