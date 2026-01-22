import {
  Children,
  type ComponentPropsWithoutRef,
  type ElementType,
  type ExoticComponent,
  type FC,
  type ForwardedRef,
  forwardRef,
  type ForwardRefRenderFunction,
  Fragment,
  type LegacyRef,
  type PropsWithoutRef,
  type ReactNode,
} from 'react';

import { type MatchTo, type ScreenSize } from '@/types/breakpoints';

import { BreakpointChild } from '@/components/Breakpoint/BreakpointChild';
import { useBreakpoint } from '@/components/BreakpointsProvider';

type FragmentFC = typeof Fragment;

type ExtendedElementType = ElementType | ExoticComponent;

type BreakpointHTMLElement<TElement extends ElementType> =
  TElement extends keyof HTMLElementTagNameMap
    ? HTMLElementTagNameMap[TElement]
    : HTMLElement;

type BreakpointRef<TElement extends ElementType> = ForwardedRef<
  BreakpointHTMLElement<TElement>
>;

type BreakpointLegacyRef<TElement extends ElementType> = LegacyRef<
  BreakpointHTMLElement<TElement>
>;

type BreakpointControlledProps<TElement extends ElementType> = {
  as?: TElement;
  size: ScreenSize;
  matchTo?: MatchTo;
  isDefaultMatches?: boolean;
  children: ReactNode;
};

type BreakpointNativeProps<TElement extends ExtendedElementType> =
  TElement extends ExoticComponent
    ? ComponentPropsWithoutRef<TElement>
    : Omit<
        ComponentPropsWithoutRef<TElement>,
        keyof BreakpointControlledProps<TElement>
      >;

type BreakpointProps<TElement extends ElementType> =
  BreakpointNativeProps<TElement> & BreakpointControlledProps<TElement>;

type BreakpointPropsWithRef<TElement extends ElementType> =
  BreakpointProps<TElement> & { ref?: BreakpointLegacyRef<TElement> };

interface BreakpointFunctionComponent extends FC {
  <TElement extends ElementType = FragmentFC>(
    props: BreakpointPropsWithRef<TElement>,
  ): ReactNode;
}

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

const Breakpoint: BreakpointFunctionComponent = forwardRef(
  _Breakpoint as ForwardRefRenderFunction<
    HTMLElement,
    PropsWithoutRef<BreakpointProps<ElementType>>
  >,
);

export { Breakpoint };
