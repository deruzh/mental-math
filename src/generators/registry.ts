import { Generator } from './types';
import { makeAddition } from './addition';
import { makeAdditionRound } from './additionRound';
import { makeAdditionLeftRight } from './additionLeftRight';
import { makeAdditionTwoStep } from './additionTwoStep';
import { makeAdditionBlocks } from './additionBlocks';
import { makeSubtraction } from './subtraction';
import { makeSubtractionRound } from './subtractionRound';
import { makeSubtractionLeftRight } from './subtractionLeftRight';
import { makeSubtractionTwoStep } from './subtractionTwoStep';
import { makeSubtractionBlocks } from './subtractionBlocks';
import { makeMultiplication } from './multiplication';
import { makeMultiplicationRound } from './multiplicationRound';
import { makeMultiplicationAddition } from './multiplicationAddition';
import { makeDivision } from './division';

export const generators: Generator[] = [
  makeAddition(1),
  makeAdditionRound(),
  makeAdditionLeftRight(),
  makeAdditionTwoStep(),
  makeAdditionBlocks(),
  makeSubtraction(1),
  makeSubtractionRound(),
  makeSubtractionLeftRight(),
  makeSubtractionTwoStep(),
  makeSubtractionBlocks(),
  makeMultiplication(1),
  makeMultiplication(2),
  makeMultiplicationRound(),
  makeMultiplicationAddition(),
  makeDivision(1),
  makeDivision(2),
];

export const generatorById: Record<string, Generator> = Object.fromEntries(
  generators.map((g) => [g.id, g]),
);
