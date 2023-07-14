import type { OutputOptions, RollupOptions } from "rollup";
export type Mode = "production" | "development" | 'process.env';
export type Type = "cjs" | "esm" | "umd" | string;
export type MultipleOutput = OutputOptions & {
    multiple?: boolean;
};
export type Options = {
    packageName: string;
    alias?: string;
    packageScope?: string;
    external?: RollupOptions["external"];
    multipleNameTransform?: (name: string, mode: Mode) => string;
};
//# sourceMappingURL=type.d.ts.map