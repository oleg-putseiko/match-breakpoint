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

import { BreakpointChild } from '@/components/Breakpoint/BreakpointChild';
import { useMatchBreakpoint } from '@/components/BreakpointsProvider';

type BreakpointControlledProps<T extends ElementType> = {
  as?: T;
  size: ScreenSize;
  breakpoints?: Breakpoints;
  matchTo?: MatchTo;
  isDefaultMatches?: boolean;
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
    children,
    ...componentProps
  } = props;

  const shouldRenderChildren = useMatchBreakpoint(
    size,
    matchTo,
    isDefaultMatches,
  );

  if (!shouldRenderChildren) return null;

  return Children.map(children, (child) => (
    <BreakpointChild
      {...componentProps}
      ref={ref}
      as={as}
      size={size}
      matchTo={matchTo}
      child={child}
    />
  ));
};

export const Breakpoint = forwardRef(
  BreakpointRenderFunction as RenderFunction<BreakpointProps<ElementType>>,
) as typeof BreakpointRenderFunction;
