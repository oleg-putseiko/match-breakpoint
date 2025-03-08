import { type BreakpointData } from '@/types/breakpoints';

export const extractBreakpointValue = (breakpointData: BreakpointData) => {
  if (typeof breakpointData === 'string') return breakpointData;

  if (typeof breakpointData === 'number') return `${breakpointData}px`;

  if (typeof breakpointData.value === 'string') return breakpointData.value;

  return `${breakpointData.value}px`;
};
