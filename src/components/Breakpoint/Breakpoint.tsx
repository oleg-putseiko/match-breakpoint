import {
  Children,
  type ComponentProps,
  type ElementType,
  type ForwardedRef,
  forwardRef,
  type ForwardRefRenderFunction,
  Fragment,
  type PropsWithoutRef,
  type ReactNode,
} from 'react';

import { type MatchTo, type ScreenSize } from '@/types/breakpoints';

import { BreakpointChild } from '@/components/Breakpoint/BreakpointChild';
import { useBreakpoint } from '@/components/BreakpointsProvider';

type FragmentFC = typeof Fragment;

type BreakpointControlledProps<TElement extends ElementType> = {
  as?: TElement;
  size: ScreenSize;
  matchTo?: MatchTo;
  isDefaultMatches?: boolean;
  children: ReactNode;
};

type BreakpointNativeProps<TElement extends ElementType> = Omit<
  ComponentProps<TElement>,
  keyof BreakpointControlledProps<TElement>
>;

type BreakpointProps<TElement extends ElementType> =
  BreakpointNativeProps<TElement> & BreakpointControlledProps<TElement>;

type BreakpointRef<TElement extends ElementType> = ForwardedRef<
  TElement extends keyof HTMLElementTagNameMap
    ? HTMLElementTagNameMap[TElement]
    : HTMLElement
>;

const _Breakpoint = (<TElement extends ElementType = FragmentFC>(
  props: BreakpointProps<TElement>,
  ref: BreakpointRef<TElement>,
): ReactNode => {
  const {
    as = Fragment,
    size,
    matchTo = 'min',
    isDefaultMatches = true,
    children,
    ...componentProps
  } = props;

  const shouldRenderChildren = useBreakpoint(size, matchTo, isDefaultMatches);

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
}) satisfies ForwardRefRenderFunction<
  HTMLElement,
  BreakpointProps<ElementType>
>;

const Breakpoint = forwardRef(
  _Breakpoint as ForwardRefRenderFunction<
    HTMLElement,
    PropsWithoutRef<BreakpointProps<ElementType>>
  >,
) as typeof _Breakpoint;

export { Breakpoint };
