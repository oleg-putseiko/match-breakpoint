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
import { type CSSPresetName, type MergeClassesFunction } from '@/types/styles';

import { ensureBreakpointPx } from '@/utils/screen-width';

import { type ContextualizedBreakpointData } from '@/components/BreakpointsProvider/BreakpointProvider';
import { useBreakpointsContext } from '@/components/BreakpointsProvider/BreakpointsProvider';

type CSSPresetData = {
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
  cssPreset?: CSSPresetName;
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

const CLASS_NAME_PRESETS: Record<CSSPresetName, CSSPresetData> = {
  tailwind: {
    maxClassName: 'min-[var(--breakpoint)]:hidden',
    minClassName: 'max-[var(--breakpoint)]:hidden',
  },
};

const buildProps = <T extends ElementType>(options: PropsBuilderOptions<T>) => {
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
      ['--breakpoint']: ensureBreakpointPx(breakpoint.data),
    },
    className: mergeClassesFunction(initialProps?.className, className),
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

  const { breakpoints, cssPreset, mergeClassesFunction } =
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
        cssPreset,
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
          cssPreset,
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
        cssPreset,
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
