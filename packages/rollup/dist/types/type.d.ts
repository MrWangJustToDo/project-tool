import type { InputOptions, OutputOptions } from "rollup";
export type Mode = "production" | "development" | "process.env";
export type Type = "cjs" | "esm" | "umd" | string;
export type MultipleOutput = OutputOptions & {
    multiple?: boolean;
};
export interface RollupOptions extends InputOptions {
    pkgName?: string;
    emitType?: boolean;
    output?: OutputOptions | OutputOptions[];
}
export type Options = {
    packageName: string;
    alias?: string;
    packageScope?: string;
    external?: RollupOptions["external"];
    multipleNameTransform?: (name: string, mode: Mode) => string;
};
//# sourceMappingURL=type.d.ts.map