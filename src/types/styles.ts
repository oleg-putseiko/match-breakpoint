export type CSSPresetName = 'tailwind';

type ClassDictionary = Record<string, unknown>;
type ClassArray = ClassValue[];
type ClassValue =
  | ClassArray
  | ClassDictionary
  | string
  | number
  | null
  | boolean
  | undefined;

export type MergeClassesFunction = (...classes: ClassValue[]) => string;
