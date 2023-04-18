export * from "./type";
export * from "webpack-merge";
export declare const definedUniversalWebpackConfig: ({ serverEntry, clientEntry, webpackClient, webpackServer, isDEV, isMIDDLEWARE, WDS_PORT, DEV_HOST, DEV_PORT, PROD_HOST, PROD_PORT, OUTPUT_SCOPE, TS_CHECK, ESLINT_CHECK, BUNDLE_CHECK, }: import("./type").SafeDefineUniversalWebpackConfigProps) => Partial<import("webpack").Configuration>[];
export declare const definedWebpackConfig: (props: Required<import("./type").BaseGenerateActionProps> & Required<import("./type").ENV> & import("./type").CHECK & {
    extendConfig?: (props: import("./type").SafeGenerateActionProps) => Partial<import("webpack").Configuration>;
}) => Partial<import("webpack").Configuration>;
export { MANIFEST } from "./utils/config";
//# sourceMappingURL=index.d.ts.map