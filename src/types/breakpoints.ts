export type MatchTo = 'min' | 'max';

type BreakpointDataDetails = {
  min: string | number;
  max: string | number;
  minClassName?: string;
  maxClassName?: string;
};

export type BreakpointData = number | string | BreakpointDataDetails;

export interface Breakpoints {}

export type ScreenSize = keyof Breakpoints extends never
  ? string
  : keyof Breakpoints;
