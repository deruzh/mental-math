import { Generator } from './types';
import { makeAddition } from './addition';
import { makeAdditionRound } from './additionRound';
import { makeSubtraction } from './subtraction';
import { makeMultiplication } from './multiplication';
import { makeDivision } from './division';

export const generators: Generator[] = [
  makeAddition(1),
  makeAdditionRound(),
  makeSubtraction(1),
  makeSubtraction(2),
  makeMultiplication(1),
  makeMultiplication(2),
  makeDivision(1),
  makeDivision(2),
];

export const generatorById: Record<string, Generator> = Object.fromEntries(
  generators.map((g) => [g.id, g]),
);
