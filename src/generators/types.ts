export interface Task {
  prompt: string;
  answer: number;
  generatorId: string;
}

export interface Generator {
  id: string;
  generate(): Task;
}

export function randInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
