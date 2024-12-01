import {
  type Context,
  type FC,
  type ReactNode,
  useEffect,
  useMemo,
  useState,
} from 'react';

import { type BreakpointData } from '@/types/breakpoints';

import { getMinScreenWidth } from '@/utils/screen-width';

export type BreakpointContext = {
  isMatches: boolean | null;
};

export type ContextualizedBreakpointData = {
  data: BreakpointData;
  context: Context<BreakpointContext>;
};

export const DEFAULT_BREAKPOINT_CONTEXT: BreakpointContext = {
  isMatches: null,
};

type BreakpointProviderProps = {
  breakpoint: ContextualizedBreakpointData;
  children: ReactNode;
};

export const BreakpointProvider: FC<BreakpointProviderProps> = (props) => {
  const { breakpoint, children } = props;

  const { Provider } = breakpoint.context;

  const [isMatches, setIsMatches] = useState(
    DEFAULT_BREAKPOINT_CONTEXT.isMatches,
  );

  const minScreenWidth = getMinScreenWidth(breakpoint.data);

  useEffect(() => {
    const media = window.matchMedia(`(min-width: ${minScreenWidth})`);

    setIsMatches(media.matches);

    const handleMediaChange = (event: MediaQueryListEvent) => {
      setIsMatches(event.matches);
    };

    media.addEventListener('change', handleMediaChange);

    return () => {
      media.removeEventListener('change', handleMediaChange);
    };
  }, [minScreenWidth]);

  const value = useMemo<BreakpointContext>(() => ({ isMatches }), [isMatches]);

  return <Provider value={value}>{children}</Provider>;
};
