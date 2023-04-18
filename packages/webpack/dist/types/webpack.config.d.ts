import type { SafeDefineUniversalWebpackConfigProps, SafeGenerateActionProps } from "./type";
import type { Configuration } from "webpack";
export declare const config: ({ serverEntry, clientEntry, webpackClient, webpackServer, isDEV, isMIDDLEWARE, WDS_PORT, DEV_HOST, DEV_PORT, PROD_HOST, PROD_PORT, OUTPUT_SCOPE, TS_CHECK, ESLINT_CHECK, BUNDLE_CHECK, }: SafeDefineUniversalWebpackConfigProps) => Partial<Configuration>[];
export declare const singleConfig: (props: Required<import("./type").BaseGenerateActionProps> & Required<import("./type").ENV> & import("./type").CHECK & {
    extendConfig?: (props: SafeGenerateActionProps) => Partial<Configuration>;
}) => Partial<Configuration>;
//# sourceMappingURL=webpack.config.d.ts.map