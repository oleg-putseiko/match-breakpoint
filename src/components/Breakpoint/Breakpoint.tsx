import {
  Children,
  type ComponentPropsWithoutRef,
  type ElementType,
  forwardRef,
  Fragment,
  type ReactNode,
} from 'react';

import {
  type Breakpoints,
  type MatchTo,
  type ScreenSize,
} from '@/types/breakpoints';
import { type ExtractRef, type RenderFunction } from '@/types/react';
import { type CSSMode } from '@/types/styles';

import { TailwindBreakpoint } from '@/components/Breakpoint/TailwindBreakpoint';
import { useBreakpointsContext } from '@/components/MatchBreakpointProvider/BreakpointsProvider';
import { useMatchBreakpoint } from '@/components/MatchBreakpointProvider/MatchBreakpointProvider';

type BreakpointControlledProps<T extends ElementType> = {
  as?: T;
  size: ScreenSize;
  breakpoints?: Breakpoints;
  matchTo?: MatchTo;
  isDefaultMatches?: boolean;
  cssMode?: CSSMode;
  children: ReactNode;
};

type BreakpointComponentNativeProps<T extends ElementType> = Omit<
  ComponentPropsWithoutRef<T>,
  keyof BreakpointControlledProps<T>
>;

type BreakpointProps<T extends ElementType> =
  BreakpointComponentNativeProps<T> & BreakpointControlledProps<T>;

const DEFAULT_COMPONENT = Fragment;

const BreakpointRenderFunction = <
  T extends ElementType = typeof DEFAULT_COMPONENT,
>(
  props: BreakpointProps<T>,
  ref: ExtractRef<BreakpointComponentNativeProps<T>>,
) => {
  const {
    as = DEFAULT_COMPONENT,
    size,
    matchTo = 'min',
    isDefaultMatches = true,
    cssMode: cssModeFromProp,
    children,
    ...componentProps
  } = props;

  const { cssMode: cssModeFromContext } = useBreakpointsContext();

  const shouldRenderChildren = useMatchBreakpoint(
    size,
    matchTo,
    isDefaultMatches,
  );

  if (!shouldRenderChildren) return null;

  const cssMode = cssModeFromProp ?? cssModeFromContext;

  return Children.map(children, (child) => {
    if (cssMode === 'tailwind') {
      return (
        <TailwindBreakpoint
          {...componentProps}
          ref={ref}
          as={as}
          size={size}
          matchTo={matchTo}
          child={child}
        />
      );
    }

    throw new TypeError(
      `"${cssMode}" is not supported CSS mode. Use 'tailwind' instead.`,
    );
  });
};

export const Breakpoint = forwardRef(
  BreakpointRenderFunction as RenderFunction<BreakpointProps<ElementType>>,
) as typeof BreakpointRenderFunction;
