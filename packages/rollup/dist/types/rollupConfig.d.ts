import type { Options } from "./type";
import type { RollupOptions } from "rollup";
export declare const getRollupConfigs: (options: Options) => Promise<{
    type: RollupOptions[];
    singleOther: RollupOptions[];
    singleDevUMD: RollupOptions[];
    multipleDevOther: RollupOptions[];
    multipleDevUMD: RollupOptions[];
    multipleProdOther: RollupOptions[];
    multipleProdUMD: RollupOptions[];
}>;
