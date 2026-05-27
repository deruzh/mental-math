import { Generator, Task, randInt } from './types';

export function makeSubtractionRound(): Generator {
  const id = 'subtraction-round';
  return {
    id,
    generate(): Task {
      const leftDigits = randInt(1, 3);
      let a = randInt(Math.pow(10, leftDigits - 1), Math.pow(10, leftDigits) - 1);
      const rightDigits = randInt(1, leftDigits);
      let b = randInt(1, 9) * Math.pow(10, rightDigits - 1);
      if (b > a) [a, b] = [b, a];
      return { prompt: `${a} − ${b}`, answer: a - b, generatorId: id };
    },
  };
}
