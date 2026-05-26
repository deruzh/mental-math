import { Generator, Task, randInt } from './types';

export function makeSubtraction(digits: 1 | 2): Generator {
  const id = `subtraction-${digits}`;
  const titleRu = digits === 1 ? 'Вычитание однозначных' : 'Вычитание двузначных';
  const min = digits === 1 ? 2 : 10;
  const max = digits === 1 ? 9 : 99;
  return {
    id,
    titleRu,
    generate(): Task {
      let a = randInt(min, max);
      let b = randInt(min, max);
      if (b > a) [a, b] = [b, a];
      return { prompt: `${a} − ${b}`, answer: a - b, generatorId: id };
    },
  };
}
