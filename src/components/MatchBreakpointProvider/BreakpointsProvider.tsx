import {
  createContext,
  type FC,
  type ReactNode,
  useContext,
  useMemo,
} from 'react';

import { type ScreenSize } from '@/types/breakpoints';
import { type CSSMode, type MergeClassesFunction } from '@/types/styles';

import { type ContextualizedBreakpointData } from '@/components/MatchBreakpointProvider/BreakpointProvider';

export type ContextualizedBreakpoints = Record<
  ScreenSize,
  ContextualizedBreakpointData
>;

type BreakpointsContext = {
  breakpoints: ContextualizedBreakpoints;
  cssMode: CSSMode;
  mergeClassesFunction: MergeClassesFunction;
};

type BreakpointsProviderProps = {
  breakpoints: ContextualizedBreakpoints;
  cssMode?: CSSMode;
  children: ReactNode;
  mergeClassesFunction?: MergeClassesFunction;
};

const DEFAULT_BREAKPOINTS_CONTEXT: BreakpointsContext = {
  breakpoints: {},
  cssMode: 'tailwind',
  mergeClassesFunction: (...classes) => classes.filter(Boolean).join(' '),
};

const ContextInstance = createContext(DEFAULT_BREAKPOINTS_CONTEXT);

export const useBreakpointsContext = () => useContext(ContextInstance);

export const BreakpointsProvider: FC<BreakpointsProviderProps> = (props) => {
  const {
    breakpoints,
    children,
    cssMode = DEFAULT_BREAKPOINTS_CONTEXT.cssMode,
    mergeClassesFunction = DEFAULT_BREAKPOINTS_CONTEXT.mergeClassesFunction,
  } = props;

  const value = useMemo<BreakpointsContext>(
    () => ({ breakpoints, cssMode, mergeClassesFunction }),
    [breakpoints, cssMode, mergeClassesFunction],
  );

  return (
    <ContextInstance.Provider value={value}>
      {children}
    </ContextInstance.Provider>
  );
};
