import { Generator, Task, randInt } from './types';

export function makeMultiplication(digits: 1 | 2): Generator {
  const id = `multiplication-${digits}`;
  return {
    id,
    generate(): Task {
      const a = digits === 1 ? randInt(2, 9) : randInt(10, 99);
      const b = randInt(2, 9);
      return { prompt: `${a} × ${b}`, answer: a * b, generatorId: id };
    },
  };
}
