import type { SafeGenerateActionProps } from "../type";
import type { Configuration } from "webpack-dev-server";
type DevServerProps = SafeGenerateActionProps & {
    publicPath: string;
};
export declare const devServerConfig: ({ publicPath, DEV_HOST, WDS_PORT }: DevServerProps) => Configuration;
export {};
//# sourceMappingURL=devServer.d.ts.map