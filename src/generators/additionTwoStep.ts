import { Generator, Task, randInt } from './types';

export function makeAdditionTwoStep(): Generator {
  const id = 'addition-twostep';
  return {
    id,
    generate(): Task {
      const useMethod1 = Math.random() < 0.5;
      let a: number, b: number;

      if (useMethod1) {
        const hundreds = randInt(2, 11);
        const round = hundreds * 100;
        const gap = randInt(4, 25);
        a = round - gap;
        const remainder = randInt(10, 180);
        b = gap + remainder;
      } else {
        const hundreds = randInt(2, 10);
        const round = hundreds * 100;
        const excess = randInt(2, 15);
        b = round - excess;
        a = randInt(150, 900);
      }

      return { prompt: `${a} + ${b}`, answer: a + b, generatorId: id };
    },
  };
}
