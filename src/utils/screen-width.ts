import { type BreakpointData } from '@/types/breakpoints';

export const getMaxScreenWidth = (breakpointData: BreakpointData) => {
  if (typeof breakpointData === 'string') return breakpointData;

  if (typeof breakpointData === 'number') return `${breakpointData}px`;

  if (typeof breakpointData.max === 'string') return breakpointData.max;

  return `${breakpointData.max}px`;
};

export const getMinScreenWidth = (breakpointData: BreakpointData) => {
  if (typeof breakpointData === 'string') return breakpointData;

  if (typeof breakpointData === 'number') return `${breakpointData}px`;

  if (typeof breakpointData.min === 'string') return breakpointData.min;

  return `${breakpointData.min}px`;
};
