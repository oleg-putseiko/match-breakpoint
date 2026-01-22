declare module 'react' {
  export interface CSSVariableProperties {
    [property: `--${string}`]: (string & {}) | (number & {});
  }

  export interface CSSProperties extends CSSVariableProperties {}
}

export {};
