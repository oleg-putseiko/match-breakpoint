import {
  type ElementType,
  type ForwardedRef,
  type ForwardRefRenderFunction,
  type LegacyRef,
  type PropsWithoutRef,
} from 'react';

type ExtractHTMLElement<P> = P extends any
  ? 'ref' extends keyof P
    ? P['ref'] extends ForwardedRef<infer E> | LegacyRef<infer E>
      ? E extends HTMLElement
        ? E
        : null
      : never
    : never
  : never;

export type ExtractRef<P> = ForwardedRef<ExtractHTMLElement<P>>;

export type RenderFunction<P> = ForwardRefRenderFunction<
  ElementType,
  PropsWithoutRef<P>
>;
