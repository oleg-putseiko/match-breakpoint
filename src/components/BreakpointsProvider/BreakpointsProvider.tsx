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
import { type CSSPresetName, type MergeClassesFunction } from '@/types/styles';

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
  cssPreset?: CSSPresetName;
  mergeClassesFunction: MergeClassesFunction;
};

type BreakpointsProviderProps = {
  breakpoints: Breakpoints;
  cssPreset?: CSSPresetName;
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

export const useBreakpoint = (
  size: ScreenSize,
  matchTo: MatchTo = 'min',
  defaultValue: boolean = false,
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

export const BreakpointsProvider: FC<BreakpointsProviderProps> = (props) => {
  const {
    breakpoints,
    cssPreset,
    children,
    mergeClassesFunction = DEFAULT_BREAKPOINTS_CONTEXT.mergeClassesFunction,
  } = props;

  const context = useMemo<BreakpointsContext>(
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
      cssPreset,
      mergeClassesFunction,
    }),
    [breakpoints, cssPreset, mergeClassesFunction],
  );

  return (
    <BreakpointsContextInstance.Provider value={context}>
      {Object.keys(context.breakpoints).reduce(
        (acc, size) => (
          <BreakpointProvider breakpoint={context.breakpoints[size]}>
            {acc}
          </BreakpointProvider>
        ),
        children,
      )}
    </BreakpointsContextInstance.Provider>
  );
};
