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
yarn add match-breakpoint@latest

// or

npm install match-breakpoint@latest

// or

pnpm install match-breakpoint@latest
```

# Advantages

❇️ ⚡️ The library's components and hooks use a finite and predefined number of media match listeners, which reduces the computational load.

❇️ ✨ Using `Breakpoint` components allows you to avoid cumulative layout shift.

❇️ 💫 Conditional content display is compatible with most CSS frameworks, preprocessors, etc. In particular, it's possible to use the Tailwind CSS class name preset out of the box.

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
  // …
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  // …
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
  // …
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  // …
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

const Content: FC = () => (
  <>
    <Breakpoint size="md">Desktop Device Content</Breakpoint>

    <Breakpoint size="md" matchTo="max">
      Mobile Device Content
    </Breakpoint>
  </>
);
```

Or using the `useBreakpoint` hook:

```tsx
import { useBreakpoint } from 'match-breakpoint';

const Content: FC = () => {
  const isScreenMinMd = useBreakpoint('md');

  if (isScreenMinMd) {
    return 'Desktop Device Content';
  }

  return 'Mobile Device Content';
};
```

# Components

## BreakpointsProvider

Defined breakpoint contexts.

### Usage:

Example:

```tsx
const BREAKPOINTS = {
  md: 768, // Same as '768px'
  lg: '1024px',
  xl: {
    min: '1280px',
    minClassName: 'max-xl:hidden',
  },
  combined: {
    max: '768px',
    maxClassName: 'md:hidden',

    min: '1280px',
    minClassName: 'max-xl:hidden',
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

| Property             | Type                                                 | Default value                                       | Description                                                                                                                                |
| -------------------- | ---------------------------------------------------- | --------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------ |
| breakpoints          | `Record<string, string \| number \| BreakpointData>` | -                                                   | Defines the set of breakpoints used in the application.                                                                                    |
| classNamePreset      | `'tailwind' \| undefined`                            | `undefined`                                         | Defines a preset of class names used to hide elements.                                                                                     |
| mergeClassesFunction | `MergeClassesFunction \| undefined`                  | `(...classes) => classes.filter(Boolean).join(' ')` | Defines a function for merging classes when adding them to elements. For example, you can pass a function to prevent class name conflicts. |
| children             | `ReactNode`                                          | -                                                   | Required child elements.                                                                                                                   |
