import { t } from '../i18n/ru';

export interface Lesson {
  id: string;
  titleRu: string;
  generatorId: string;
}

export interface Module {
  id: string;
  titleRu: string;
  lessons: Lesson[];
}

export const modules: Module[] = [
  {
    id: 'addition',
    titleRu: t.modAddition,
    lessons: [
      { id: 'addition-1', titleRu: t.oneDigitAdd, generatorId: 'addition-1' },
      { id: 'addition-round', titleRu: t.additionRound, generatorId: 'addition-round' },
      { id: 'addition-leftright', titleRu: t.additionLeftRight, generatorId: 'addition-leftright' },
      { id: 'addition-twostep', titleRu: t.additionTwoStep, generatorId: 'addition-twostep' },
      { id: 'addition-blocks', titleRu: t.additionBlocks, generatorId: 'addition-blocks' },
    ],
  },
  {
    id: 'subtraction',
    titleRu: t.modSubtraction,
    lessons: [
      { id: 'subtraction-1', titleRu: t.oneDigitSubtract, generatorId: 'subtraction-1' },
      { id: 'subtraction-round', titleRu: t.subtractionRound, generatorId: 'subtraction-round' },
      { id: 'subtraction-leftright', titleRu: t.subtractionLeftRight, generatorId: 'subtraction-leftright' },
      { id: 'subtraction-twostep', titleRu: t.subtractionTwoStep, generatorId: 'subtraction-twostep' },
      { id: 'subtraction-blocks', titleRu: t.subtractionBlocks, generatorId: 'subtraction-blocks' },
    ],
  },
  {
    id: 'multiplication',
    titleRu: t.modMultiplication,
    lessons: [
      { id: 'multiplication-1', titleRu: t.oneDigitMultiply, generatorId: 'multiplication-1' },
      { id: 'multiplication-2', titleRu: t.multiplicationTwoByOne, generatorId: 'multiplication-2' },
      { id: 'multiplication-round', titleRu: t.multiplicationRound, generatorId: 'multiplication-round' },
      { id: 'multiplication-addition', titleRu: t.multiplicationAddition, generatorId: 'multiplication-addition' },
      { id: 'multiplication-subtraction', titleRu: t.multiplicationSubtraction, generatorId: 'multiplication-subtraction' },
    ],
  },
  {
    id: 'division',
    titleRu: t.modDivision,
    lessons: [
      { id: 'division-1', titleRu: t.oneDigitDivide, generatorId: 'division-1' },
      { id: 'division-2', titleRu: t.twoDigit, generatorId: 'division-2' },
    ],
  },
];

export const flatLessons: Lesson[] = modules.flatMap((m) => m.lessons);

export function moduleOf(lessonIdx: number): Module {
  let cursor = 0;
  for (const m of modules) {
    if (lessonIdx < cursor + m.lessons.length) return m;
    cursor += m.lessons.length;
  }
  return modules[0];
}
