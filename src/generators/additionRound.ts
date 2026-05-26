import { Generator, Task, randInt } from './types';

export function makeAdditionRound(): Generator {
  const id = 'addition-round';
  return {
    id,
    generate(): Task {
      const leftDigits = randInt(1, 3);
      const a = randInt(Math.pow(10, leftDigits - 1), Math.pow(10, leftDigits) - 1);
      const rightDigits = randInt(1, leftDigits);
      const b = randInt(1, 9) * Math.pow(10, rightDigits - 1);
      return { prompt: `${a} + ${b}`, answer: a + b, generatorId: id };
    },
  };
}
