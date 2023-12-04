import type { Options, RollupOptions } from "./type";
export declare const getRollupConfigs: (options: Options) => Promise<{
    singleOther: RollupOptions[];
    singleDevUMD: RollupOptions[];
    multipleDevOther: RollupOptions[];
    multipleDevUMD: RollupOptions[];
    multipleProdOther: RollupOptions[];
    multipleProdUMD: RollupOptions[];
}>;
//# sourceMappingURL=rollupConfig.d.ts.map