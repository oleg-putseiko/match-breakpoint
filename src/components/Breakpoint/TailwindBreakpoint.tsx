import {
  cloneElement,
  type ComponentProps,
  type CSSProperties,
  type ElementType,
  forwardRef,
  Fragment,
  isValidElement,
  type ReactNode,
} from 'react';

import { type MatchTo, type ScreenSize } from '@/types/breakpoints';
import { type ExtractRef, type RenderFunction } from '@/types/react';
import { type MergeClassesFunction } from '@/types/styles';

import { getMaxScreenWidth, getMinScreenWidth } from '@/utils/screen-width';

import { type ContextualizedBreakpointData } from '@/components/MatchBreakpointProvider/BreakpointProvider';
import { useBreakpointsContext } from '@/components/MatchBreakpointProvider/BreakpointsProvider';

type BaseComponentProps = {
  style?: CSSProperties;
  className?: string;
};

type PropsBuilderOptions<E extends ElementType> = {
  ref?: ExtractRef<TailwindBreakpointProps<E>>;
  initialProps?: BaseComponentProps;
  matchTo: MatchTo;
  breakpoint: ContextualizedBreakpointData;
  mergeClassesFunction: MergeClassesFunction;
};

type ControlledProps<E extends ElementType> = {
  as?: E;
  size: ScreenSize;
  matchTo: MatchTo;
  child: ReactNode;
};

type ComponentNativeProps<E extends ElementType> = Omit<
  ComponentProps<E>,
  'children' | keyof ControlledProps<E>
>;

type TailwindBreakpointProps<E extends ElementType> = ComponentNativeProps<E> &
  ControlledProps<E>;

const DEFAULT_COMPONENT = Fragment;

const buildProps = <T extends ElementType>(options: PropsBuilderOptions<T>) => {
  const { ref, initialProps, matchTo, breakpoint, mergeClassesFunction } =
    options;

  if (matchTo === 'max') {
    return {
      ...initialProps,
      ref,
      style: {
        ...initialProps?.style,
        ['--mb-screen-max-width']: getMaxScreenWidth(breakpoint.data),
      },
      className: mergeClassesFunction(
        initialProps?.className,
        'min-[var(--mb-screen-max-width)]:hidden',
      ),
    };
  }

  return {
    ...initialProps,
    ref,
    style: {
      ...initialProps?.style,
      ['--mb-screen-min-width']: getMinScreenWidth(breakpoint.data),
    },
    className: mergeClassesFunction(
      initialProps?.className,
      'max-[var(--mb-screen-min-width)]:hidden',
    ),
  };
};

const TailwindBreakpointRenderFunction = <
  T extends ElementType = typeof DEFAULT_COMPONENT,
>(
  props: TailwindBreakpointProps<T>,
  ref: ExtractRef<ComponentNativeProps<T>>,
) => {
  const {
    as: Component = DEFAULT_COMPONENT,
    size,
    matchTo,
    child,
    ...componentProps
  } = props;

  const { breakpoints, mergeClassesFunction } = useBreakpointsContext();

  const breakpoint = breakpoints[size];

  if (!breakpoint) {
    throw new Error(`Breakpoint with screen size "${size}" is not defined`);
  }

  if (Component === Fragment && isValidElement(child)) {
    return cloneElement(
      child,
      buildProps({
        initialProps: child.props,
        matchTo,
        breakpoint,
        mergeClassesFunction,
      }),
    );
  }

  if (Component !== Fragment) {
    return (
      <Component
        {...buildProps({
          ref,
          initialProps: componentProps,
          matchTo,
          breakpoint,
          mergeClassesFunction,
        })}
      >
        {child}
      </Component>
    );
  }

  return (
    <div
      {...buildProps({
        matchTo,
        breakpoint,
        mergeClassesFunction,
      })}
    >
      {child}
    </div>
  );
};

export const TailwindBreakpoint = forwardRef(
  TailwindBreakpointRenderFunction as RenderFunction<
    TailwindBreakpointProps<ElementType>
  >,
) as typeof TailwindBreakpointRenderFunction;
