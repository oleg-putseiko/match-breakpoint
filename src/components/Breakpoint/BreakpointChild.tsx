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
import {
  type ClassNamePreset,
  type MergeClassesFunction,
} from '@/types/styles';

import { getMaxScreenWidth, getMinScreenWidth } from '@/utils/screen-width';

import { type ContextualizedBreakpointData } from '@/components/BreakpointsProvider/BreakpointProvider';
import { useBreakpointsContext } from '@/components/BreakpointsProvider/BreakpointsProvider';

type ClassNamePresetData = {
  maxClassName: string;
  minClassName: string;
};

type BaseComponentProps = {
  style?: CSSProperties;
  className?: string;
};

type PropsBuilderOptions<E extends ElementType> = {
  ref?: ExtractRef<TailwindBreakpointProps<E>>;
  initialProps?: BaseComponentProps;
  matchTo: MatchTo;
  breakpoint: ContextualizedBreakpointData;
  classNamePreset?: ClassNamePreset;
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

const CLASS_NAME_PRESETS: Record<ClassNamePreset, ClassNamePresetData> = {
  tailwind: {
    maxClassName: 'min-[var(--max-screen-width)]:hidden',
    minClassName: 'max-[var(--min-screen-width)]:hidden',
  },
};

const buildProps = <T extends ElementType>(options: PropsBuilderOptions<T>) => {
  const {
    ref,
    initialProps,
    matchTo,
    breakpoint,
    classNamePreset,
    mergeClassesFunction,
  } = options;

  const classNamePresetData =
    classNamePreset !== undefined ? CLASS_NAME_PRESETS[classNamePreset] : null;

  if (matchTo === 'max') {
    return {
      ...initialProps,
      ref,
      style: {
        ...initialProps?.style,
        ['--max-screen-width']: getMaxScreenWidth(breakpoint.data),
      },
      className: mergeClassesFunction(
        initialProps?.className,
        typeof breakpoint.data === 'object'
          ? breakpoint.data.maxClassName || classNamePresetData?.maxClassName
          : classNamePresetData?.maxClassName,
      ),
    };
  }

  return {
    ...initialProps,
    ref,
    style: {
      ...initialProps?.style,
      ['--min-screen-width']: getMinScreenWidth(breakpoint.data),
    },
    className: mergeClassesFunction(
      initialProps?.className,
      typeof breakpoint.data === 'object'
        ? breakpoint.data.minClassName || classNamePresetData?.minClassName
        : classNamePresetData?.minClassName,
    ),
  };
};

const BreakpointChildRenderFunction = <
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

  const { breakpoints, classNamePreset, mergeClassesFunction } =
    useBreakpointsContext();

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
        classNamePreset,
        mergeClassesFunction,
      }),
    );
  }

  if (Component !== Fragment) {
    return (
      <Component
        {...buildProps({
          initialProps: componentProps,
          ref,
          matchTo,
          breakpoint,
          classNamePreset,
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
        classNamePreset,
        mergeClassesFunction,
      })}
    >
      {child}
    </div>
  );
};

export const BreakpointChild = forwardRef(
  BreakpointChildRenderFunction as RenderFunction<
    TailwindBreakpointProps<ElementType>
  >,
) as typeof BreakpointChildRenderFunction;
