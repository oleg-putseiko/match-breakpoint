import {
  cloneElement,
  type ComponentProps,
  type ComponentPropsWithoutRef,
  type ElementType,
  type ExoticComponent,
  type FC,
  type ForwardedRef,
  forwardRef,
  type ForwardRefRenderFunction,
  Fragment,
  isValidElement,
  type LegacyRef,
  type PropsWithoutRef,
  type ReactNode,
} from 'react';

import { type MatchTo, type ScreenSize } from '@/types/breakpoints';
import { type CSSPresetName, type MergeClassesFunction } from '@/types/styles';

import { ensurePx } from '@/utils/screen-width';

import { type ContextualizedBreakpointData } from '@/components/BreakpointsProvider/BreakpointProvider';
import { useBreakpointsContext } from '@/components/BreakpointsProvider/BreakpointsProvider';

type AnyProps = Record<string | symbol | number, any>;

type ExtendedElementType = ElementType | ExoticComponent;

type CSSPresetClassNames = {
  maxClassName: string;
  minClassName: string;
};

type ComponentPropsBuilderOptions<TElement extends ElementType> = {
  ref?: BreakpointChildRef<TElement>;
  initialProps?: AnyProps;
  matchTo: MatchTo;
  breakpoint: ContextualizedBreakpointData;
  cssPreset?: CSSPresetName;
  mergeClassesFunction: MergeClassesFunction;
};

type BreakpointChildHTMLElement<TElement extends ElementType> =
  TElement extends keyof HTMLElementTagNameMap
    ? HTMLElementTagNameMap[TElement]
    : HTMLElement;

type BreakpointChildRef<TElement extends ElementType> = ForwardedRef<
  BreakpointChildHTMLElement<TElement>
>;

type BreakpointChildLegacyRef<TElement extends ElementType> = LegacyRef<
  BreakpointChildHTMLElement<TElement>
>;

type BreakpointChildControlledProps<TElement extends ElementType> = {
  as: TElement;
  size: ScreenSize;
  matchTo: MatchTo;
  child: ReactNode;
};

type BreakpointChildNativeProps<TElement extends ExtendedElementType> =
  TElement extends ExoticComponent
    ? ComponentPropsWithoutRef<TElement>
    : Omit<
        ComponentPropsWithoutRef<TElement>,
        keyof BreakpointChildControlledProps<TElement>
      >;

type BreakpointChildProps<TElement extends ElementType> =
  BreakpointChildNativeProps<TElement> &
    BreakpointChildControlledProps<TElement>;

type BreakpointChildPropsWithRef<TElement extends ElementType> =
  BreakpointChildProps<TElement> & { ref?: BreakpointChildLegacyRef<TElement> };

interface BreakpointChildFunctionComponent extends FC {
  <TElement extends ElementType>(
    props: BreakpointChildPropsWithRef<TElement>,
  ): ReactNode;
}

const CLASS_NAME_PRESETS: Record<CSSPresetName, CSSPresetClassNames> = {
  tailwind: {
    maxClassName: 'min-[var(--breakpoint)]:hidden',
    minClassName: 'max-[var(--breakpoint)]:hidden',
  },
};

const buildComponentProps = <TElement extends ElementType>(
  options: ComponentPropsBuilderOptions<TElement>,
) => {
  const {
    ref,
    initialProps,
    matchTo,
    breakpoint,
    cssPreset,
    mergeClassesFunction,
  } = options;

  const preset = cssPreset ? CLASS_NAME_PRESETS[cssPreset] : null;
  const presetKey = `${matchTo}ClassName` as const;

  const className =
    typeof breakpoint.data === 'object'
      ? breakpoint.data[presetKey] || preset?.[presetKey]
      : preset?.[presetKey];

  return {
    ...initialProps,
    ref,
    style: {
      ...initialProps?.style,
      ['--breakpoint']: ensurePx(breakpoint.data),
    },
    className: mergeClassesFunction(initialProps?.className, className),
  } as ComponentProps<TElement>;
};

const _BreakpointChild = (<TElement extends ExtendedElementType>(
  props: BreakpointChildProps<TElement>,
  ref: BreakpointChildRef<TElement>,
) => {
  const context = useBreakpointsContext();

  const { as: Component, size, matchTo, child, ...componentProps } = props;
  const { breakpoints, cssPreset, mergeClassesFunction } = context;

  const breakpoint = breakpoints[size];

  if (!breakpoint) {
    throw new Error(`Breakpoint with screen size "${size}" is not defined`);
  }

  if (Component === Fragment && isValidElement(child)) {
    return cloneElement(
      child,
      buildComponentProps({
        initialProps: child.props,
        matchTo,
        breakpoint,
        cssPreset,
        mergeClassesFunction,
      }),
    );
  }

  if (Component !== Fragment) {
    return (
      <Component
        {...buildComponentProps({
          initialProps: { ...componentProps, children: child },
          ref,
          matchTo,
          breakpoint,
          cssPreset,
          mergeClassesFunction,
        })}
      />
    );
  }

  return (
    <div
      {...buildComponentProps({
        initialProps: { children: child },
        matchTo,
        breakpoint,
        cssPreset,
        mergeClassesFunction,
      })}
    />
  );
}) satisfies ForwardRefRenderFunction<
  HTMLElement,
  BreakpointChildProps<ElementType>
>;

const BreakpointChild: BreakpointChildFunctionComponent = forwardRef(
  _BreakpointChild as ForwardRefRenderFunction<
    HTMLElement,
    PropsWithoutRef<BreakpointChildProps<ElementType>>
  >,
);

export { BreakpointChild };
