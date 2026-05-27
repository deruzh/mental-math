import { Generator, Task, randInt } from './types';

export function makeMultiplicationSubtraction(): Generator {
  const id = 'multiplication-subtraction';
  return {
    id,
    generate(): Task {
      // ~30%: "close to 100" case — one number in 96-99
      let tricky: number;
      if (Math.random() < 0.3) {
        tricky = randInt(96, 99);
      } else {
        // Two-digit ending in 8 or 9
        const tens = randInt(1, 9);
        const units = Math.random() < 0.5 ? 8 : 9;
        tricky = tens * 10 + units;
      }
      // Other operand: two-digit, not ending in 0, not also ending in 8/9
      let other: number;
      do {
        other = randInt(11, 99);
      } while (other % 10 === 0 || other % 10 === 8 || other % 10 === 9);
      const swap = Math.random() < 0.5;
      const a = swap ? other : tricky;
      const b = swap ? tricky : other;
      return { prompt: `${a} × ${b}`, answer: a * b, generatorId: id };
    },
  };
}
