import { Generator, Task, randInt } from './types';

export function makeMultiplicationRound(): Generator {
  const id = 'multiplication-round';
  return {
    id,
    generate(): Task {
      const tens = randInt(1, 9);
      const units = randInt(8, 9);
      const a = tens * 10 + units;
      const b = randInt(2, 9);
      return { prompt: `${a} × ${b}`, answer: a * b, generatorId: id };
    },
  };
}
