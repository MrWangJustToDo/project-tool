'use strict';

var rollup = require('rollup');
var pino = require('pino');
var pretty = require('pino-pretty');
var commonjs = require('@rollup/plugin-commonjs');
var pluginNodeResolve = require('@rollup/plugin-node-resolve');
var replace = require('@rollup/plugin-replace');
var fs = require('fs');
var promises = require('fs/promises');
var cloneDeep = require('lodash/cloneDeep');
var path = require('path');
var typescript = require('rollup-plugin-typescript2');

/******************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */

var __assign = function() {
    __assign = Object.assign || function __assign(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};

function __rest(s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
}

function __awaiter(thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
}

function __generator(thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
}

var logger = function () { return pino.pino(pretty()); };

var safeParse = function (str) {
    try {
        return JSON.parse(str);
    }
    catch (e) {
        throw new Error("parse error, ".concat(e.message));
    }
};

var defaultBuildOptions = {
    input: "./src/index.ts",
    output: [
        {
            dir: "./dist",
            entryFileNames: "cjs/index.js",
            format: "cjs",
            sourcemap: true,
        },
        {
            dir: "./dist",
            entryFileNames: "esm/index.js",
            format: "esm",
            sourcemap: true,
        },
    ],
};
var checkFileExist = function (path) {
    return promises.access(path, fs.constants.F_OK)
        .then(function () { return true; })
        .catch(function () { return false; });
};
var tsConfig = function (absolutePath, mode) {
    return typescript({
        clean: true,
        tsconfig: path.resolve(absolutePath, "tsconfig.json"),
        useTsconfigDeclarationDir: true,
        tsconfigOverride: {
            compilerOptions: {
                composite: mode === "development" ? true : false,
                sourceMap: mode === "development" ? true : false,
                declaration: mode === "development" ? true : false,
                declarationMap: mode === "development" ? true : false,
                declarationDir: mode === "development" ? "dist/types" : null,
            },
        },
    });
};
var transformBuildOptions = function (options, packageFileObject, absolutePath, mode, external) {
    var _a;
    var allOptions = {};
    if (typeof options.input === "string" && !options.input.startsWith(absolutePath)) {
        options.input = path.resolve(absolutePath, options.input);
    }
    if (options.output) {
        options.output = Array.isArray(options.output) ? options.output : [options.output];
        var singleConfig = options.output.filter(function (output) { return !output.multiple; });
        var singleOtherConfig = singleConfig.filter(function (output) { return output.format !== "umd"; });
        var singleUMDConfig = singleConfig.filter(function (output) { return output.format === "umd"; });
        var multipleConfig = options.output.filter(function (output) { return output.multiple; });
        var multipleOtherConfig = multipleConfig.filter(function (output) { return output.format !== "umd"; });
        var multipleUMDConfig = multipleConfig.filter(function (output) { return output.format === "umd"; });
        var umdGlobalIgnore_1 = [];
        options.output = options.output.map(function (output) {
            if (output.dir && !output.dir.startsWith(absolutePath)) {
                output.dir = path.resolve(absolutePath, output.dir);
                if (output.multiple) {
                    var typedEntryFileNames = output.entryFileNames;
                    var lastIndexofDote = typedEntryFileNames.lastIndexOf(".");
                    output.entryFileNames = "".concat(typedEntryFileNames.slice(0, lastIndexofDote), ".").concat(mode).concat(typedEntryFileNames.slice(lastIndexofDote));
                    delete output.multiple;
                }
            }
            if (output.file && !output.file.startsWith(absolutePath)) {
                output.file = path.resolve(absolutePath, output.file);
                if (output.multiple) {
                    var typedEntryFileNames = output.file;
                    var lastIndexofDote = typedEntryFileNames.lastIndexOf(".");
                    output.file = "".concat(typedEntryFileNames.slice(0, lastIndexofDote), ".").concat(mode).concat(typedEntryFileNames.slice(lastIndexofDote));
                    delete output.multiple;
                }
            }
            if (output.globals) {
                var allGlobal = Object.keys(output.globals);
                umdGlobalIgnore_1.push.apply(umdGlobalIgnore_1, allGlobal);
            }
            return output;
        });
        options.onwarn = function (msg, warn) {
            if (!/Circular/.test(msg.message)) {
                warn(msg);
            }
        };
        if (singleOtherConfig.length) {
            allOptions.singleOther = __assign(__assign({}, options), { output: singleOtherConfig, external: external || (function (id) { return id.includes("node_modules"); }), plugins: [
                    pluginNodeResolve.nodeResolve(),
                    commonjs({ exclude: "node_modules" }),
                    replace(packageFileObject["name"] === "@project-tool/rollup"
                        ? {}
                        : {
                            __DEV__: 'process.env.NODE_ENV === "development"',
                            __VERSION__: JSON.stringify(packageFileObject["version"] || "0.0.1"),
                            preventAssignment: true,
                        }),
                    tsConfig(absolutePath, mode),
                ] });
        }
        if (singleUMDConfig.length) {
            allOptions.singleUMD = __assign(__assign({}, options), { output: singleUMDConfig, external: function (id) {
                    if (umdGlobalIgnore_1.some(function (name) { return id.endsWith(name); }))
                        return true;
                }, plugins: [
                    pluginNodeResolve.nodeResolve(),
                    commonjs({ exclude: "node_modules" }),
                    replace(packageFileObject["name"] === "@project-tool/rollup"
                        ? {}
                        : {
                            __DEV__: 'process.env.NODE_ENV === "development"',
                            __VERSION__: JSON.stringify(packageFileObject["version"] || "0.0.1"),
                            preventAssignment: true,
                        }),
                    tsConfig(absolutePath, mode),
                ] });
        }
        if (multipleOtherConfig.length) {
            allOptions.multipleOther = __assign(__assign({}, options), { output: multipleOtherConfig, external: external || (function (id) { return id.includes("node_modules"); }), plugins: [
                    pluginNodeResolve.nodeResolve(),
                    commonjs({ exclude: "node_modules" }),
                    replace(packageFileObject["name"] === "@project-tool/rollup"
                        ? {}
                        : {
                            __DEV__: mode === "development",
                            __VERSION__: JSON.stringify(packageFileObject["version"] || "0.0.1"),
                            preventAssignment: true,
                        }),
                    tsConfig(absolutePath, mode),
                    // mode === "production" ? terser() : null,
                ] });
        }
        if (multipleUMDConfig.length) {
            allOptions.multipleUMD = __assign(__assign({}, options), { output: multipleUMDConfig, external: function (id) {
                    if (umdGlobalIgnore_1.some(function (name) { return id.endsWith(name); }))
                        return true;
                }, plugins: [
                    pluginNodeResolve.nodeResolve(),
                    commonjs({ exclude: "node_modules" }),
                    replace(packageFileObject["name"] === "@project-tool/rollup"
                        ? {}
                        : (_a = {
                                __DEV__: mode === "development"
                            },
                            _a["process.env.NODE_ENV"] = JSON.stringify(mode),
                            _a.__VERSION__ = JSON.stringify(packageFileObject["version"] || "0.0.1"),
                            _a.preventAssignment = true,
                            _a)),
                    tsConfig(absolutePath, mode),
                ] });
        }
    }
    return allOptions;
};
var flattenRollupConfig = function (rollupConfig, packageName, packageFileObject, absolutePath, options) {
    var modes = ["development", "production"];
    if (!rollupConfig.input) {
        throw new Error("current package \"".concat(packageName, "\" not have a input config"));
    }
    if (!rollupConfig.output) {
        throw new Error("current package \"".concat(packageName, "\" not have a output config"));
    }
    var allRollupOptions = modes.map(function (mode) { return transformBuildOptions(cloneDeep(rollupConfig), packageFileObject, absolutePath, mode, options.external); });
    var allDevBuild = allRollupOptions[0];
    var allProdBuild = allRollupOptions[1];
    // single build bundle base on current process env, so only need build once
    var singleOther = allDevBuild["singleOther"];
    var singleDevUMD = allDevBuild["singleUMD"];
    var multipleDevOther = allDevBuild["multipleOther"];
    var multipleDevUMD = allDevBuild["multipleUMD"];
    var multipleProdOther = allProdBuild["multipleOther"];
    var multipleProdUMD = allProdBuild["multipleUMD"];
    return {
        singleOther: singleOther,
        singleDevUMD: singleDevUMD,
        multipleDevOther: multipleDevOther,
        multipleDevUMD: multipleDevUMD,
        multipleProdOther: multipleProdOther,
        multipleProdUMD: multipleProdUMD,
    };
};
function filterFun(t) {
    return t ? true : false;
}
var getRollupConfigs = function (options) { return __awaiter(void 0, void 0, void 0, function () {
    var packageScope, packageName, absolutePath, packageFilePath, tsconfigFilePath, isPackageFileExist, isTsconfigFileExist, packageFileContent, packageFileObject, rollupConfig, typedBuildOptions, all;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                packageScope = options.packageScope;
                packageName = options.packageName;
                absolutePath = packageScope ? path.resolve(process.cwd(), packageScope, packageName) : path.resolve(process.cwd(), packageName);
                packageFilePath = path.resolve(absolutePath, "package.json");
                tsconfigFilePath = path.resolve(absolutePath, "tsconfig.json");
                return [4 /*yield*/, checkFileExist(packageFilePath)];
            case 1:
                isPackageFileExist = _a.sent();
                return [4 /*yield*/, checkFileExist(tsconfigFilePath)];
            case 2:
                isTsconfigFileExist = _a.sent();
                if (!isPackageFileExist) {
                    throw new Error("current package \"".concat(packageName, "\" not exist, absolutePath: ").concat(packageFilePath));
                }
                if (!isTsconfigFileExist) {
                    throw new Error("current package \"".concat(packageName, "\" not have a \"tsconfig.json\", absolutePath: ").concat(tsconfigFilePath));
                }
                return [4 /*yield*/, promises.readFile(packageFilePath, {
                        encoding: "utf-8",
                    })];
            case 3:
                packageFileContent = _a.sent();
                packageFileObject = safeParse(packageFileContent);
                rollupConfig = [
                    __assign({}, defaultBuildOptions),
                ];
                if (packageFileObject["buildOptions"]) {
                    typedBuildOptions = packageFileObject["buildOptions"];
                    rollupConfig = Array.isArray(typedBuildOptions) ? typedBuildOptions : [typedBuildOptions];
                }
                all = rollupConfig.map(function (config) { return flattenRollupConfig(config, packageName, packageFileObject, absolutePath, options); });
                return [2 /*return*/, {
                        singleOther: all.map(function (i) { return i.singleOther; }).filter(filterFun),
                        singleDevUMD: all.map(function (i) { return i.singleDevUMD; }).filter(filterFun),
                        multipleDevOther: all.map(function (i) { return i.multipleDevOther; }).filter(filterFun),
                        multipleDevUMD: all.map(function (i) { return i.multipleDevUMD; }).filter(filterFun),
                        multipleProdOther: all.map(function (i) { return i.multipleProdOther; }).filter(filterFun),
                        multipleProdUMD: all.map(function (i) { return i.multipleProdUMD; }).filter(filterFun),
                    }];
        }
    });
}); };

var build = function (packageName, rollupOptions, mode, type) { return __awaiter(void 0, void 0, void 0, function () {
    var bundle, output, options, e_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                logger().info("[build] start build package '".concat(packageName, "' with '").concat(mode, "' mode in '").concat(type, "' format"));
                bundle = null;
                _a.label = 1;
            case 1:
                _a.trys.push([1, 4, 5, 7]);
                output = rollupOptions.output, options = __rest(rollupOptions, ["output"]);
                return [4 /*yield*/, rollup.rollup(options)];
            case 2:
                bundle = _a.sent();
                return [4 /*yield*/, Promise.all(output.map(function (output) { return bundle === null || bundle === void 0 ? void 0 : bundle.write(output); }))];
            case 3:
                _a.sent();
                return [3 /*break*/, 7];
            case 4:
                e_1 = _a.sent();
                logger().error("[build] build package '".concat(packageName, "' with '").concat(mode, "' mode in '").concat(type, "' format failed \n ").concat(e_1.message));
                process.exit(1);
                return [3 /*break*/, 7];
            case 5: return [4 /*yield*/, (bundle === null || bundle === void 0 ? void 0 : bundle.close())];
            case 6:
                _a.sent();
                return [7 /*endfinally*/];
            case 7:
                logger().info("[build] build package '".concat(packageName, "' with '").concat(mode, "' mode in '").concat(type, "' format success"));
                return [2 /*return*/];
        }
    });
}); };
var rollupBuild = function (options) { return __awaiter(void 0, void 0, void 0, function () {
    var aliasName, _a, singleOther, singleDevUMD, multipleDevOther, multipleDevUMD, multipleProdOther, multipleProdUMD, all;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                aliasName = options.alias || options.packageName;
                return [4 /*yield*/, getRollupConfigs(options)];
            case 1:
                _a = _b.sent(), singleOther = _a.singleOther, singleDevUMD = _a.singleDevUMD, multipleDevOther = _a.multipleDevOther, multipleDevUMD = _a.multipleDevUMD, multipleProdOther = _a.multipleProdOther, multipleProdUMD = _a.multipleProdUMD;
                all = [];
                singleOther.map(function (config) { return all.push(function () { return build(aliasName, config, "process.env", config.output.map(function (v) { return v.format; }).join("&")); }); });
                singleDevUMD.map(function (config) { return all.push(function () { return build(aliasName, config, "development", config.output.map(function (v) { return v.format; }).join("&")); }); });
                multipleDevOther.map(function (config) { return all.push(function () { return build(aliasName, config, "development", config.output.map(function (v) { return v.format; }).join("&")); }); });
                multipleDevUMD.map(function (config) { return all.push(function () { return build(aliasName, config, "development", config.output.map(function (v) { return v.format; }).join("&")); }); });
                multipleProdOther.map(function (config) { return all.push(function () { return build(aliasName, config, "production", config.output.map(function (v) { return v.format; }).join("&")); }); });
                multipleProdUMD.map(function (config) { return all.push(function () { return build(aliasName, config, "production", config.output.map(function (v) { return v.format; }).join("&")); }); });
                return [4 /*yield*/, Promise.all(all.map(function (f) { return f(); }))];
            case 2:
                _b.sent();
                return [2 /*return*/];
        }
    });
}); };

var watch = function (packageName, rollupOptions, mode, type) {
    rollupOptions.watch = {
        buildDelay: 100,
    };
    var watcher = rollup.watch(rollupOptions);
    watcher.on("event", function (event) {
        if (event.code === "BUNDLE_START") {
            // look like rollup watch have a bug for some usage
            logger().info("[watch] start build package '".concat(packageName, "' with '").concat(mode, "' mode in '").concat(type, "' format"));
        }
        if (event.code === "BUNDLE_END") {
            if (event.result)
                event.result.close();
            logger().info("[watch] package '".concat(packageName, "' with '").concat(mode, "' mode in '").concat(type, "' format build success"));
        }
        if (event.code === "ERROR") {
            if (event.result)
                event.result.close();
            logger().error("[watch] package '".concat(packageName, "' with '").concat(mode, "' mode in '").concat(type, "' format build failed \n ").concat(event.error.stack));
        }
    });
};
var rollupWatch = function (options) { return __awaiter(void 0, void 0, void 0, function () {
    var aliasName, _a, singleOther, multipleDevOther, multipleDevUMD;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                aliasName = options.alias || options.packageName;
                return [4 /*yield*/, getRollupConfigs(options)];
            case 1:
                _a = _b.sent(), singleOther = _a.singleOther, multipleDevOther = _a.multipleDevOther, multipleDevUMD = _a.multipleDevUMD;
                singleOther.forEach(function (config) { return watch(aliasName, config, "process.env", config.output.map(function (v) { return v.format; }).join("&")); });
                multipleDevOther.forEach(function (config) { return watch(aliasName, config, "development", config.output.map(function (v) { return v.format; }).join("&")); });
                multipleDevUMD.forEach(function (config) { return watch(aliasName, config, "development", config.output.map(function (v) { return v.format; }).join("&")); });
                return [2 /*return*/];
        }
    });
}); };

exports.rollupBuild = rollupBuild;
exports.rollupWatch = rollupWatch;
//# sourceMappingURL=index.production.js.map
