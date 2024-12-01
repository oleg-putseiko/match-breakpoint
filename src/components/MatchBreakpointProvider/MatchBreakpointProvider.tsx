import {
  createContext,
  type FC,
  type ReactNode,
  useContext,
  useMemo,
} from 'react';

import {
  type Breakpoints,
  type MatchTo,
  type ScreenSize,
} from '@/types/breakpoints';
import { type CSSMode, type MergeClassesFunction } from '@/types/styles';

import {
  BreakpointProvider,
  DEFAULT_BREAKPOINT_CONTEXT,
} from '@/components/MatchBreakpointProvider/BreakpointProvider';
import {
  BreakpointsProvider,
  type ContextualizedBreakpoints,
  useBreakpointsContext,
} from '@/components/MatchBreakpointProvider/BreakpointsProvider';

type MatchMediaProviderProps = {
  breakpoints: Breakpoints;
  cssMode?: CSSMode;
  children: ReactNode;
  mergeClassesFunction?: MergeClassesFunction;
};

export const useMatchBreakpoint = (
  size: ScreenSize,
  matchTo: MatchTo = 'min',
  defaultValue = false,
) => {
  const { breakpoints } = useBreakpointsContext();

  const breakpoint = breakpoints[size];

  if (!breakpoint) {
    throw new Error(`Breakpoint with screen size "${size}" is not defined`);
  }

  const { isMatches } = useContext(breakpoint.context);

  if (isMatches === null) return defaultValue;

  return matchTo === 'min' ? isMatches : !isMatches;
};

export const MatchBreakpointProvider: FC<MatchMediaProviderProps> = (props) => {
  const { breakpoints, cssMode, children, mergeClassesFunction } = props;

  const contextualizedBreakpoints = useMemo(
    () =>
      Object.keys(breakpoints).reduce<ContextualizedBreakpoints>(
        (acc, key) => ({
          ...acc,
          [key]: {
            data: breakpoints[key],
            context: createContext({ ...DEFAULT_BREAKPOINT_CONTEXT }),
          },
        }),
        {},
      ),
    [breakpoints],
  );

  return (
    <BreakpointsProvider
      breakpoints={contextualizedBreakpoints}
      cssMode={cssMode}
      mergeClassesFunction={mergeClassesFunction}
    >
      {Object.keys(contextualizedBreakpoints).reduce(
        (acc, size) => (
          <BreakpointProvider breakpoint={contextualizedBreakpoints[size]}>
            {acc}
          </BreakpointProvider>
        ),
        children,
      )}
    </BreakpointsProvider>
  );
};
