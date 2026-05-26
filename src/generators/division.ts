import { Generator, Task, randInt } from './types';

export function makeDivision(digits: 1 | 2): Generator {
  const id = `division-${digits}`;
  return {
    id,
    generate(): Task {
      const divisor = randInt(2, 9);
      const quotient = digits === 1 ? randInt(2, 9) : randInt(10, 20);
      const dividend = divisor * quotient;
      return { prompt: `${dividend} ÷ ${divisor}`, answer: quotient, generatorId: id };
    },
  };
}
