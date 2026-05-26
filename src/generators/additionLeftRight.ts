import { Generator, Task, randInt } from './types';

export function makeAdditionLeftRight(): Generator {
  const id = 'addition-leftright';
  return {
    id,
    generate(): Task {
      const r = Math.random();
      const leftDigits = r < 0.45 ? 2 : r < 0.9 ? 3 : 4;
      const rightDigits = randInt(2, leftDigits);
      const a = randInt(Math.pow(10, leftDigits - 1), Math.pow(10, leftDigits) - 1);
      let b = 0;
      for (let i = 0; i < rightDigits; i++) {
        b = b * 10 + randInt(1, 9);
      }
      return { prompt: `${a} + ${b}`, answer: a + b, generatorId: id };
    },
  };
}
