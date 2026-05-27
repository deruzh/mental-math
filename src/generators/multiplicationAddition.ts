import { Generator, Task, randInt } from './types';

export function makeMultiplicationAddition(): Generator {
  const id = 'multiplication-addition';
  return {
    id,
    generate(): Task {
      // ~30%: special "50" exception — one number in 50-59, the other even
      if (Math.random() < 0.3) {
        const fiftyNum = 50 + randInt(1, 9);
        let evenNum: number;
        do {
          const tens = randInt(1, 9);
          const units = [2, 4, 6, 8][randInt(0, 3)];
          evenNum = tens * 10 + units;
        } while (evenNum >= 50 && evenNum <= 59);
        const swap = Math.random() < 0.5;
        const a = swap ? evenNum : fiftyNum;
        const b = swap ? fiftyNum : evenNum;
        return { prompt: `${a} × ${b}`, answer: a * b, generatorId: id };
      }
      // Basic case: two 2-digit numbers, neither ending in 0, different last digits
      let a: number, b: number;
      do {
        a = randInt(11, 99);
        b = randInt(11, 99);
      } while (a % 10 === 0 || b % 10 === 0 || a % 10 === b % 10);
      return { prompt: `${a} × ${b}`, answer: a * b, generatorId: id };
    },
  };
}
