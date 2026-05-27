import { Generator, Task, randInt } from './types';

export function makeMultiplicationEleven(): Generator {
  const id = 'multiplication-eleven';
  return {
    id,
    generate(): Task {
      const useThreeDigit = Math.random() < 0.4;
      const a = useThreeDigit ? randInt(100, 999) : randInt(12, 99);
      return { prompt: `${a} × 11`, answer: a * 11, generatorId: id };
    },
  };
}
