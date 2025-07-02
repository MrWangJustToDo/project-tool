import type commonjs from "@rollup/plugin-commonjs";
import type json from "@rollup/plugin-json";
import type { nodeResolve } from "@rollup/plugin-node-resolve";
import type replace from "@rollup/plugin-replace";
import type terser from "@rollup/plugin-terser";
import type typescript from "@rollup/plugin-typescript";
import type { InputOptions, OutputOptions } from "rollup";
export type Mode = "production" | "development" | "process.env";
export type Type = "cjs" | "esm" | "umd" | string;
export type CustomOutput = OutputOptions & {
    multiple?: boolean;
    type?: boolean;
    typeDir?: string;
    typeConfig?: string;
};
export type CustomExternalOptions = {
    generateExternal: (type: keyof Options["plugins"]) => RollupOptions["external"];
};
export interface RollupOptions extends InputOptions {
    pkgName?: string;
    emitType?: boolean;
    output?: OutputOptions | OutputOptions[];
}
type BuildConfig = {
    options: RollupOptions;
    packageFileObject: Record<string, any>;
    absolutePath: string;
    mode: Mode;
    configOption: Options;
};
type ExternalPlugins = ({ defaultPlugins, defaultPluginProps, defaultPluginIndex, defaultPluginPackages, }: {
    defaultPlugins: RollupOptions["plugins"][];
    defaultPluginProps: BuildConfig;
    defaultPluginIndex: {
        commonjs?: number;
        json?: number;
        nodeResolve?: number;
        replace?: number;
        terser?: number;
        typescript?: number;
    };
    defaultPluginPackages: {
        commonjs: typeof commonjs;
        json: typeof json;
        nodeResolve: typeof nodeResolve;
        replace: typeof replace;
        terser: typeof terser;
        typescript: typeof typescript;
    };
}) => RollupOptions["plugins"][];
export type Options = {
    packageName: string;
    alias?: string;
    packageScope?: string;
    external?: RollupOptions["external"] | CustomExternalOptions;
    multipleNameTransform?: (name: string, mode: Mode) => string;
    plugins?: {
        singleOther?: ExternalPlugins;
        singleDevUMD?: ExternalPlugins;
        multipleDevOther?: ExternalPlugins;
        multipleDevUMD?: ExternalPlugins;
        multipleProdOther?: ExternalPlugins;
        multipleProdUMD?: ExternalPlugins;
    };
};
export {};
//# sourceMappingURL=type.d.ts.map