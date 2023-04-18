import { Compilation } from "webpack";
import type { Compiler } from "webpack";
export declare class WebpackPageDepsPlugin {
    fileName: string;
    constructor(p?: {
        fileName?: string;
    });
    apply(compiler: Compiler): void;
    emitStates(compilation: Compilation): Promise<void>;
}
//# sourceMappingURL=webpack-page-deps.d.ts.map