import { Generator, Task, randInt } from './types';

export function makeAddition(digits: 1 | 2): Generator {
  const id = `addition-${digits}`;
  const min = digits === 1 ? 2 : 10;
  const max = digits === 1 ? 9 : 99;
  return {
    id,
    generate(): Task {
      const a = randInt(min, max);
      const b = randInt(min, max);
      return { prompt: `${a} + ${b}`, answer: a + b, generatorId: id };
    },
  };
}
