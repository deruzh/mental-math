import { Generator, Task, randInt } from './types';

export function makeAdditionBlocks(): Generator {
  const id = 'addition-blocks';
  return {
    id,
    generate(): Task {
      const r = Math.random();
      let a: number, b: number;
      if (r < 0.8) {
        a = randInt(1000, 9999);
        b = randInt(1000, 9999);
      } else if (r < 0.9) {
        a = randInt(10000, 99999);
        b = randInt(10000, 99999);
      } else {
        a = randInt(100000, 999999);
        b = randInt(100000, 999999);
      }
      return { prompt: `${a} + ${b}`, answer: a + b, generatorId: id };
    },
  };
}
