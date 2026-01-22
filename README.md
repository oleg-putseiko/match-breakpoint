<div align="center">

# match-breakpoint

[![Latest Release](https://badgen.net/github/release/oleg-putseiko/match-breakpoint?icon=github&cache=240)](https://github.com/oleg-putseiko/match-breakpoint/releases)
[![Total Downloads](https://badgen.net/npm/dt/match-breakpoint?icon=npm&cache=240)](https://www.npmjs.com/package/match-breakpoint)
[![Install Size](https://badgen.net/packagephobia/install/match-breakpoint?color=purple&cache=240)](https://www.npmjs.com/package/match-breakpoint)
[![License](https://badgen.net/npm/license/match-breakpoint?color=black&cache=240)](https://github.com/oleg-putseiko/match-breakpoint/blob/main/LICENSE.md)

</div>

A library of optimized React components and hooks for matching screen widths.

# Installation

```bash
yarn add match-breakpoint

// or

npm install match-breakpoint

// or

pnpm install match-breakpoint
```

# Advantages

❇️ ⚡️ The library's components and hooks use a finite and predefined number of media match listeners, which reduces the computational load.

❇️ ✨ Using `Breakpoint` components allows you to avoid cumulative layout shift.

❇️ 🧩 Conditional content display is compatible with most CSS frameworks, preprocessors, etc. In particular, it's possible to use the Tailwind CSS class name preset out of the box.

❇️ 🛡️ The library supports breakpoint typing used in all components and hooks from one place.

# Getting started

First of all, you need to add a breakpoints provider to your application:

```tsx
import { BreakpointsProvider } from 'match-breakpoint';

const App: FC = () => (
  <BreakpointsProvider breakpoints={/* … */}>
    {/* … */}
    {/* … */}
  </BreakpointsProvider>
);
```

Next you need to define the breakpoints that will be used in the application:

```tsx
const BREAKPOINTS = {
  md: '768px',
  lg: '1024px',
  xl: '1280px',
};

const App: FC = () => (
  <BreakpointsProvider breakpoints={BREAKPOINTS}>
    {/* … */}
    {/* … */}
  </BreakpointsProvider>
);
```

You can also pass a value from some configuration as breakpoints, for example from the Tailwind CSS configuration:

```tsx
import tailwindConfig from '../../tailwind.config.ts';

const DEFAULT_BREAKPOINTS = {
  md: '768px',
  lg: '1024px',
  xl: '1280px',
};

const breakpoints = tailwindConfig.theme?.screens ?? DEFAULT_BREAKPOINTS;

const App: FC = () => (
  <BreakpointsProvider breakpoints={breakpoints}>
    {/* … */}
    {/* … */}
  </BreakpointsProvider>
);
```

After that you can use the `Breakpoint` component, for example:

```tsx
import { Breakpoint } from 'match-breakpoint';

const Page: FC = () => (
  <>
    <Breakpoint size="md">Desktop Device Content</Breakpoint>

    <Breakpoint size="md" matchTo="max">
      Mobile Device Content
    </Breakpoint>
  </>
);
```

Or this using the `useBreakpoint` hook:

```tsx
import { useBreakpoint } from 'match-breakpoint';

const Content: FC = () => {
  const isDesktop = useBreakpoint('md');

  return isDesktop ? 'Desktop Device Content' : 'Mobile Device Content';
};
```

# Components

## BreakpointsProvider

Defines breakpoint contexts. Required for the library to function.

### Usage:

Example:

```tsx
const BREAKPOINTS = {
  sm: 640, // Same as '640px'
  md: '768px',
  lg: {
    value: 1024, // same as '1024px'
    minClassName: 'max-lg:hidden',
    maxClassName: 'lg:hidden',
  },
  xl: {
    value: '1280px',
    minClassName: 'max-xl:hidden',
    maxClassName: 'xl:hidden',
  },
};

const App: FC = () => (
  <BreakpointsProvider breakpoints={BREAKPOINTS}>
    {/* … */}
    {/* … */}
  </BreakpointsProvider>
);
```

### Properties:

#### 1. breakpoints

Defines the set of breakpoints used in the application. The property is required.

**Type:** `Record<string, string | number | BreakpointData>`

**Default value:** —

#### 2. cssPreset

Preset of class names added to elements for conditional display. The property is optional.

**Type:** `'tailwind' | undefined`

**Default value:** `undefined`

#### 3. mergeClassesFunction

Function for merging class names when displaying elements conditionally. The property is optional.

**Type:** `MergeClassesFunction | undefined`

**Default value:** `(...classes) => classes.filter(Boolean).join(' ')`

#### 4. children

Child elements. The property is required.

**Type:** `ReactNode`

**Default value:** —

## Breakpoint

Renders content based on the current screen size.

### Usage:

Example:

```tsx
const Page: FC = () => (
  <>
    <Breakpoint size="md">Desktop Device Content</Breakpoint>

    <Breakpoint size="md" matchTo="max">
      Mobile Device Content
    </Breakpoint>
  </>
);
```

### Properties:

#### 1. size

The breakpoint size specified when setting the `breakpoints` property in the `BreakpointsProvider` component. The property is required.

**Type:** `ScreenSize`

**Default value:** —

#### 2. matchTo

Sets which side of the breakpoint the match is made on. The property is optional.

**Type:** `'min' | 'max' | undefined`

**Default value:** `'min'`

#### 3. isDefaultMatches

Default match value that determines the match until handlers are initialized. The property is optional.

**Type:** `boolean | undefined`

**Default value:** `true`

#### 4. children

Child elements. The property is required.

**Type:** `ReactNode`

**Default value:** —

#### 5. as

Specifies which element the current `Breakpoint` should be rendered as. Once specified, props for a specified element can be passed. The property is optional.

**Type:** `ElementType | undefined`

**Default value:** `Fragment`

# Hooks

## useBreakpoint

Checks whether the breakpoint matches the current screen size.

### Usage:

Example:

```tsx
import { useBreakpoint } from 'match-breakpoint';

const Content: FC = () => {
  const isDesktop = useBreakpoint('md');

  return isDesktop ? 'Desktop Device Content' : 'Mobile Device Content';
};
```

### Parameters

#### 1. size

The breakpoint size specified when setting the `breakpoints` property in the `BreakpointsProvider` component. The parameter is required.

**Type:** `ScreenSize`

**Default value:** —

#### 2. matchTo

Sets which side of the breakpoint the match is made on. The parameter is optional.

**Type:** `'min' | 'max' | undefined`

**Default value:** `'min'`

#### 3. defaultValue

Default match value that determines the match until handlers are initialized. The parameter is optional.

**Type:** `boolean | undefined`

**Default value:** `true`

# Typing through an application

You can typify breakpoint names and values by extending the `Breakpoints` interface:

```tsx
declare module 'match-breakpoint' {
  interface Breakpoints {
    sm: BreakpointData;
    md: BreakpointData;
  }
}
```

Then, when using the `BreakpointProvider` and `Breakpoint` components and the `useBreakpoint` hook, this typing will be applied to their properties and parameters:

```tsx
const Content: FC = () => {
  const isDesktop = useBreakpoint('lg'); // ⛔️ TypeError: Type '"lg"' is not assignable to type '"sm" | "md"'

  // ⛔️ TypeError: Type '"lg"' is not assignable to type '"sm" | "md"'
  return <Breakpoint size="lg">{/* … */}</Breakpoint>;
};
```
