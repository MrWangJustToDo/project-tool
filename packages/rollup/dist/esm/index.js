import uniq from 'lodash/uniq';
import { rollup, watch as watch$1 } from 'rollup';
import { pino } from 'pino';
import pretty from 'pino-pretty';
import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import replace from '@rollup/plugin-replace';
import terser from '@rollup/plugin-terser';
import typescript from '@rollup/plugin-typescript';
import fs from 'fs';
import { readFile, access } from 'fs/promises';
import cloneDeep from 'lodash/cloneDeep';
import { resolve } from 'path';

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
/* global Reflect, Promise, SuppressedError, Symbol, Iterator */


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
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
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

typeof SuppressedError === "function" ? SuppressedError : function (error, suppressed, message) {
    var e = new Error(message);
    return e.name = "SuppressedError", e.error = error, e.suppressed = suppressed, e;
};

var logger = function () { return pino(pretty()); };

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
    return access(path, fs.constants.F_OK)
        .then(function () { return true; })
        .catch(function () { return false; });
};
var tsConfig = function (absolutePath, mode, sourceMap, type, _a) {
    var _b = _a === void 0 ? {} : _a, dir = _b.dir, config = _b.config;
    return typescript({
        cacheDir: resolve(absolutePath, ".cache"),
        tsconfig: resolve(absolutePath, config || "tsconfig.json"),
        sourceMap: sourceMap,
        declaration: type === "type" ? true : false,
        declarationMap: type === "type" ? true : false,
        declarationDir: type === "type" ? resolve(absolutePath, dir || "dist/types") : null,
    });
};
var transformMultipleBuildConfig = function (options, packageFileObject, absolutePath, mode, configOption) {
    var _a, _b;
    var _c, _d, _e, _f, _g, _h;
    var allOptions = {};
    if (typeof options.input === "string" && !options.input.startsWith(absolutePath)) {
        options.input = resolve(absolutePath, options.input);
    }
    if (options.output) {
        options.output = Array.isArray(options.output) ? options.output : [options.output];
        var CustomOutput = options.output.filter(function (output) { return output.multiple; });
        var umdGlobalIgnore_1 = [];
        options.output = CustomOutput.map(function (output) {
            if (output.dir && !output.dir.startsWith(absolutePath)) {
                output.dir = resolve(absolutePath, output.dir);
                if (configOption.multipleNameTransform) {
                    output.entryFileNames = configOption.multipleNameTransform(output.entryFileNames, mode);
                }
                else {
                    var typedEntryFileNames = output.entryFileNames;
                    var lastIndexofDote = typedEntryFileNames.lastIndexOf(".");
                    output.entryFileNames = "".concat(typedEntryFileNames.slice(0, lastIndexofDote), ".").concat(mode).concat(typedEntryFileNames.slice(lastIndexofDote));
                }
                delete output.multiple;
            }
            if (output.file && !output.file.startsWith(absolutePath)) {
                output.file = resolve(absolutePath, output.file);
                if (configOption.multipleNameTransform) {
                    output.file = configOption.multipleNameTransform(output.file, mode);
                }
                else {
                    var typedEntryFileNames = output.file;
                    var lastIndexofDote = typedEntryFileNames.lastIndexOf(".");
                    output.file = "".concat(typedEntryFileNames.slice(0, lastIndexofDote), ".").concat(mode).concat(typedEntryFileNames.slice(lastIndexofDote));
                }
                delete output.multiple;
            }
            return output;
        });
        var multipleOtherConfig = options.output.filter(function (output) { return output.format !== "umd"; });
        var multipleUMDConfig = options.output.filter(function (output) { return output.format === "umd"; });
        multipleUMDConfig.forEach(function (output) {
            if (output.globals) {
                var allGlobal = Object.keys(output.globals);
                umdGlobalIgnore_1.push.apply(umdGlobalIgnore_1, allGlobal);
            }
        });
        options.onwarn = function (msg, warn) {
            if (!/Circular/.test(msg.message)) {
                warn(msg);
            }
        };
        if (multipleOtherConfig.length) {
            var multipleOtherSourceMap = !!multipleOtherConfig.some(function (config) { return config.sourcemap; });
            var currentTsConfig = tsConfig(absolutePath, mode, multipleOtherSourceMap);
            if (mode === "development" && multipleOtherConfig.some(function (config) { return config.type; })) {
                var item = multipleOtherConfig.find(function (config) { return config.type; });
                var typeDir = typeof (item === null || item === void 0 ? void 0 : item.typeDir) === "string" ? item.dir + "".concat(!item.typeDir ? "" : "/".concat(item.typeDir)) : undefined;
                var typeConfig = typeof (item === null || item === void 0 ? void 0 : item.typeConfig) === "string" ? item.typeConfig : undefined;
                if (item) {
                    delete item.typeDir;
                    delete item.typeConfig;
                }
                currentTsConfig = tsConfig(absolutePath, mode, multipleOtherSourceMap, "type", { dir: typeDir, config: typeConfig });
            }
            multipleOtherConfig.forEach(function (config) { return delete config.type; });
            var pluginsBuilder = mode === "development" ? (_c = configOption.plugins) === null || _c === void 0 ? void 0 : _c.multipleDevOther : (_d = configOption.plugins) === null || _d === void 0 ? void 0 : _d.multipleProdOther;
            var defaultPlugins = [
                nodeResolve(),
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
                currentTsConfig,
                json(),
            ];
            var plugins = pluginsBuilder
                ? pluginsBuilder({
                    defaultPlugins: defaultPlugins,
                    defaultPluginIndex: {
                        nodeResolve: 0,
                        commonjs: 1,
                        replace: 2,
                        typescript: 3,
                        json: 4,
                    },
                    defaultPluginPackages: { commonjs: commonjs, typescript: typescript, json: json, replace: replace, terser: terser, nodeResolve: nodeResolve },
                    defaultPluginProps: {
                        options: options,
                        packageFileObject: packageFileObject,
                        absolutePath: absolutePath,
                        mode: mode,
                        configOption: configOption,
                    },
                })
                : defaultPlugins;
            allOptions.multipleOther = __assign(__assign({}, options), { output: multipleOtherConfig, external: (typeof ((_e = configOption.external) === null || _e === void 0 ? void 0 : _e.generateExternal) === "function"
                    ? // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                        // @ts-ignore
                        (_f = configOption.external) === null || _f === void 0 ? void 0 : _f.generateExternal(mode === "development" ? "multipleDevOther" : "multipleProdOther")
                    : configOption.external) || (function (id) { return id.includes("node_modules") && !id.includes("node_modules/tslib"); }), plugins: plugins });
        }
        if (multipleUMDConfig.length) {
            var multipleUMDSourceMap = !!multipleUMDConfig.some(function (config) { return config.sourcemap; });
            var currentTsConfig = tsConfig(absolutePath, mode, multipleUMDSourceMap);
            if (mode === "development" && multipleUMDConfig.some(function (config) { return config.type; })) {
                var item = multipleOtherConfig.find(function (config) { return config.type; });
                var typeDir = typeof (item === null || item === void 0 ? void 0 : item.typeDir) === "string" ? item.dir + "".concat(!item.typeDir ? "" : "/".concat(item.typeDir)) : undefined;
                var typeConfig = typeof (item === null || item === void 0 ? void 0 : item.typeConfig) === "string" ? item.typeConfig : undefined;
                if (item) {
                    delete item.typeDir;
                    delete item.typeConfig;
                }
                currentTsConfig = tsConfig(absolutePath, mode, multipleUMDSourceMap, "type", { dir: typeDir, config: typeConfig });
            }
            multipleUMDConfig.forEach(function (config) { return delete config.type; });
            var pluginsBuilder = mode === "development" ? (_g = configOption.plugins) === null || _g === void 0 ? void 0 : _g.multipleDevUMD : (_h = configOption.plugins) === null || _h === void 0 ? void 0 : _h.multipleProdUMD;
            var defaultPlugins = [
                nodeResolve(),
                commonjs({ exclude: "node_modules" }),
                replace(packageFileObject["name"] === "@project-tool/rollup"
                    ? {}
                    : (_b = {
                            __DEV__: mode === "development"
                        },
                        _b["process.env.NODE_ENV"] = JSON.stringify(mode),
                        _b.__VERSION__ = JSON.stringify(packageFileObject["version"] || "0.0.1"),
                        _b.preventAssignment = true,
                        _b)),
                currentTsConfig,
                json(),
                mode === "production" ? terser() : null,
            ];
            var plugins = pluginsBuilder
                ? pluginsBuilder({
                    defaultPlugins: defaultPlugins,
                    defaultPluginIndex: {
                        nodeResolve: 0,
                        commonjs: 1,
                        replace: 2,
                        typescript: 3,
                        json: 4,
                        terser: 5,
                    },
                    defaultPluginPackages: { commonjs: commonjs, typescript: typescript, json: json, replace: replace, terser: terser, nodeResolve: nodeResolve },
                    defaultPluginProps: {
                        options: options,
                        packageFileObject: packageFileObject,
                        absolutePath: absolutePath,
                        mode: mode,
                        configOption: configOption,
                    },
                })
                : defaultPlugins;
            allOptions.multipleUMD = __assign(__assign({}, options), { output: multipleUMDConfig, external: function (id) {
                    if (umdGlobalIgnore_1.some(function (name) { return id.endsWith(name); }))
                        return true;
                }, plugins: plugins });
        }
    }
    return allOptions;
};
var transformSingleBuildConfig = function (options, packageFileObject, absolutePath, configOption) {
    var _a, _b, _c;
    var allOptions = {};
    if (typeof options.input === "string" && !options.input.startsWith(absolutePath)) {
        options.input = resolve(absolutePath, options.input);
    }
    if (options.output) {
        options.output = Array.isArray(options.output) ? options.output : [options.output];
        var singleOutput = options.output.filter(function (output) { return !output.multiple; });
        var umdGlobalIgnore_2 = [];
        options.output = singleOutput.map(function (output) {
            if (output.dir && !output.dir.startsWith(absolutePath)) {
                output.dir = resolve(absolutePath, output.dir);
            }
            if (output.file && !output.file.startsWith(absolutePath)) {
                output.file = resolve(absolutePath, output.file);
            }
            return output;
        });
        var singleOther = options.output.filter(function (output) { return output.format !== "umd"; });
        var singleUMD = options.output.filter(function (output) { return output.format === "umd"; });
        singleUMD.forEach(function (output) {
            if (output.globals) {
                var allGlobal = Object.keys(output.globals);
                umdGlobalIgnore_2.push.apply(umdGlobalIgnore_2, allGlobal);
            }
        });
        options.onwarn = function (msg, warn) {
            if (!/Circular/.test(msg.message)) {
                warn(msg);
            }
        };
        if (singleOther.length) {
            var singleOtherSourceMap = !!singleOther.some(function (config) { return config.sourcemap; });
            var currentTsConfig = tsConfig(absolutePath, "process.env", singleOtherSourceMap);
            if (singleOther.some(function (config) { return config.type; })) {
                var item = singleOther.find(function (config) { return config.type; });
                var typeDir = typeof (item === null || item === void 0 ? void 0 : item.typeDir) === "string" ? item.dir + "".concat(!item.typeDir ? "" : "/".concat(item.typeDir)) : undefined;
                var typeConfig = typeof (item === null || item === void 0 ? void 0 : item.typeConfig) === "string" ? item.typeConfig : undefined;
                if (item) {
                    delete item.typeDir;
                    delete item.typeConfig;
                }
                currentTsConfig = tsConfig(absolutePath, "process.env", singleOtherSourceMap, "type", { dir: typeDir, config: typeConfig });
            }
            singleOther.forEach(function (config) { return delete config.type; });
            var pluginsBuilder = (_a = configOption.plugins) === null || _a === void 0 ? void 0 : _a.singleOther;
            var defaultPlugins = [
                nodeResolve(),
                commonjs({ exclude: "node_modules" }),
                replace(packageFileObject["name"] === "@project-tool/rollup"
                    ? {}
                    : {
                        __DEV__: 'process.env.NODE_ENV === "development"',
                        __VERSION__: JSON.stringify(packageFileObject["version"] || "0.0.1"),
                        preventAssignment: true,
                    }),
                currentTsConfig,
                json(),
            ];
            var plugins = pluginsBuilder
                ? pluginsBuilder({
                    defaultPlugins: defaultPlugins,
                    defaultPluginIndex: {
                        nodeResolve: 0,
                        commonjs: 1,
                        replace: 2,
                        typescript: 3,
                        json: 4,
                    },
                    defaultPluginPackages: { commonjs: commonjs, typescript: typescript, json: json, replace: replace, terser: terser, nodeResolve: nodeResolve },
                    defaultPluginProps: {
                        options: options,
                        packageFileObject: packageFileObject,
                        absolutePath: absolutePath,
                        mode: "process.env",
                        configOption: configOption,
                    },
                })
                : defaultPlugins;
            allOptions.singleOther = __assign(__assign({}, options), { output: singleOther, external: (typeof ((_b = configOption.external) === null || _b === void 0 ? void 0 : _b.generateExternal) === "function"
                    ? // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                        // @ts-ignore
                        configOption.external.generateExternal("singleOther")
                    : configOption.external) ||
                    (function (id) {
                        return id.includes("node_modules") && !id.includes("node_modules/tslib");
                    }), plugins: plugins });
        }
        if (singleUMD.length) {
            var singleUMDSourceMap = !!singleUMD.some(function (config) { return config.sourcemap; });
            var currentTsConfig = tsConfig(absolutePath, "process.env", singleUMDSourceMap);
            if (singleUMD.some(function (config) { return config.type; })) {
                var item = singleUMD.find(function (config) { return config.type; });
                var typeDir = typeof (item === null || item === void 0 ? void 0 : item.typeDir) === "string" ? item.dir + "".concat(!item.typeDir ? "" : "/".concat(item.typeDir)) : undefined;
                var typeConfig = typeof (item === null || item === void 0 ? void 0 : item.typeConfig) === "string" ? item.typeConfig : undefined;
                if (item) {
                    delete item.typeDir;
                    delete item.typeConfig;
                }
                currentTsConfig = tsConfig(absolutePath, "process.env", singleUMDSourceMap, "type", { dir: typeDir, config: typeConfig });
            }
            var pluginsBuilder = (_c = configOption.plugins) === null || _c === void 0 ? void 0 : _c.singleDevUMD;
            var defaultPlugins = [
                nodeResolve(),
                commonjs({ exclude: "node_modules" }),
                replace(packageFileObject["name"] === "@project-tool/rollup"
                    ? {}
                    : {
                        __DEV__: JSON.stringify(true),
                        __VERSION__: JSON.stringify(packageFileObject["version"] || "0.0.1"),
                        preventAssignment: true,
                    }),
                currentTsConfig,
                json(),
            ];
            var plugins = pluginsBuilder
                ? pluginsBuilder({
                    defaultPlugins: defaultPlugins,
                    defaultPluginIndex: {
                        nodeResolve: 0,
                        commonjs: 1,
                        replace: 2,
                        typescript: 3,
                        json: 4,
                    },
                    defaultPluginPackages: { commonjs: commonjs, typescript: typescript, json: json, replace: replace, terser: terser, nodeResolve: nodeResolve },
                    defaultPluginProps: {
                        options: options,
                        packageFileObject: packageFileObject,
                        absolutePath: absolutePath,
                        mode: "process.env",
                        configOption: configOption,
                    },
                })
                : defaultPlugins;
            allOptions.singleUMD = __assign(__assign({}, options), { output: singleUMD, external: function (id) {
                    if (umdGlobalIgnore_2.some(function (name) { return id.endsWith(name); }))
                        return true;
                }, plugins: plugins });
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
    var allMultipleRollupOptions = modes.map(function (mode) { return transformMultipleBuildConfig(cloneDeep(rollupConfig), packageFileObject, absolutePath, mode, options); });
    var allSingleRollupOptions = transformSingleBuildConfig(cloneDeep(rollupConfig), packageFileObject, absolutePath, options);
    var allDevBuild = allMultipleRollupOptions[0];
    var allProdBuild = allMultipleRollupOptions[1];
    var singleOther = allSingleRollupOptions["singleOther"];
    var singleDevUMD = allSingleRollupOptions["singleUMD"];
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
                absolutePath = packageScope ? resolve(process.cwd(), packageScope, packageName) : resolve(process.cwd(), packageName);
                packageFilePath = resolve(absolutePath, "package.json");
                tsconfigFilePath = resolve(absolutePath, "tsconfig.json");
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
                return [4 /*yield*/, readFile(packageFilePath, {
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
                _a.trys.push([1, 7, 8, 10]);
                output = rollupOptions.output, options = __rest(rollupOptions, ["output"]);
                return [4 /*yield*/, rollup(options)];
            case 2:
                bundle = _a.sent();
                if (!Array.isArray(output)) return [3 /*break*/, 4];
                return [4 /*yield*/, Promise.all(output.map(function (output) { return bundle === null || bundle === void 0 ? void 0 : bundle.write(output); }))];
            case 3:
                _a.sent();
                return [3 /*break*/, 6];
            case 4: return [4 /*yield*/, (bundle === null || bundle === void 0 ? void 0 : bundle.write(output))];
            case 5:
                _a.sent();
                _a.label = 6;
            case 6: return [3 /*break*/, 10];
            case 7:
                e_1 = _a.sent();
                logger().error("[build] build package '".concat(packageName, "' with '").concat(mode, "' mode in '").concat(type, "' format failed \n ").concat(e_1.message));
                process.exit(1);
                return [3 /*break*/, 10];
            case 8: return [4 /*yield*/, (bundle === null || bundle === void 0 ? void 0 : bundle.close())];
            case 9:
                _a.sent();
                return [7 /*endfinally*/];
            case 10:
                logger().info("[build] build package '".concat(packageName, "' with '").concat(mode, "' mode in '").concat(type, "' format success"));
                return [2 /*return*/];
        }
    });
}); };
var rollupBuild = function (options) { return __awaiter(void 0, void 0, void 0, function () {
    var aliasName, _a, singleOther, singleDevUMD, multipleDevOther, multipleDevUMD, multipleProdOther, multipleProdUMD, all_1, e_2;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                aliasName = options.alias || options.packageName;
                _b.label = 1;
            case 1:
                _b.trys.push([1, 4, , 5]);
                return [4 /*yield*/, getRollupConfigs(options)];
            case 2:
                _a = _b.sent(), singleOther = _a.singleOther, singleDevUMD = _a.singleDevUMD, multipleDevOther = _a.multipleDevOther, multipleDevUMD = _a.multipleDevUMD, multipleProdOther = _a.multipleProdOther, multipleProdUMD = _a.multipleProdUMD;
                all_1 = [];
                singleOther.map(function (config) {
                    var pkgName = config.pkgName;
                    var name = pkgName ? aliasName + "/" + pkgName : aliasName;
                    delete config.pkgName;
                    all_1.push(function () { return build(name, config, "process.env", uniq(config.output.map(function (v) { return v.format; })).join("&")); });
                });
                singleDevUMD.map(function (config) {
                    var pkgName = config.pkgName;
                    var name = pkgName ? aliasName + "/" + pkgName : aliasName;
                    delete config.pkgName;
                    all_1.push(function () { return build(name, config, "development", uniq(config.output.map(function (v) { return v.format; })).join("&")); });
                });
                multipleDevOther.map(function (config) {
                    var pkgName = config.pkgName;
                    var name = pkgName ? aliasName + "/" + pkgName : aliasName;
                    delete config.pkgName;
                    all_1.push(function () { return build(name, config, "development", uniq(config.output.map(function (v) { return v.format; })).join("&")); });
                });
                multipleDevUMD.map(function (config) {
                    var pkgName = config.pkgName;
                    var name = pkgName ? aliasName + "/" + pkgName : aliasName;
                    delete config.pkgName;
                    all_1.push(function () { return build(name, config, "development", uniq(config.output.map(function (v) { return v.format; })).join("&")); });
                });
                multipleProdOther.map(function (config) {
                    var pkgName = config.pkgName;
                    var name = pkgName ? aliasName + "/" + pkgName : aliasName;
                    delete config.pkgName;
                    all_1.push(function () { return build(name, config, "production", uniq(config.output.map(function (v) { return v.format; })).join("&")); });
                });
                multipleProdUMD.map(function (config) {
                    var pkgName = config.pkgName;
                    var name = pkgName ? aliasName + "/" + pkgName : aliasName;
                    delete config.pkgName;
                    all_1.push(function () { return build(name, config, "production", uniq(config.output.map(function (v) { return v.format; })).join("&")); });
                });
                return [4 /*yield*/, Promise.all(all_1.map(function (f) { return f(); }))];
            case 3:
                _b.sent();
                return [3 /*break*/, 5];
            case 4:
                e_2 = _b.sent();
                logger().error(e_2 === null || e_2 === void 0 ? void 0 : e_2.message);
                process.exit(1);
                return [3 /*break*/, 5];
            case 5: return [2 /*return*/];
        }
    });
}); };

var watch = function (packageName, rollupOptions, mode, type) {
    rollupOptions.watch = {
        buildDelay: 100,
    };
    var watcher = watch$1(rollupOptions);
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
    var aliasName, _a, singleOther, singleDevUMD, multipleDevOther, multipleDevUMD, umdBuild, e_1;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                aliasName = options.alias || options.packageName;
                _b.label = 1;
            case 1:
                _b.trys.push([1, 3, , 4]);
                return [4 /*yield*/, getRollupConfigs(options)];
            case 2:
                _a = _b.sent(), singleOther = _a.singleOther, singleDevUMD = _a.singleDevUMD, multipleDevOther = _a.multipleDevOther, multipleDevUMD = _a.multipleDevUMD;
                umdBuild = singleDevUMD.length ? singleDevUMD : multipleDevUMD;
                singleOther.forEach(function (config) {
                    var pkgName = config.pkgName;
                    var name = pkgName ? aliasName + "/" + pkgName : aliasName;
                    delete config.pkgName;
                    watch(name, config, "process.env", uniq(config.output.map(function (v) { return v.format; })).join("&"));
                });
                multipleDevOther.forEach(function (config) {
                    var pkgName = config.pkgName;
                    var name = pkgName ? aliasName + "/" + pkgName : aliasName;
                    delete config.pkgName;
                    watch(name, config, "development", uniq(config.output.map(function (v) { return v.format; })).join("&"));
                });
                umdBuild.forEach(function (config) {
                    var pkgName = config.pkgName;
                    var name = pkgName ? aliasName + "/" + pkgName : aliasName;
                    delete config.pkgName;
                    watch(name, config, "development", uniq(config.output.map(function (v) { return v.format; })).join("&"));
                });
                return [3 /*break*/, 4];
            case 3:
                e_1 = _b.sent();
                logger().error(e_1 === null || e_1 === void 0 ? void 0 : e_1.message);
                process.exit(1);
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); };

export { rollupBuild, rollupWatch };
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy8ucG5wbS9Acm9sbHVwK3BsdWdpbi10eXBlc2NyaXB0QDEyLjEuNF9yb2xsdXBANC41Mi40X3RzbGliQDIuOC4xX3R5cGVzY3JpcHRANS43LjMvbm9kZV9tb2R1bGVzL3RzbGliL3RzbGliLmVzNi5qcyIsIi4uLy4uL3NyYy9sb2cudHMiLCIuLi8uLi9zcmMvc2FmZVBhcnNlLnRzIiwiLi4vLi4vc3JjL3JvbGx1cENvbmZpZy50cyIsIi4uLy4uL3NyYy9yb2xsdXBCdWlsZC50cyIsIi4uLy4uL3NyYy9yb2xsdXBXYXRjaC50cyJdLCJzb3VyY2VzQ29udGVudCI6WyIvKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXHJcbkNvcHlyaWdodCAoYykgTWljcm9zb2Z0IENvcnBvcmF0aW9uLlxyXG5cclxuUGVybWlzc2lvbiB0byB1c2UsIGNvcHksIG1vZGlmeSwgYW5kL29yIGRpc3RyaWJ1dGUgdGhpcyBzb2Z0d2FyZSBmb3IgYW55XHJcbnB1cnBvc2Ugd2l0aCBvciB3aXRob3V0IGZlZSBpcyBoZXJlYnkgZ3JhbnRlZC5cclxuXHJcblRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIgQU5EIFRIRSBBVVRIT1IgRElTQ0xBSU1TIEFMTCBXQVJSQU5USUVTIFdJVEhcclxuUkVHQVJEIFRPIFRISVMgU09GVFdBUkUgSU5DTFVESU5HIEFMTCBJTVBMSUVEIFdBUlJBTlRJRVMgT0YgTUVSQ0hBTlRBQklMSVRZXHJcbkFORCBGSVRORVNTLiBJTiBOTyBFVkVOVCBTSEFMTCBUSEUgQVVUSE9SIEJFIExJQUJMRSBGT1IgQU5ZIFNQRUNJQUwsIERJUkVDVCxcclxuSU5ESVJFQ1QsIE9SIENPTlNFUVVFTlRJQUwgREFNQUdFUyBPUiBBTlkgREFNQUdFUyBXSEFUU09FVkVSIFJFU1VMVElORyBGUk9NXHJcbkxPU1MgT0YgVVNFLCBEQVRBIE9SIFBST0ZJVFMsIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBORUdMSUdFTkNFIE9SXHJcbk9USEVSIFRPUlRJT1VTIEFDVElPTiwgQVJJU0lORyBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBVU0UgT1JcclxuUEVSRk9STUFOQ0UgT0YgVEhJUyBTT0ZUV0FSRS5cclxuKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiogKi9cclxuLyogZ2xvYmFsIFJlZmxlY3QsIFByb21pc2UsIFN1cHByZXNzZWRFcnJvciwgU3ltYm9sLCBJdGVyYXRvciAqL1xyXG5cclxudmFyIGV4dGVuZFN0YXRpY3MgPSBmdW5jdGlvbihkLCBiKSB7XHJcbiAgICBleHRlbmRTdGF0aWNzID0gT2JqZWN0LnNldFByb3RvdHlwZU9mIHx8XHJcbiAgICAgICAgKHsgX19wcm90b19fOiBbXSB9IGluc3RhbmNlb2YgQXJyYXkgJiYgZnVuY3Rpb24gKGQsIGIpIHsgZC5fX3Byb3RvX18gPSBiOyB9KSB8fFxyXG4gICAgICAgIGZ1bmN0aW9uIChkLCBiKSB7IGZvciAodmFyIHAgaW4gYikgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChiLCBwKSkgZFtwXSA9IGJbcF07IH07XHJcbiAgICByZXR1cm4gZXh0ZW5kU3RhdGljcyhkLCBiKTtcclxufTtcclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX2V4dGVuZHMoZCwgYikge1xyXG4gICAgaWYgKHR5cGVvZiBiICE9PSBcImZ1bmN0aW9uXCIgJiYgYiAhPT0gbnVsbClcclxuICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKFwiQ2xhc3MgZXh0ZW5kcyB2YWx1ZSBcIiArIFN0cmluZyhiKSArIFwiIGlzIG5vdCBhIGNvbnN0cnVjdG9yIG9yIG51bGxcIik7XHJcbiAgICBleHRlbmRTdGF0aWNzKGQsIGIpO1xyXG4gICAgZnVuY3Rpb24gX18oKSB7IHRoaXMuY29uc3RydWN0b3IgPSBkOyB9XHJcbiAgICBkLnByb3RvdHlwZSA9IGIgPT09IG51bGwgPyBPYmplY3QuY3JlYXRlKGIpIDogKF9fLnByb3RvdHlwZSA9IGIucHJvdG90eXBlLCBuZXcgX18oKSk7XHJcbn1cclxuXHJcbmV4cG9ydCB2YXIgX19hc3NpZ24gPSBmdW5jdGlvbigpIHtcclxuICAgIF9fYXNzaWduID0gT2JqZWN0LmFzc2lnbiB8fCBmdW5jdGlvbiBfX2Fzc2lnbih0KSB7XHJcbiAgICAgICAgZm9yICh2YXIgcywgaSA9IDEsIG4gPSBhcmd1bWVudHMubGVuZ3RoOyBpIDwgbjsgaSsrKSB7XHJcbiAgICAgICAgICAgIHMgPSBhcmd1bWVudHNbaV07XHJcbiAgICAgICAgICAgIGZvciAodmFyIHAgaW4gcykgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChzLCBwKSkgdFtwXSA9IHNbcF07XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB0O1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIF9fYXNzaWduLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX3Jlc3QocywgZSkge1xyXG4gICAgdmFyIHQgPSB7fTtcclxuICAgIGZvciAodmFyIHAgaW4gcykgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChzLCBwKSAmJiBlLmluZGV4T2YocCkgPCAwKVxyXG4gICAgICAgIHRbcF0gPSBzW3BdO1xyXG4gICAgaWYgKHMgIT0gbnVsbCAmJiB0eXBlb2YgT2JqZWN0LmdldE93blByb3BlcnR5U3ltYm9scyA9PT0gXCJmdW5jdGlvblwiKVxyXG4gICAgICAgIGZvciAodmFyIGkgPSAwLCBwID0gT2JqZWN0LmdldE93blByb3BlcnR5U3ltYm9scyhzKTsgaSA8IHAubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgaWYgKGUuaW5kZXhPZihwW2ldKSA8IDAgJiYgT2JqZWN0LnByb3RvdHlwZS5wcm9wZXJ0eUlzRW51bWVyYWJsZS5jYWxsKHMsIHBbaV0pKVxyXG4gICAgICAgICAgICAgICAgdFtwW2ldXSA9IHNbcFtpXV07XHJcbiAgICAgICAgfVxyXG4gICAgcmV0dXJuIHQ7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX2RlY29yYXRlKGRlY29yYXRvcnMsIHRhcmdldCwga2V5LCBkZXNjKSB7XHJcbiAgICB2YXIgYyA9IGFyZ3VtZW50cy5sZW5ndGgsIHIgPSBjIDwgMyA/IHRhcmdldCA6IGRlc2MgPT09IG51bGwgPyBkZXNjID0gT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcih0YXJnZXQsIGtleSkgOiBkZXNjLCBkO1xyXG4gICAgaWYgKHR5cGVvZiBSZWZsZWN0ID09PSBcIm9iamVjdFwiICYmIHR5cGVvZiBSZWZsZWN0LmRlY29yYXRlID09PSBcImZ1bmN0aW9uXCIpIHIgPSBSZWZsZWN0LmRlY29yYXRlKGRlY29yYXRvcnMsIHRhcmdldCwga2V5LCBkZXNjKTtcclxuICAgIGVsc2UgZm9yICh2YXIgaSA9IGRlY29yYXRvcnMubGVuZ3RoIC0gMTsgaSA+PSAwOyBpLS0pIGlmIChkID0gZGVjb3JhdG9yc1tpXSkgciA9IChjIDwgMyA/IGQocikgOiBjID4gMyA/IGQodGFyZ2V0LCBrZXksIHIpIDogZCh0YXJnZXQsIGtleSkpIHx8IHI7XHJcbiAgICByZXR1cm4gYyA+IDMgJiYgciAmJiBPYmplY3QuZGVmaW5lUHJvcGVydHkodGFyZ2V0LCBrZXksIHIpLCByO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19wYXJhbShwYXJhbUluZGV4LCBkZWNvcmF0b3IpIHtcclxuICAgIHJldHVybiBmdW5jdGlvbiAodGFyZ2V0LCBrZXkpIHsgZGVjb3JhdG9yKHRhcmdldCwga2V5LCBwYXJhbUluZGV4KTsgfVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19lc0RlY29yYXRlKGN0b3IsIGRlc2NyaXB0b3JJbiwgZGVjb3JhdG9ycywgY29udGV4dEluLCBpbml0aWFsaXplcnMsIGV4dHJhSW5pdGlhbGl6ZXJzKSB7XHJcbiAgICBmdW5jdGlvbiBhY2NlcHQoZikgeyBpZiAoZiAhPT0gdm9pZCAwICYmIHR5cGVvZiBmICE9PSBcImZ1bmN0aW9uXCIpIHRocm93IG5ldyBUeXBlRXJyb3IoXCJGdW5jdGlvbiBleHBlY3RlZFwiKTsgcmV0dXJuIGY7IH1cclxuICAgIHZhciBraW5kID0gY29udGV4dEluLmtpbmQsIGtleSA9IGtpbmQgPT09IFwiZ2V0dGVyXCIgPyBcImdldFwiIDoga2luZCA9PT0gXCJzZXR0ZXJcIiA/IFwic2V0XCIgOiBcInZhbHVlXCI7XHJcbiAgICB2YXIgdGFyZ2V0ID0gIWRlc2NyaXB0b3JJbiAmJiBjdG9yID8gY29udGV4dEluW1wic3RhdGljXCJdID8gY3RvciA6IGN0b3IucHJvdG90eXBlIDogbnVsbDtcclxuICAgIHZhciBkZXNjcmlwdG9yID0gZGVzY3JpcHRvckluIHx8ICh0YXJnZXQgPyBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKHRhcmdldCwgY29udGV4dEluLm5hbWUpIDoge30pO1xyXG4gICAgdmFyIF8sIGRvbmUgPSBmYWxzZTtcclxuICAgIGZvciAodmFyIGkgPSBkZWNvcmF0b3JzLmxlbmd0aCAtIDE7IGkgPj0gMDsgaS0tKSB7XHJcbiAgICAgICAgdmFyIGNvbnRleHQgPSB7fTtcclxuICAgICAgICBmb3IgKHZhciBwIGluIGNvbnRleHRJbikgY29udGV4dFtwXSA9IHAgPT09IFwiYWNjZXNzXCIgPyB7fSA6IGNvbnRleHRJbltwXTtcclxuICAgICAgICBmb3IgKHZhciBwIGluIGNvbnRleHRJbi5hY2Nlc3MpIGNvbnRleHQuYWNjZXNzW3BdID0gY29udGV4dEluLmFjY2Vzc1twXTtcclxuICAgICAgICBjb250ZXh0LmFkZEluaXRpYWxpemVyID0gZnVuY3Rpb24gKGYpIHsgaWYgKGRvbmUpIHRocm93IG5ldyBUeXBlRXJyb3IoXCJDYW5ub3QgYWRkIGluaXRpYWxpemVycyBhZnRlciBkZWNvcmF0aW9uIGhhcyBjb21wbGV0ZWRcIik7IGV4dHJhSW5pdGlhbGl6ZXJzLnB1c2goYWNjZXB0KGYgfHwgbnVsbCkpOyB9O1xyXG4gICAgICAgIHZhciByZXN1bHQgPSAoMCwgZGVjb3JhdG9yc1tpXSkoa2luZCA9PT0gXCJhY2Nlc3NvclwiID8geyBnZXQ6IGRlc2NyaXB0b3IuZ2V0LCBzZXQ6IGRlc2NyaXB0b3Iuc2V0IH0gOiBkZXNjcmlwdG9yW2tleV0sIGNvbnRleHQpO1xyXG4gICAgICAgIGlmIChraW5kID09PSBcImFjY2Vzc29yXCIpIHtcclxuICAgICAgICAgICAgaWYgKHJlc3VsdCA9PT0gdm9pZCAwKSBjb250aW51ZTtcclxuICAgICAgICAgICAgaWYgKHJlc3VsdCA9PT0gbnVsbCB8fCB0eXBlb2YgcmVzdWx0ICE9PSBcIm9iamVjdFwiKSB0aHJvdyBuZXcgVHlwZUVycm9yKFwiT2JqZWN0IGV4cGVjdGVkXCIpO1xyXG4gICAgICAgICAgICBpZiAoXyA9IGFjY2VwdChyZXN1bHQuZ2V0KSkgZGVzY3JpcHRvci5nZXQgPSBfO1xyXG4gICAgICAgICAgICBpZiAoXyA9IGFjY2VwdChyZXN1bHQuc2V0KSkgZGVzY3JpcHRvci5zZXQgPSBfO1xyXG4gICAgICAgICAgICBpZiAoXyA9IGFjY2VwdChyZXN1bHQuaW5pdCkpIGluaXRpYWxpemVycy51bnNoaWZ0KF8pO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIGlmIChfID0gYWNjZXB0KHJlc3VsdCkpIHtcclxuICAgICAgICAgICAgaWYgKGtpbmQgPT09IFwiZmllbGRcIikgaW5pdGlhbGl6ZXJzLnVuc2hpZnQoXyk7XHJcbiAgICAgICAgICAgIGVsc2UgZGVzY3JpcHRvcltrZXldID0gXztcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBpZiAodGFyZ2V0KSBPYmplY3QuZGVmaW5lUHJvcGVydHkodGFyZ2V0LCBjb250ZXh0SW4ubmFtZSwgZGVzY3JpcHRvcik7XHJcbiAgICBkb25lID0gdHJ1ZTtcclxufTtcclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX3J1bkluaXRpYWxpemVycyh0aGlzQXJnLCBpbml0aWFsaXplcnMsIHZhbHVlKSB7XHJcbiAgICB2YXIgdXNlVmFsdWUgPSBhcmd1bWVudHMubGVuZ3RoID4gMjtcclxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgaW5pdGlhbGl6ZXJzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgdmFsdWUgPSB1c2VWYWx1ZSA/IGluaXRpYWxpemVyc1tpXS5jYWxsKHRoaXNBcmcsIHZhbHVlKSA6IGluaXRpYWxpemVyc1tpXS5jYWxsKHRoaXNBcmcpO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIHVzZVZhbHVlID8gdmFsdWUgOiB2b2lkIDA7XHJcbn07XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19wcm9wS2V5KHgpIHtcclxuICAgIHJldHVybiB0eXBlb2YgeCA9PT0gXCJzeW1ib2xcIiA/IHggOiBcIlwiLmNvbmNhdCh4KTtcclxufTtcclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX3NldEZ1bmN0aW9uTmFtZShmLCBuYW1lLCBwcmVmaXgpIHtcclxuICAgIGlmICh0eXBlb2YgbmFtZSA9PT0gXCJzeW1ib2xcIikgbmFtZSA9IG5hbWUuZGVzY3JpcHRpb24gPyBcIltcIi5jb25jYXQobmFtZS5kZXNjcmlwdGlvbiwgXCJdXCIpIDogXCJcIjtcclxuICAgIHJldHVybiBPYmplY3QuZGVmaW5lUHJvcGVydHkoZiwgXCJuYW1lXCIsIHsgY29uZmlndXJhYmxlOiB0cnVlLCB2YWx1ZTogcHJlZml4ID8gXCJcIi5jb25jYXQocHJlZml4LCBcIiBcIiwgbmFtZSkgOiBuYW1lIH0pO1xyXG59O1xyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fbWV0YWRhdGEobWV0YWRhdGFLZXksIG1ldGFkYXRhVmFsdWUpIHtcclxuICAgIGlmICh0eXBlb2YgUmVmbGVjdCA9PT0gXCJvYmplY3RcIiAmJiB0eXBlb2YgUmVmbGVjdC5tZXRhZGF0YSA9PT0gXCJmdW5jdGlvblwiKSByZXR1cm4gUmVmbGVjdC5tZXRhZGF0YShtZXRhZGF0YUtleSwgbWV0YWRhdGFWYWx1ZSk7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX2F3YWl0ZXIodGhpc0FyZywgX2FyZ3VtZW50cywgUCwgZ2VuZXJhdG9yKSB7XHJcbiAgICBmdW5jdGlvbiBhZG9wdCh2YWx1ZSkgeyByZXR1cm4gdmFsdWUgaW5zdGFuY2VvZiBQID8gdmFsdWUgOiBuZXcgUChmdW5jdGlvbiAocmVzb2x2ZSkgeyByZXNvbHZlKHZhbHVlKTsgfSk7IH1cclxuICAgIHJldHVybiBuZXcgKFAgfHwgKFAgPSBQcm9taXNlKSkoZnVuY3Rpb24gKHJlc29sdmUsIHJlamVjdCkge1xyXG4gICAgICAgIGZ1bmN0aW9uIGZ1bGZpbGxlZCh2YWx1ZSkgeyB0cnkgeyBzdGVwKGdlbmVyYXRvci5uZXh0KHZhbHVlKSk7IH0gY2F0Y2ggKGUpIHsgcmVqZWN0KGUpOyB9IH1cclxuICAgICAgICBmdW5jdGlvbiByZWplY3RlZCh2YWx1ZSkgeyB0cnkgeyBzdGVwKGdlbmVyYXRvcltcInRocm93XCJdKHZhbHVlKSk7IH0gY2F0Y2ggKGUpIHsgcmVqZWN0KGUpOyB9IH1cclxuICAgICAgICBmdW5jdGlvbiBzdGVwKHJlc3VsdCkgeyByZXN1bHQuZG9uZSA/IHJlc29sdmUocmVzdWx0LnZhbHVlKSA6IGFkb3B0KHJlc3VsdC52YWx1ZSkudGhlbihmdWxmaWxsZWQsIHJlamVjdGVkKTsgfVxyXG4gICAgICAgIHN0ZXAoKGdlbmVyYXRvciA9IGdlbmVyYXRvci5hcHBseSh0aGlzQXJnLCBfYXJndW1lbnRzIHx8IFtdKSkubmV4dCgpKTtcclxuICAgIH0pO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19nZW5lcmF0b3IodGhpc0FyZywgYm9keSkge1xyXG4gICAgdmFyIF8gPSB7IGxhYmVsOiAwLCBzZW50OiBmdW5jdGlvbigpIHsgaWYgKHRbMF0gJiAxKSB0aHJvdyB0WzFdOyByZXR1cm4gdFsxXTsgfSwgdHJ5czogW10sIG9wczogW10gfSwgZiwgeSwgdCwgZyA9IE9iamVjdC5jcmVhdGUoKHR5cGVvZiBJdGVyYXRvciA9PT0gXCJmdW5jdGlvblwiID8gSXRlcmF0b3IgOiBPYmplY3QpLnByb3RvdHlwZSk7XHJcbiAgICByZXR1cm4gZy5uZXh0ID0gdmVyYigwKSwgZ1tcInRocm93XCJdID0gdmVyYigxKSwgZ1tcInJldHVyblwiXSA9IHZlcmIoMiksIHR5cGVvZiBTeW1ib2wgPT09IFwiZnVuY3Rpb25cIiAmJiAoZ1tTeW1ib2wuaXRlcmF0b3JdID0gZnVuY3Rpb24oKSB7IHJldHVybiB0aGlzOyB9KSwgZztcclxuICAgIGZ1bmN0aW9uIHZlcmIobikgeyByZXR1cm4gZnVuY3Rpb24gKHYpIHsgcmV0dXJuIHN0ZXAoW24sIHZdKTsgfTsgfVxyXG4gICAgZnVuY3Rpb24gc3RlcChvcCkge1xyXG4gICAgICAgIGlmIChmKSB0aHJvdyBuZXcgVHlwZUVycm9yKFwiR2VuZXJhdG9yIGlzIGFscmVhZHkgZXhlY3V0aW5nLlwiKTtcclxuICAgICAgICB3aGlsZSAoZyAmJiAoZyA9IDAsIG9wWzBdICYmIChfID0gMCkpLCBfKSB0cnkge1xyXG4gICAgICAgICAgICBpZiAoZiA9IDEsIHkgJiYgKHQgPSBvcFswXSAmIDIgPyB5W1wicmV0dXJuXCJdIDogb3BbMF0gPyB5W1widGhyb3dcIl0gfHwgKCh0ID0geVtcInJldHVyblwiXSkgJiYgdC5jYWxsKHkpLCAwKSA6IHkubmV4dCkgJiYgISh0ID0gdC5jYWxsKHksIG9wWzFdKSkuZG9uZSkgcmV0dXJuIHQ7XHJcbiAgICAgICAgICAgIGlmICh5ID0gMCwgdCkgb3AgPSBbb3BbMF0gJiAyLCB0LnZhbHVlXTtcclxuICAgICAgICAgICAgc3dpdGNoIChvcFswXSkge1xyXG4gICAgICAgICAgICAgICAgY2FzZSAwOiBjYXNlIDE6IHQgPSBvcDsgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICBjYXNlIDQ6IF8ubGFiZWwrKzsgcmV0dXJuIHsgdmFsdWU6IG9wWzFdLCBkb25lOiBmYWxzZSB9O1xyXG4gICAgICAgICAgICAgICAgY2FzZSA1OiBfLmxhYmVsKys7IHkgPSBvcFsxXTsgb3AgPSBbMF07IGNvbnRpbnVlO1xyXG4gICAgICAgICAgICAgICAgY2FzZSA3OiBvcCA9IF8ub3BzLnBvcCgpOyBfLnRyeXMucG9wKCk7IGNvbnRpbnVlO1xyXG4gICAgICAgICAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgICAgICAgICAgICBpZiAoISh0ID0gXy50cnlzLCB0ID0gdC5sZW5ndGggPiAwICYmIHRbdC5sZW5ndGggLSAxXSkgJiYgKG9wWzBdID09PSA2IHx8IG9wWzBdID09PSAyKSkgeyBfID0gMDsgY29udGludWU7IH1cclxuICAgICAgICAgICAgICAgICAgICBpZiAob3BbMF0gPT09IDMgJiYgKCF0IHx8IChvcFsxXSA+IHRbMF0gJiYgb3BbMV0gPCB0WzNdKSkpIHsgXy5sYWJlbCA9IG9wWzFdOyBicmVhazsgfVxyXG4gICAgICAgICAgICAgICAgICAgIGlmIChvcFswXSA9PT0gNiAmJiBfLmxhYmVsIDwgdFsxXSkgeyBfLmxhYmVsID0gdFsxXTsgdCA9IG9wOyBicmVhazsgfVxyXG4gICAgICAgICAgICAgICAgICAgIGlmICh0ICYmIF8ubGFiZWwgPCB0WzJdKSB7IF8ubGFiZWwgPSB0WzJdOyBfLm9wcy5wdXNoKG9wKTsgYnJlYWs7IH1cclxuICAgICAgICAgICAgICAgICAgICBpZiAodFsyXSkgXy5vcHMucG9wKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgXy50cnlzLnBvcCgpOyBjb250aW51ZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBvcCA9IGJvZHkuY2FsbCh0aGlzQXJnLCBfKTtcclxuICAgICAgICB9IGNhdGNoIChlKSB7IG9wID0gWzYsIGVdOyB5ID0gMDsgfSBmaW5hbGx5IHsgZiA9IHQgPSAwOyB9XHJcbiAgICAgICAgaWYgKG9wWzBdICYgNSkgdGhyb3cgb3BbMV07IHJldHVybiB7IHZhbHVlOiBvcFswXSA/IG9wWzFdIDogdm9pZCAwLCBkb25lOiB0cnVlIH07XHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCB2YXIgX19jcmVhdGVCaW5kaW5nID0gT2JqZWN0LmNyZWF0ZSA/IChmdW5jdGlvbihvLCBtLCBrLCBrMikge1xyXG4gICAgaWYgKGsyID09PSB1bmRlZmluZWQpIGsyID0gaztcclxuICAgIHZhciBkZXNjID0gT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcihtLCBrKTtcclxuICAgIGlmICghZGVzYyB8fCAoXCJnZXRcIiBpbiBkZXNjID8gIW0uX19lc01vZHVsZSA6IGRlc2Mud3JpdGFibGUgfHwgZGVzYy5jb25maWd1cmFibGUpKSB7XHJcbiAgICAgICAgZGVzYyA9IHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBmdW5jdGlvbigpIHsgcmV0dXJuIG1ba107IH0gfTtcclxuICAgIH1cclxuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShvLCBrMiwgZGVzYyk7XHJcbn0pIDogKGZ1bmN0aW9uKG8sIG0sIGssIGsyKSB7XHJcbiAgICBpZiAoazIgPT09IHVuZGVmaW5lZCkgazIgPSBrO1xyXG4gICAgb1trMl0gPSBtW2tdO1xyXG59KTtcclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX2V4cG9ydFN0YXIobSwgbykge1xyXG4gICAgZm9yICh2YXIgcCBpbiBtKSBpZiAocCAhPT0gXCJkZWZhdWx0XCIgJiYgIU9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvLCBwKSkgX19jcmVhdGVCaW5kaW5nKG8sIG0sIHApO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX192YWx1ZXMobykge1xyXG4gICAgdmFyIHMgPSB0eXBlb2YgU3ltYm9sID09PSBcImZ1bmN0aW9uXCIgJiYgU3ltYm9sLml0ZXJhdG9yLCBtID0gcyAmJiBvW3NdLCBpID0gMDtcclxuICAgIGlmIChtKSByZXR1cm4gbS5jYWxsKG8pO1xyXG4gICAgaWYgKG8gJiYgdHlwZW9mIG8ubGVuZ3RoID09PSBcIm51bWJlclwiKSByZXR1cm4ge1xyXG4gICAgICAgIG5leHQ6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgaWYgKG8gJiYgaSA+PSBvLmxlbmd0aCkgbyA9IHZvaWQgMDtcclxuICAgICAgICAgICAgcmV0dXJuIHsgdmFsdWU6IG8gJiYgb1tpKytdLCBkb25lOiAhbyB9O1xyXG4gICAgICAgIH1cclxuICAgIH07XHJcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKHMgPyBcIk9iamVjdCBpcyBub3QgaXRlcmFibGUuXCIgOiBcIlN5bWJvbC5pdGVyYXRvciBpcyBub3QgZGVmaW5lZC5cIik7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX3JlYWQobywgbikge1xyXG4gICAgdmFyIG0gPSB0eXBlb2YgU3ltYm9sID09PSBcImZ1bmN0aW9uXCIgJiYgb1tTeW1ib2wuaXRlcmF0b3JdO1xyXG4gICAgaWYgKCFtKSByZXR1cm4gbztcclxuICAgIHZhciBpID0gbS5jYWxsKG8pLCByLCBhciA9IFtdLCBlO1xyXG4gICAgdHJ5IHtcclxuICAgICAgICB3aGlsZSAoKG4gPT09IHZvaWQgMCB8fCBuLS0gPiAwKSAmJiAhKHIgPSBpLm5leHQoKSkuZG9uZSkgYXIucHVzaChyLnZhbHVlKTtcclxuICAgIH1cclxuICAgIGNhdGNoIChlcnJvcikgeyBlID0geyBlcnJvcjogZXJyb3IgfTsgfVxyXG4gICAgZmluYWxseSB7XHJcbiAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgaWYgKHIgJiYgIXIuZG9uZSAmJiAobSA9IGlbXCJyZXR1cm5cIl0pKSBtLmNhbGwoaSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGZpbmFsbHkgeyBpZiAoZSkgdGhyb3cgZS5lcnJvcjsgfVxyXG4gICAgfVxyXG4gICAgcmV0dXJuIGFyO1xyXG59XHJcblxyXG4vKiogQGRlcHJlY2F0ZWQgKi9cclxuZXhwb3J0IGZ1bmN0aW9uIF9fc3ByZWFkKCkge1xyXG4gICAgZm9yICh2YXIgYXIgPSBbXSwgaSA9IDA7IGkgPCBhcmd1bWVudHMubGVuZ3RoOyBpKyspXHJcbiAgICAgICAgYXIgPSBhci5jb25jYXQoX19yZWFkKGFyZ3VtZW50c1tpXSkpO1xyXG4gICAgcmV0dXJuIGFyO1xyXG59XHJcblxyXG4vKiogQGRlcHJlY2F0ZWQgKi9cclxuZXhwb3J0IGZ1bmN0aW9uIF9fc3ByZWFkQXJyYXlzKCkge1xyXG4gICAgZm9yICh2YXIgcyA9IDAsIGkgPSAwLCBpbCA9IGFyZ3VtZW50cy5sZW5ndGg7IGkgPCBpbDsgaSsrKSBzICs9IGFyZ3VtZW50c1tpXS5sZW5ndGg7XHJcbiAgICBmb3IgKHZhciByID0gQXJyYXkocyksIGsgPSAwLCBpID0gMDsgaSA8IGlsOyBpKyspXHJcbiAgICAgICAgZm9yICh2YXIgYSA9IGFyZ3VtZW50c1tpXSwgaiA9IDAsIGpsID0gYS5sZW5ndGg7IGogPCBqbDsgaisrLCBrKyspXHJcbiAgICAgICAgICAgIHJba10gPSBhW2pdO1xyXG4gICAgcmV0dXJuIHI7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX3NwcmVhZEFycmF5KHRvLCBmcm9tLCBwYWNrKSB7XHJcbiAgICBpZiAocGFjayB8fCBhcmd1bWVudHMubGVuZ3RoID09PSAyKSBmb3IgKHZhciBpID0gMCwgbCA9IGZyb20ubGVuZ3RoLCBhcjsgaSA8IGw7IGkrKykge1xyXG4gICAgICAgIGlmIChhciB8fCAhKGkgaW4gZnJvbSkpIHtcclxuICAgICAgICAgICAgaWYgKCFhcikgYXIgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChmcm9tLCAwLCBpKTtcclxuICAgICAgICAgICAgYXJbaV0gPSBmcm9tW2ldO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIHJldHVybiB0by5jb25jYXQoYXIgfHwgQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoZnJvbSkpO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19hd2FpdCh2KSB7XHJcbiAgICByZXR1cm4gdGhpcyBpbnN0YW5jZW9mIF9fYXdhaXQgPyAodGhpcy52ID0gdiwgdGhpcykgOiBuZXcgX19hd2FpdCh2KTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fYXN5bmNHZW5lcmF0b3IodGhpc0FyZywgX2FyZ3VtZW50cywgZ2VuZXJhdG9yKSB7XHJcbiAgICBpZiAoIVN5bWJvbC5hc3luY0l0ZXJhdG9yKSB0aHJvdyBuZXcgVHlwZUVycm9yKFwiU3ltYm9sLmFzeW5jSXRlcmF0b3IgaXMgbm90IGRlZmluZWQuXCIpO1xyXG4gICAgdmFyIGcgPSBnZW5lcmF0b3IuYXBwbHkodGhpc0FyZywgX2FyZ3VtZW50cyB8fCBbXSksIGksIHEgPSBbXTtcclxuICAgIHJldHVybiBpID0gT2JqZWN0LmNyZWF0ZSgodHlwZW9mIEFzeW5jSXRlcmF0b3IgPT09IFwiZnVuY3Rpb25cIiA/IEFzeW5jSXRlcmF0b3IgOiBPYmplY3QpLnByb3RvdHlwZSksIHZlcmIoXCJuZXh0XCIpLCB2ZXJiKFwidGhyb3dcIiksIHZlcmIoXCJyZXR1cm5cIiwgYXdhaXRSZXR1cm4pLCBpW1N5bWJvbC5hc3luY0l0ZXJhdG9yXSA9IGZ1bmN0aW9uICgpIHsgcmV0dXJuIHRoaXM7IH0sIGk7XHJcbiAgICBmdW5jdGlvbiBhd2FpdFJldHVybihmKSB7IHJldHVybiBmdW5jdGlvbiAodikgeyByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKHYpLnRoZW4oZiwgcmVqZWN0KTsgfTsgfVxyXG4gICAgZnVuY3Rpb24gdmVyYihuLCBmKSB7IGlmIChnW25dKSB7IGlbbl0gPSBmdW5jdGlvbiAodikgeyByZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24gKGEsIGIpIHsgcS5wdXNoKFtuLCB2LCBhLCBiXSkgPiAxIHx8IHJlc3VtZShuLCB2KTsgfSk7IH07IGlmIChmKSBpW25dID0gZihpW25dKTsgfSB9XHJcbiAgICBmdW5jdGlvbiByZXN1bWUobiwgdikgeyB0cnkgeyBzdGVwKGdbbl0odikpOyB9IGNhdGNoIChlKSB7IHNldHRsZShxWzBdWzNdLCBlKTsgfSB9XHJcbiAgICBmdW5jdGlvbiBzdGVwKHIpIHsgci52YWx1ZSBpbnN0YW5jZW9mIF9fYXdhaXQgPyBQcm9taXNlLnJlc29sdmUoci52YWx1ZS52KS50aGVuKGZ1bGZpbGwsIHJlamVjdCkgOiBzZXR0bGUocVswXVsyXSwgcik7IH1cclxuICAgIGZ1bmN0aW9uIGZ1bGZpbGwodmFsdWUpIHsgcmVzdW1lKFwibmV4dFwiLCB2YWx1ZSk7IH1cclxuICAgIGZ1bmN0aW9uIHJlamVjdCh2YWx1ZSkgeyByZXN1bWUoXCJ0aHJvd1wiLCB2YWx1ZSk7IH1cclxuICAgIGZ1bmN0aW9uIHNldHRsZShmLCB2KSB7IGlmIChmKHYpLCBxLnNoaWZ0KCksIHEubGVuZ3RoKSByZXN1bWUocVswXVswXSwgcVswXVsxXSk7IH1cclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fYXN5bmNEZWxlZ2F0b3Iobykge1xyXG4gICAgdmFyIGksIHA7XHJcbiAgICByZXR1cm4gaSA9IHt9LCB2ZXJiKFwibmV4dFwiKSwgdmVyYihcInRocm93XCIsIGZ1bmN0aW9uIChlKSB7IHRocm93IGU7IH0pLCB2ZXJiKFwicmV0dXJuXCIpLCBpW1N5bWJvbC5pdGVyYXRvcl0gPSBmdW5jdGlvbiAoKSB7IHJldHVybiB0aGlzOyB9LCBpO1xyXG4gICAgZnVuY3Rpb24gdmVyYihuLCBmKSB7IGlbbl0gPSBvW25dID8gZnVuY3Rpb24gKHYpIHsgcmV0dXJuIChwID0gIXApID8geyB2YWx1ZTogX19hd2FpdChvW25dKHYpKSwgZG9uZTogZmFsc2UgfSA6IGYgPyBmKHYpIDogdjsgfSA6IGY7IH1cclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fYXN5bmNWYWx1ZXMobykge1xyXG4gICAgaWYgKCFTeW1ib2wuYXN5bmNJdGVyYXRvcikgdGhyb3cgbmV3IFR5cGVFcnJvcihcIlN5bWJvbC5hc3luY0l0ZXJhdG9yIGlzIG5vdCBkZWZpbmVkLlwiKTtcclxuICAgIHZhciBtID0gb1tTeW1ib2wuYXN5bmNJdGVyYXRvcl0sIGk7XHJcbiAgICByZXR1cm4gbSA/IG0uY2FsbChvKSA6IChvID0gdHlwZW9mIF9fdmFsdWVzID09PSBcImZ1bmN0aW9uXCIgPyBfX3ZhbHVlcyhvKSA6IG9bU3ltYm9sLml0ZXJhdG9yXSgpLCBpID0ge30sIHZlcmIoXCJuZXh0XCIpLCB2ZXJiKFwidGhyb3dcIiksIHZlcmIoXCJyZXR1cm5cIiksIGlbU3ltYm9sLmFzeW5jSXRlcmF0b3JdID0gZnVuY3Rpb24gKCkgeyByZXR1cm4gdGhpczsgfSwgaSk7XHJcbiAgICBmdW5jdGlvbiB2ZXJiKG4pIHsgaVtuXSA9IG9bbl0gJiYgZnVuY3Rpb24gKHYpIHsgcmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uIChyZXNvbHZlLCByZWplY3QpIHsgdiA9IG9bbl0odiksIHNldHRsZShyZXNvbHZlLCByZWplY3QsIHYuZG9uZSwgdi52YWx1ZSk7IH0pOyB9OyB9XHJcbiAgICBmdW5jdGlvbiBzZXR0bGUocmVzb2x2ZSwgcmVqZWN0LCBkLCB2KSB7IFByb21pc2UucmVzb2x2ZSh2KS50aGVuKGZ1bmN0aW9uKHYpIHsgcmVzb2x2ZSh7IHZhbHVlOiB2LCBkb25lOiBkIH0pOyB9LCByZWplY3QpOyB9XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX21ha2VUZW1wbGF0ZU9iamVjdChjb29rZWQsIHJhdykge1xyXG4gICAgaWYgKE9iamVjdC5kZWZpbmVQcm9wZXJ0eSkgeyBPYmplY3QuZGVmaW5lUHJvcGVydHkoY29va2VkLCBcInJhd1wiLCB7IHZhbHVlOiByYXcgfSk7IH0gZWxzZSB7IGNvb2tlZC5yYXcgPSByYXc7IH1cclxuICAgIHJldHVybiBjb29rZWQ7XHJcbn07XHJcblxyXG52YXIgX19zZXRNb2R1bGVEZWZhdWx0ID0gT2JqZWN0LmNyZWF0ZSA/IChmdW5jdGlvbihvLCB2KSB7XHJcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkobywgXCJkZWZhdWx0XCIsIHsgZW51bWVyYWJsZTogdHJ1ZSwgdmFsdWU6IHYgfSk7XHJcbn0pIDogZnVuY3Rpb24obywgdikge1xyXG4gICAgb1tcImRlZmF1bHRcIl0gPSB2O1xyXG59O1xyXG5cclxudmFyIG93bktleXMgPSBmdW5jdGlvbihvKSB7XHJcbiAgICBvd25LZXlzID0gT2JqZWN0LmdldE93blByb3BlcnR5TmFtZXMgfHwgZnVuY3Rpb24gKG8pIHtcclxuICAgICAgICB2YXIgYXIgPSBbXTtcclxuICAgICAgICBmb3IgKHZhciBrIGluIG8pIGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwobywgaykpIGFyW2FyLmxlbmd0aF0gPSBrO1xyXG4gICAgICAgIHJldHVybiBhcjtcclxuICAgIH07XHJcbiAgICByZXR1cm4gb3duS2V5cyhvKTtcclxufTtcclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX2ltcG9ydFN0YXIobW9kKSB7XHJcbiAgICBpZiAobW9kICYmIG1vZC5fX2VzTW9kdWxlKSByZXR1cm4gbW9kO1xyXG4gICAgdmFyIHJlc3VsdCA9IHt9O1xyXG4gICAgaWYgKG1vZCAhPSBudWxsKSBmb3IgKHZhciBrID0gb3duS2V5cyhtb2QpLCBpID0gMDsgaSA8IGsubGVuZ3RoOyBpKyspIGlmIChrW2ldICE9PSBcImRlZmF1bHRcIikgX19jcmVhdGVCaW5kaW5nKHJlc3VsdCwgbW9kLCBrW2ldKTtcclxuICAgIF9fc2V0TW9kdWxlRGVmYXVsdChyZXN1bHQsIG1vZCk7XHJcbiAgICByZXR1cm4gcmVzdWx0O1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19pbXBvcnREZWZhdWx0KG1vZCkge1xyXG4gICAgcmV0dXJuIChtb2QgJiYgbW9kLl9fZXNNb2R1bGUpID8gbW9kIDogeyBkZWZhdWx0OiBtb2QgfTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fY2xhc3NQcml2YXRlRmllbGRHZXQocmVjZWl2ZXIsIHN0YXRlLCBraW5kLCBmKSB7XHJcbiAgICBpZiAoa2luZCA9PT0gXCJhXCIgJiYgIWYpIHRocm93IG5ldyBUeXBlRXJyb3IoXCJQcml2YXRlIGFjY2Vzc29yIHdhcyBkZWZpbmVkIHdpdGhvdXQgYSBnZXR0ZXJcIik7XHJcbiAgICBpZiAodHlwZW9mIHN0YXRlID09PSBcImZ1bmN0aW9uXCIgPyByZWNlaXZlciAhPT0gc3RhdGUgfHwgIWYgOiAhc3RhdGUuaGFzKHJlY2VpdmVyKSkgdGhyb3cgbmV3IFR5cGVFcnJvcihcIkNhbm5vdCByZWFkIHByaXZhdGUgbWVtYmVyIGZyb20gYW4gb2JqZWN0IHdob3NlIGNsYXNzIGRpZCBub3QgZGVjbGFyZSBpdFwiKTtcclxuICAgIHJldHVybiBraW5kID09PSBcIm1cIiA/IGYgOiBraW5kID09PSBcImFcIiA/IGYuY2FsbChyZWNlaXZlcikgOiBmID8gZi52YWx1ZSA6IHN0YXRlLmdldChyZWNlaXZlcik7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX2NsYXNzUHJpdmF0ZUZpZWxkU2V0KHJlY2VpdmVyLCBzdGF0ZSwgdmFsdWUsIGtpbmQsIGYpIHtcclxuICAgIGlmIChraW5kID09PSBcIm1cIikgdGhyb3cgbmV3IFR5cGVFcnJvcihcIlByaXZhdGUgbWV0aG9kIGlzIG5vdCB3cml0YWJsZVwiKTtcclxuICAgIGlmIChraW5kID09PSBcImFcIiAmJiAhZikgdGhyb3cgbmV3IFR5cGVFcnJvcihcIlByaXZhdGUgYWNjZXNzb3Igd2FzIGRlZmluZWQgd2l0aG91dCBhIHNldHRlclwiKTtcclxuICAgIGlmICh0eXBlb2Ygc3RhdGUgPT09IFwiZnVuY3Rpb25cIiA/IHJlY2VpdmVyICE9PSBzdGF0ZSB8fCAhZiA6ICFzdGF0ZS5oYXMocmVjZWl2ZXIpKSB0aHJvdyBuZXcgVHlwZUVycm9yKFwiQ2Fubm90IHdyaXRlIHByaXZhdGUgbWVtYmVyIHRvIGFuIG9iamVjdCB3aG9zZSBjbGFzcyBkaWQgbm90IGRlY2xhcmUgaXRcIik7XHJcbiAgICByZXR1cm4gKGtpbmQgPT09IFwiYVwiID8gZi5jYWxsKHJlY2VpdmVyLCB2YWx1ZSkgOiBmID8gZi52YWx1ZSA9IHZhbHVlIDogc3RhdGUuc2V0KHJlY2VpdmVyLCB2YWx1ZSkpLCB2YWx1ZTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fY2xhc3NQcml2YXRlRmllbGRJbihzdGF0ZSwgcmVjZWl2ZXIpIHtcclxuICAgIGlmIChyZWNlaXZlciA9PT0gbnVsbCB8fCAodHlwZW9mIHJlY2VpdmVyICE9PSBcIm9iamVjdFwiICYmIHR5cGVvZiByZWNlaXZlciAhPT0gXCJmdW5jdGlvblwiKSkgdGhyb3cgbmV3IFR5cGVFcnJvcihcIkNhbm5vdCB1c2UgJ2luJyBvcGVyYXRvciBvbiBub24tb2JqZWN0XCIpO1xyXG4gICAgcmV0dXJuIHR5cGVvZiBzdGF0ZSA9PT0gXCJmdW5jdGlvblwiID8gcmVjZWl2ZXIgPT09IHN0YXRlIDogc3RhdGUuaGFzKHJlY2VpdmVyKTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fYWRkRGlzcG9zYWJsZVJlc291cmNlKGVudiwgdmFsdWUsIGFzeW5jKSB7XHJcbiAgICBpZiAodmFsdWUgIT09IG51bGwgJiYgdmFsdWUgIT09IHZvaWQgMCkge1xyXG4gICAgICAgIGlmICh0eXBlb2YgdmFsdWUgIT09IFwib2JqZWN0XCIgJiYgdHlwZW9mIHZhbHVlICE9PSBcImZ1bmN0aW9uXCIpIHRocm93IG5ldyBUeXBlRXJyb3IoXCJPYmplY3QgZXhwZWN0ZWQuXCIpO1xyXG4gICAgICAgIHZhciBkaXNwb3NlLCBpbm5lcjtcclxuICAgICAgICBpZiAoYXN5bmMpIHtcclxuICAgICAgICAgICAgaWYgKCFTeW1ib2wuYXN5bmNEaXNwb3NlKSB0aHJvdyBuZXcgVHlwZUVycm9yKFwiU3ltYm9sLmFzeW5jRGlzcG9zZSBpcyBub3QgZGVmaW5lZC5cIik7XHJcbiAgICAgICAgICAgIGRpc3Bvc2UgPSB2YWx1ZVtTeW1ib2wuYXN5bmNEaXNwb3NlXTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKGRpc3Bvc2UgPT09IHZvaWQgMCkge1xyXG4gICAgICAgICAgICBpZiAoIVN5bWJvbC5kaXNwb3NlKSB0aHJvdyBuZXcgVHlwZUVycm9yKFwiU3ltYm9sLmRpc3Bvc2UgaXMgbm90IGRlZmluZWQuXCIpO1xyXG4gICAgICAgICAgICBkaXNwb3NlID0gdmFsdWVbU3ltYm9sLmRpc3Bvc2VdO1xyXG4gICAgICAgICAgICBpZiAoYXN5bmMpIGlubmVyID0gZGlzcG9zZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKHR5cGVvZiBkaXNwb3NlICE9PSBcImZ1bmN0aW9uXCIpIHRocm93IG5ldyBUeXBlRXJyb3IoXCJPYmplY3Qgbm90IGRpc3Bvc2FibGUuXCIpO1xyXG4gICAgICAgIGlmIChpbm5lcikgZGlzcG9zZSA9IGZ1bmN0aW9uKCkgeyB0cnkgeyBpbm5lci5jYWxsKHRoaXMpOyB9IGNhdGNoIChlKSB7IHJldHVybiBQcm9taXNlLnJlamVjdChlKTsgfSB9O1xyXG4gICAgICAgIGVudi5zdGFjay5wdXNoKHsgdmFsdWU6IHZhbHVlLCBkaXNwb3NlOiBkaXNwb3NlLCBhc3luYzogYXN5bmMgfSk7XHJcbiAgICB9XHJcbiAgICBlbHNlIGlmIChhc3luYykge1xyXG4gICAgICAgIGVudi5zdGFjay5wdXNoKHsgYXN5bmM6IHRydWUgfSk7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gdmFsdWU7XHJcblxyXG59XHJcblxyXG52YXIgX1N1cHByZXNzZWRFcnJvciA9IHR5cGVvZiBTdXBwcmVzc2VkRXJyb3IgPT09IFwiZnVuY3Rpb25cIiA/IFN1cHByZXNzZWRFcnJvciA6IGZ1bmN0aW9uIChlcnJvciwgc3VwcHJlc3NlZCwgbWVzc2FnZSkge1xyXG4gICAgdmFyIGUgPSBuZXcgRXJyb3IobWVzc2FnZSk7XHJcbiAgICByZXR1cm4gZS5uYW1lID0gXCJTdXBwcmVzc2VkRXJyb3JcIiwgZS5lcnJvciA9IGVycm9yLCBlLnN1cHByZXNzZWQgPSBzdXBwcmVzc2VkLCBlO1xyXG59O1xyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fZGlzcG9zZVJlc291cmNlcyhlbnYpIHtcclxuICAgIGZ1bmN0aW9uIGZhaWwoZSkge1xyXG4gICAgICAgIGVudi5lcnJvciA9IGVudi5oYXNFcnJvciA/IG5ldyBfU3VwcHJlc3NlZEVycm9yKGUsIGVudi5lcnJvciwgXCJBbiBlcnJvciB3YXMgc3VwcHJlc3NlZCBkdXJpbmcgZGlzcG9zYWwuXCIpIDogZTtcclxuICAgICAgICBlbnYuaGFzRXJyb3IgPSB0cnVlO1xyXG4gICAgfVxyXG4gICAgdmFyIHIsIHMgPSAwO1xyXG4gICAgZnVuY3Rpb24gbmV4dCgpIHtcclxuICAgICAgICB3aGlsZSAociA9IGVudi5zdGFjay5wb3AoKSkge1xyXG4gICAgICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICAgICAgaWYgKCFyLmFzeW5jICYmIHMgPT09IDEpIHJldHVybiBzID0gMCwgZW52LnN0YWNrLnB1c2gociksIFByb21pc2UucmVzb2x2ZSgpLnRoZW4obmV4dCk7XHJcbiAgICAgICAgICAgICAgICBpZiAoci5kaXNwb3NlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIHJlc3VsdCA9IHIuZGlzcG9zZS5jYWxsKHIudmFsdWUpO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChyLmFzeW5jKSByZXR1cm4gcyB8PSAyLCBQcm9taXNlLnJlc29sdmUocmVzdWx0KS50aGVuKG5leHQsIGZ1bmN0aW9uKGUpIHsgZmFpbChlKTsgcmV0dXJuIG5leHQoKTsgfSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBlbHNlIHMgfD0gMTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBjYXRjaCAoZSkge1xyXG4gICAgICAgICAgICAgICAgZmFpbChlKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAocyA9PT0gMSkgcmV0dXJuIGVudi5oYXNFcnJvciA/IFByb21pc2UucmVqZWN0KGVudi5lcnJvcikgOiBQcm9taXNlLnJlc29sdmUoKTtcclxuICAgICAgICBpZiAoZW52Lmhhc0Vycm9yKSB0aHJvdyBlbnYuZXJyb3I7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gbmV4dCgpO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19yZXdyaXRlUmVsYXRpdmVJbXBvcnRFeHRlbnNpb24ocGF0aCwgcHJlc2VydmVKc3gpIHtcclxuICAgIGlmICh0eXBlb2YgcGF0aCA9PT0gXCJzdHJpbmdcIiAmJiAvXlxcLlxcLj9cXC8vLnRlc3QocGF0aCkpIHtcclxuICAgICAgICByZXR1cm4gcGF0aC5yZXBsYWNlKC9cXC4odHN4KSR8KCg/OlxcLmQpPykoKD86XFwuW14uL10rPyk/KVxcLihbY21dPyl0cyQvaSwgZnVuY3Rpb24gKG0sIHRzeCwgZCwgZXh0LCBjbSkge1xyXG4gICAgICAgICAgICByZXR1cm4gdHN4ID8gcHJlc2VydmVKc3ggPyBcIi5qc3hcIiA6IFwiLmpzXCIgOiBkICYmICghZXh0IHx8ICFjbSkgPyBtIDogKGQgKyBleHQgKyBcIi5cIiArIGNtLnRvTG93ZXJDYXNlKCkgKyBcImpzXCIpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIHBhdGg7XHJcbn1cclxuXHJcbmV4cG9ydCBkZWZhdWx0IHtcclxuICAgIF9fZXh0ZW5kczogX19leHRlbmRzLFxyXG4gICAgX19hc3NpZ246IF9fYXNzaWduLFxyXG4gICAgX19yZXN0OiBfX3Jlc3QsXHJcbiAgICBfX2RlY29yYXRlOiBfX2RlY29yYXRlLFxyXG4gICAgX19wYXJhbTogX19wYXJhbSxcclxuICAgIF9fZXNEZWNvcmF0ZTogX19lc0RlY29yYXRlLFxyXG4gICAgX19ydW5Jbml0aWFsaXplcnM6IF9fcnVuSW5pdGlhbGl6ZXJzLFxyXG4gICAgX19wcm9wS2V5OiBfX3Byb3BLZXksXHJcbiAgICBfX3NldEZ1bmN0aW9uTmFtZTogX19zZXRGdW5jdGlvbk5hbWUsXHJcbiAgICBfX21ldGFkYXRhOiBfX21ldGFkYXRhLFxyXG4gICAgX19hd2FpdGVyOiBfX2F3YWl0ZXIsXHJcbiAgICBfX2dlbmVyYXRvcjogX19nZW5lcmF0b3IsXHJcbiAgICBfX2NyZWF0ZUJpbmRpbmc6IF9fY3JlYXRlQmluZGluZyxcclxuICAgIF9fZXhwb3J0U3RhcjogX19leHBvcnRTdGFyLFxyXG4gICAgX192YWx1ZXM6IF9fdmFsdWVzLFxyXG4gICAgX19yZWFkOiBfX3JlYWQsXHJcbiAgICBfX3NwcmVhZDogX19zcHJlYWQsXHJcbiAgICBfX3NwcmVhZEFycmF5czogX19zcHJlYWRBcnJheXMsXHJcbiAgICBfX3NwcmVhZEFycmF5OiBfX3NwcmVhZEFycmF5LFxyXG4gICAgX19hd2FpdDogX19hd2FpdCxcclxuICAgIF9fYXN5bmNHZW5lcmF0b3I6IF9fYXN5bmNHZW5lcmF0b3IsXHJcbiAgICBfX2FzeW5jRGVsZWdhdG9yOiBfX2FzeW5jRGVsZWdhdG9yLFxyXG4gICAgX19hc3luY1ZhbHVlczogX19hc3luY1ZhbHVlcyxcclxuICAgIF9fbWFrZVRlbXBsYXRlT2JqZWN0OiBfX21ha2VUZW1wbGF0ZU9iamVjdCxcclxuICAgIF9faW1wb3J0U3RhcjogX19pbXBvcnRTdGFyLFxyXG4gICAgX19pbXBvcnREZWZhdWx0OiBfX2ltcG9ydERlZmF1bHQsXHJcbiAgICBfX2NsYXNzUHJpdmF0ZUZpZWxkR2V0OiBfX2NsYXNzUHJpdmF0ZUZpZWxkR2V0LFxyXG4gICAgX19jbGFzc1ByaXZhdGVGaWVsZFNldDogX19jbGFzc1ByaXZhdGVGaWVsZFNldCxcclxuICAgIF9fY2xhc3NQcml2YXRlRmllbGRJbjogX19jbGFzc1ByaXZhdGVGaWVsZEluLFxyXG4gICAgX19hZGREaXNwb3NhYmxlUmVzb3VyY2U6IF9fYWRkRGlzcG9zYWJsZVJlc291cmNlLFxyXG4gICAgX19kaXNwb3NlUmVzb3VyY2VzOiBfX2Rpc3Bvc2VSZXNvdXJjZXMsXHJcbiAgICBfX3Jld3JpdGVSZWxhdGl2ZUltcG9ydEV4dGVuc2lvbjogX19yZXdyaXRlUmVsYXRpdmVJbXBvcnRFeHRlbnNpb24sXHJcbn07XHJcbiIsbnVsbCxudWxsLG51bGwsbnVsbCxudWxsXSwibmFtZXMiOlsicm9sbHVwIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQWVBO0FBQ08sSUFBSSxRQUFRLEdBQUcsV0FBVztBQUNqQyxJQUFJLFFBQVEsR0FBRyxNQUFNLENBQUMsTUFBTSxJQUFJLFNBQVMsUUFBUSxDQUFDLENBQUMsRUFBRTtBQUNyRCxRQUFRLEtBQUssSUFBSSxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsU0FBUyxDQUFDLE1BQU0sRUFBRSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFO0FBQzdELFlBQVksQ0FBQyxHQUFHLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUM3QixZQUFZLEtBQUssSUFBSSxDQUFDLElBQUksQ0FBQyxFQUFFLElBQUksTUFBTSxDQUFDLFNBQVMsQ0FBQyxjQUFjLENBQUMsSUFBSSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ3pGLFFBQVEsQ0FBQztBQUNULFFBQVEsT0FBTyxDQUFDLENBQUM7QUFDakIsSUFBSSxFQUFDO0FBQ0wsSUFBSSxPQUFPLFFBQVEsQ0FBQyxLQUFLLENBQUMsSUFBSSxFQUFFLFNBQVMsQ0FBQyxDQUFDO0FBQzNDLEVBQUM7QUFDRDtBQUNPLFNBQVMsTUFBTSxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUU7QUFDN0IsSUFBSSxJQUFJLENBQUMsR0FBRyxFQUFFLENBQUM7QUFDZixJQUFJLEtBQUssSUFBSSxDQUFDLElBQUksQ0FBQyxFQUFFLElBQUksTUFBTSxDQUFDLFNBQVMsQ0FBQyxjQUFjLENBQUMsSUFBSSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUM7QUFDdkYsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ3BCLElBQUksSUFBSSxDQUFDLElBQUksSUFBSSxJQUFJLE9BQU8sTUFBTSxDQUFDLHFCQUFxQixLQUFLLFVBQVU7QUFDdkUsUUFBUSxLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsTUFBTSxDQUFDLHFCQUFxQixDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFO0FBQ2hGLFlBQVksSUFBSSxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsSUFBSSxNQUFNLENBQUMsU0FBUyxDQUFDLG9CQUFvQixDQUFDLElBQUksQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQzFGLGdCQUFnQixDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ2xDLFFBQVEsQ0FBQztBQUNULElBQUksT0FBTyxDQUFDLENBQUM7QUFDYixDQUFDO0FBNkREO0FBQ08sU0FBUyxTQUFTLENBQUMsT0FBTyxFQUFFLFVBQVUsRUFBRSxDQUFDLEVBQUUsU0FBUyxFQUFFO0FBQzdELElBQUksU0FBUyxLQUFLLENBQUMsS0FBSyxFQUFFLEVBQUUsT0FBTyxLQUFLLFlBQVksQ0FBQyxHQUFHLEtBQUssR0FBRyxJQUFJLENBQUMsQ0FBQyxVQUFVLE9BQU8sRUFBRSxFQUFFLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUNoSCxJQUFJLE9BQU8sS0FBSyxDQUFDLEtBQUssQ0FBQyxHQUFHLE9BQU8sQ0FBQyxFQUFFLFVBQVUsT0FBTyxFQUFFLE1BQU0sRUFBRTtBQUMvRCxRQUFRLFNBQVMsU0FBUyxDQUFDLEtBQUssRUFBRSxFQUFFLElBQUksRUFBRSxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxFQUFFLEVBQUUsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDbkcsUUFBUSxTQUFTLFFBQVEsQ0FBQyxLQUFLLEVBQUUsRUFBRSxJQUFJLEVBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxFQUFFLEVBQUUsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDdEcsUUFBUSxTQUFTLElBQUksQ0FBQyxNQUFNLEVBQUUsRUFBRSxNQUFNLENBQUMsSUFBSSxHQUFHLE9BQU8sQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLEdBQUcsS0FBSyxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQyxJQUFJLENBQUMsU0FBUyxFQUFFLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUN0SCxRQUFRLElBQUksQ0FBQyxDQUFDLFNBQVMsR0FBRyxTQUFTLENBQUMsS0FBSyxDQUFDLE9BQU8sRUFBRSxVQUFVLElBQUksRUFBRSxDQUFDLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQztBQUM5RSxJQUFJLENBQUMsQ0FBQyxDQUFDO0FBQ1AsQ0FBQztBQUNEO0FBQ08sU0FBUyxXQUFXLENBQUMsT0FBTyxFQUFFLElBQUksRUFBRTtBQUMzQyxJQUFJLElBQUksQ0FBQyxHQUFHLEVBQUUsS0FBSyxFQUFFLENBQUMsRUFBRSxJQUFJLEVBQUUsV0FBVyxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsRUFBRSxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLElBQUksRUFBRSxFQUFFLEVBQUUsR0FBRyxFQUFFLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsR0FBRyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUMsT0FBTyxRQUFRLEtBQUssVUFBVSxHQUFHLFFBQVEsR0FBRyxNQUFNLEVBQUUsU0FBUyxDQUFDLENBQUM7QUFDck0sSUFBSSxPQUFPLENBQUMsQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxPQUFPLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxPQUFPLE1BQU0sS0FBSyxVQUFVLEtBQUssQ0FBQyxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsR0FBRyxXQUFXLEVBQUUsT0FBTyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUM7QUFDaEssSUFBSSxTQUFTLElBQUksQ0FBQyxDQUFDLEVBQUUsRUFBRSxPQUFPLFVBQVUsQ0FBQyxFQUFFLEVBQUUsT0FBTyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDdEUsSUFBSSxTQUFTLElBQUksQ0FBQyxFQUFFLEVBQUU7QUFDdEIsUUFBUSxJQUFJLENBQUMsRUFBRSxNQUFNLElBQUksU0FBUyxDQUFDLGlDQUFpQyxDQUFDLENBQUM7QUFDdEUsUUFBUSxPQUFPLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsSUFBSTtBQUN0RCxZQUFZLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMs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
