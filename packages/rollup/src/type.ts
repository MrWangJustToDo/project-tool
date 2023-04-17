import type { OutputOptions } from "rollup";

export type Packages = string;
export type Mode = "production" | "development";
export type Type = "cjs" | "esm" | "umd" | "cjs/esm" | "cjs&esm";
export type MultipleOutput = OutputOptions & {
  multiple?: boolean;
};
