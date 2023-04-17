import type { RollupOptions } from "rollup";
export declare const getRollupConfigs: (packageName: string, packageScope?: string) => Promise<{
    singleOther: RollupOptions[];
    singleDevUMD: RollupOptions[];
    multipleDevOther: RollupOptions[];
    multipleDevUMD: RollupOptions[];
    multipleProdOther: RollupOptions[];
    multipleProdUMD: RollupOptions[];
}>;
//# sourceMappingURL=rollupConfig.d.ts.map