import { Generator, Task, randInt } from './types';

const decomposable = [
  18, 21, 22, 24, 25, 27, 28, 32, 33, 35, 36, 42, 44, 45, 48, 49,
  54, 55, 56, 63, 64, 66, 72, 77, 81, 88, 99,
];

export function makeMultiplicationFactor(): Generator {
  const id = 'multiplication-factor';
  return {
    id,
    generate(): Task {
      const b = decomposable[randInt(0, decomposable.length - 1)];
      const a = randInt(12, 99);
      const [left, right] = Math.random() < 0.5 ? [a, b] : [b, a];
      return { prompt: `${left} × ${right}`, answer: a * b, generatorId: id };
    },
  };
}
