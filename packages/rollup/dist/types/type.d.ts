import type { OutputOptions, RollupOptions } from "rollup";
export type Packages = string;
export type Mode = "production" | "development";
export type Type = "cjs" | "esm" | "umd" | "cjs/esm" | "cjs&esm";
export type MultipleOutput = OutputOptions & {
    multiple?: boolean;
};
export type Options = {
    packageName: Packages;
    packageScope?: string;
    alias?: string;
    external?: RollupOptions['external'];
};
//# sourceMappingURL=type.d.ts.map