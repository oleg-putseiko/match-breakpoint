export type MatchTo = 'min' | 'max';

export type ScreenSize = string;

export type ScreenSizeData = {
  min: string | number;
  max: string | number;
};

export type Breakpoints = Record<ScreenSize, number | string | ScreenSizeData>;

export type BreakpointData = Breakpoints[ScreenSize];
