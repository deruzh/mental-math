import { Generator, Task, randInt } from './types';

export function makeDivisionTwoDigit(): Generator {
  const id = 'division-twodigit';
  return {
    id,
    generate(): Task {
      const twoDigitQuotient = Math.random() < 0.5;
      let divisor: number;
      let quotient: number;
      if (twoDigitQuotient) {
        divisor = randInt(11, 25);
        quotient = randInt(11, 50);
      } else {
        divisor = randInt(11, 99);
        quotient = randInt(2, 9);
      }
      const dividend = divisor * quotient;
      return { prompt: `${dividend} ÷ ${divisor}`, answer: quotient, generatorId: id };
    },
  };
}
