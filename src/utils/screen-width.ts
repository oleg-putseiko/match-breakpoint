import { type BreakpointData } from '@/types/breakpoints';

export const ensurePx = (data: BreakpointData) => {
  if (typeof data === 'string') return data;

  if (typeof data === 'number') return `${data}px`;

  if (typeof data.value === 'string') return data.value;

  return `${data.value}px`;
};
