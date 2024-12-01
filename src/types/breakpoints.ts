export type MatchTo = 'min' | 'max';

export type ScreenSizeData = {
  min: string | number;
  max: string | number;
};

export type BreakpointData = number | string | ScreenSizeData;

export interface Breakpoints {}

export type ScreenSize = keyof Breakpoints extends never
  ? string
  : keyof Breakpoints;
