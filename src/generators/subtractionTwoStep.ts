import { Generator, Task, randInt } from './types';

export function makeSubtractionTwoStep(): Generator {
  const id = 'subtraction-twostep';
  return {
    id,
    generate(): Task {
      const useMethod1 = Math.random() < 0.5;
      let a: number, b: number;

      if (useMethod1) {
        const hundreds = randInt(2, 11);
        const round = hundreds * 100;
        const gap = randInt(4, 25);
        a = round + gap;
        const remainder = randInt(10, 180);
        b = gap + remainder;
      } else {
        const hundreds = randInt(2, 10);
        const round = hundreds * 100;
        const excess = randInt(2, 15);
        b = round - excess;
        a = randInt(b + 10, b + 500);
      }

      return { prompt: `${a} − ${b}`, answer: a - b, generatorId: id };
    },
  };
}
