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
import {
  type ClassNamePreset,
  type MergeClassesFunction,
} from '@/types/styles';

import {
  BreakpointProvider,
  type ContextualizedBreakpointData,
  DEFAULT_BREAKPOINT_CONTEXT,
} from '@/components/BreakpointsProvider/BreakpointProvider';

type ContextualizedBreakpoints = Record<
  ScreenSize,
  ContextualizedBreakpointData
>;

type BreakpointsContext = {
  breakpoints: ContextualizedBreakpoints;
  classNamePreset?: ClassNamePreset;
  mergeClassesFunction: MergeClassesFunction;
};

type BreakpointsProviderProps = {
  breakpoints: Breakpoints;
  classNamePreset?: ClassNamePreset;
  children: ReactNode;
  mergeClassesFunction?: MergeClassesFunction;
};

const DEFAULT_BREAKPOINTS_CONTEXT: BreakpointsContext = {
  breakpoints: {},
  mergeClassesFunction: (...classes) => classes.filter(Boolean).join(' '),
};

const BreakpointsContextInstance = createContext(DEFAULT_BREAKPOINTS_CONTEXT);

export const useBreakpointsContext = () =>
  useContext(BreakpointsContextInstance);

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

export const MatchBreakpointProvider: FC<BreakpointsProviderProps> = (
  props,
) => {
  const {
    breakpoints,
    classNamePreset,
    children,
    mergeClassesFunction = DEFAULT_BREAKPOINTS_CONTEXT.mergeClassesFunction,
  } = props;

  const value = useMemo<BreakpointsContext>(
    () => ({
      breakpoints: Object.keys(breakpoints).reduce<ContextualizedBreakpoints>(
        (acc, key) => ({
          ...acc,
          [key]: {
            data: breakpoints[key as keyof typeof breakpoints],
            context: createContext({ ...DEFAULT_BREAKPOINT_CONTEXT }),
          },
        }),
        {},
      ),
      classNamePreset,
      mergeClassesFunction,
    }),
    [breakpoints, classNamePreset, mergeClassesFunction],
  );

  return (
    <BreakpointsContextInstance.Provider value={value}>
      {Object.keys(value.breakpoints).reduce(
        (acc, size) => (
          <BreakpointProvider breakpoint={value.breakpoints[size]}>
            {acc}
          </BreakpointProvider>
        ),
        children,
      )}
    </BreakpointsContextInstance.Provider>
  );
};
