import type { OutputOptions, RollupOptions } from "rollup";

export type Mode = "production" | "development";

export type Type = "cjs" | "esm" | "umd" | string;

export type MultipleOutput = OutputOptions & {
  multiple?: boolean;
};

export type Options = {
  packageName: string;
  alias?: string;
  packageScope?: string;
  external?: RollupOptions["external"];
};
