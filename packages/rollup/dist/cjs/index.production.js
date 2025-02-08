'use strict';

var uniq = require('lodash/uniq');
var rollup = require('rollup');
var pino = require('pino');
var pretty = require('pino-pretty');
var commonjs = require('@rollup/plugin-commonjs');
var json = require('@rollup/plugin-json');
var pluginNodeResolve = require('@rollup/plugin-node-resolve');
var replace = require('@rollup/plugin-replace');
var terser = require('@rollup/plugin-terser');
var typescript = require('@rollup/plugin-typescript');
var fs = require('fs');
var promises = require('fs/promises');
var cloneDeep = require('lodash/cloneDeep');
var path = require('path');

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
var tsConfig = function (absolutePath, mode, sourceMap, type) {
    return typescript({
        cacheDir: path.resolve(absolutePath, ".cache"),
        tsconfig: path.resolve(absolutePath, "tsconfig.json"),
        sourceMap: sourceMap,
        declaration: type === "type" ? true : false,
        declarationMap: type === "type" ? true : false,
        declarationDir: type === "type" ? path.resolve(absolutePath, "dist/types") : null,
    });
};
var transformMultipleBuildConfig = function (options, packageFileObject, absolutePath, mode, configOption) {
    var _a, _b;
    var _c, _d, _e, _f, _g, _h;
    var allOptions = {};
    if (typeof options.input === "string" && !options.input.startsWith(absolutePath)) {
        options.input = path.resolve(absolutePath, options.input);
    }
    if (options.output) {
        options.output = Array.isArray(options.output) ? options.output : [options.output];
        var CustomOutput = options.output.filter(function (output) { return output.multiple; });
        var umdGlobalIgnore_1 = [];
        options.output = CustomOutput.map(function (output) {
            if (output.dir && !output.dir.startsWith(absolutePath)) {
                output.dir = path.resolve(absolutePath, output.dir);
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
                output.file = path.resolve(absolutePath, output.file);
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
                currentTsConfig = tsConfig(absolutePath, mode, multipleOtherSourceMap, "type");
            }
            multipleOtherConfig.forEach(function (config) { return delete config.type; });
            var pluginsBuilder = mode === "development" ? (_c = configOption.plugins) === null || _c === void 0 ? void 0 : _c.multipleDevOther : (_d = configOption.plugins) === null || _d === void 0 ? void 0 : _d.multipleProdOther;
            var defaultPlugins = [
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
                    defaultPluginPackages: { commonjs: commonjs, typescript: typescript, json: json, replace: replace, terser: terser, nodeResolve: pluginNodeResolve.nodeResolve },
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
                currentTsConfig = tsConfig(absolutePath, mode, multipleUMDSourceMap, "type");
            }
            multipleUMDConfig.forEach(function (config) { return delete config.type; });
            var pluginsBuilder = mode === "development" ? (_g = configOption.plugins) === null || _g === void 0 ? void 0 : _g.multipleDevUMD : (_h = configOption.plugins) === null || _h === void 0 ? void 0 : _h.multipleProdUMD;
            var defaultPlugins = [
                pluginNodeResolve.nodeResolve(),
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
                    defaultPluginPackages: { commonjs: commonjs, typescript: typescript, json: json, replace: replace, terser: terser, nodeResolve: pluginNodeResolve.nodeResolve },
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
        options.input = path.resolve(absolutePath, options.input);
    }
    if (options.output) {
        options.output = Array.isArray(options.output) ? options.output : [options.output];
        var singleOutput = options.output.filter(function (output) { return !output.multiple; });
        var umdGlobalIgnore_2 = [];
        options.output = singleOutput.map(function (output) {
            if (output.dir && !output.dir.startsWith(absolutePath)) {
                output.dir = path.resolve(absolutePath, output.dir);
            }
            if (output.file && !output.file.startsWith(absolutePath)) {
                output.file = path.resolve(absolutePath, output.file);
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
                currentTsConfig = tsConfig(absolutePath, "process.env", singleOtherSourceMap, "type");
            }
            singleOther.forEach(function (config) { return delete config.type; });
            var pluginsBuilder = (_a = configOption.plugins) === null || _a === void 0 ? void 0 : _a.singleOther;
            var defaultPlugins = [
                pluginNodeResolve.nodeResolve(),
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
                    defaultPluginPackages: { commonjs: commonjs, typescript: typescript, json: json, replace: replace, terser: terser, nodeResolve: pluginNodeResolve.nodeResolve },
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
                currentTsConfig = tsConfig(absolutePath, "process.env", singleUMDSourceMap, "type");
            }
            var pluginsBuilder = (_c = configOption.plugins) === null || _c === void 0 ? void 0 : _c.singleDevUMD;
            var defaultPlugins = [
                pluginNodeResolve.nodeResolve(),
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
                    defaultPluginPackages: { commonjs: commonjs, typescript: typescript, json: json, replace: replace, terser: terser, nodeResolve: pluginNodeResolve.nodeResolve },
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
                _a.trys.push([1, 7, 8, 10]);
                output = rollupOptions.output, options = __rest(rollupOptions, ["output"]);
                return [4 /*yield*/, rollup.rollup(options)];
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

exports.rollupBuild = rollupBuild;
exports.rollupWatch = rollupWatch;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXgucHJvZHVjdGlvbi5qcyIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzLy5wbnBtL0Byb2xsdXArcGx1Z2luLXR5cGVzY3JpcHRAMTIuMS4yX3JvbGx1cEA0LjM0LjZfdHNsaWJAMi44LjFfdHlwZXNjcmlwdEA1LjcuMy9ub2RlX21vZHVsZXMvdHNsaWIvdHNsaWIuZXM2LmpzIiwiLi4vLi4vc3JjL2xvZy50cyIsIi4uLy4uL3NyYy9zYWZlUGFyc2UudHMiLCIuLi8uLi9zcmMvcm9sbHVwQ29uZmlnLnRzIiwiLi4vLi4vc3JjL3JvbGx1cEJ1aWxkLnRzIiwiLi4vLi4vc3JjL3JvbGx1cFdhdGNoLnRzIl0sInNvdXJjZXNDb250ZW50IjpbIi8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcclxuQ29weXJpZ2h0IChjKSBNaWNyb3NvZnQgQ29ycG9yYXRpb24uXHJcblxyXG5QZXJtaXNzaW9uIHRvIHVzZSwgY29weSwgbW9kaWZ5LCBhbmQvb3IgZGlzdHJpYnV0ZSB0aGlzIHNvZnR3YXJlIGZvciBhbnlcclxucHVycG9zZSB3aXRoIG9yIHdpdGhvdXQgZmVlIGlzIGhlcmVieSBncmFudGVkLlxyXG5cclxuVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiBBTkQgVEhFIEFVVEhPUiBESVNDTEFJTVMgQUxMIFdBUlJBTlRJRVMgV0lUSFxyXG5SRUdBUkQgVE8gVEhJUyBTT0ZUV0FSRSBJTkNMVURJTkcgQUxMIElNUExJRUQgV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFlcclxuQU5EIEZJVE5FU1MuIElOIE5PIEVWRU5UIFNIQUxMIFRIRSBBVVRIT1IgQkUgTElBQkxFIEZPUiBBTlkgU1BFQ0lBTCwgRElSRUNULFxyXG5JTkRJUkVDVCwgT1IgQ09OU0VRVUVOVElBTCBEQU1BR0VTIE9SIEFOWSBEQU1BR0VTIFdIQVRTT0VWRVIgUkVTVUxUSU5HIEZST01cclxuTE9TUyBPRiBVU0UsIERBVEEgT1IgUFJPRklUUywgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIE5FR0xJR0VOQ0UgT1JcclxuT1RIRVIgVE9SVElPVVMgQUNUSU9OLCBBUklTSU5HIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFVTRSBPUlxyXG5QRVJGT1JNQU5DRSBPRiBUSElTIFNPRlRXQVJFLlxyXG4qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiAqL1xyXG4vKiBnbG9iYWwgUmVmbGVjdCwgUHJvbWlzZSwgU3VwcHJlc3NlZEVycm9yLCBTeW1ib2wsIEl0ZXJhdG9yICovXHJcblxyXG52YXIgZXh0ZW5kU3RhdGljcyA9IGZ1bmN0aW9uKGQsIGIpIHtcclxuICAgIGV4dGVuZFN0YXRpY3MgPSBPYmplY3Quc2V0UHJvdG90eXBlT2YgfHxcclxuICAgICAgICAoeyBfX3Byb3RvX186IFtdIH0gaW5zdGFuY2VvZiBBcnJheSAmJiBmdW5jdGlvbiAoZCwgYikgeyBkLl9fcHJvdG9fXyA9IGI7IH0pIHx8XHJcbiAgICAgICAgZnVuY3Rpb24gKGQsIGIpIHsgZm9yICh2YXIgcCBpbiBiKSBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKGIsIHApKSBkW3BdID0gYltwXTsgfTtcclxuICAgIHJldHVybiBleHRlbmRTdGF0aWNzKGQsIGIpO1xyXG59O1xyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fZXh0ZW5kcyhkLCBiKSB7XHJcbiAgICBpZiAodHlwZW9mIGIgIT09IFwiZnVuY3Rpb25cIiAmJiBiICE9PSBudWxsKVxyXG4gICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoXCJDbGFzcyBleHRlbmRzIHZhbHVlIFwiICsgU3RyaW5nKGIpICsgXCIgaXMgbm90IGEgY29uc3RydWN0b3Igb3IgbnVsbFwiKTtcclxuICAgIGV4dGVuZFN0YXRpY3MoZCwgYik7XHJcbiAgICBmdW5jdGlvbiBfXygpIHsgdGhpcy5jb25zdHJ1Y3RvciA9IGQ7IH1cclxuICAgIGQucHJvdG90eXBlID0gYiA9PT0gbnVsbCA/IE9iamVjdC5jcmVhdGUoYikgOiAoX18ucHJvdG90eXBlID0gYi5wcm90b3R5cGUsIG5ldyBfXygpKTtcclxufVxyXG5cclxuZXhwb3J0IHZhciBfX2Fzc2lnbiA9IGZ1bmN0aW9uKCkge1xyXG4gICAgX19hc3NpZ24gPSBPYmplY3QuYXNzaWduIHx8IGZ1bmN0aW9uIF9fYXNzaWduKHQpIHtcclxuICAgICAgICBmb3IgKHZhciBzLCBpID0gMSwgbiA9IGFyZ3VtZW50cy5sZW5ndGg7IGkgPCBuOyBpKyspIHtcclxuICAgICAgICAgICAgcyA9IGFyZ3VtZW50c1tpXTtcclxuICAgICAgICAgICAgZm9yICh2YXIgcCBpbiBzKSBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKHMsIHApKSB0W3BdID0gc1twXTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHQ7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gX19hc3NpZ24uYXBwbHkodGhpcywgYXJndW1lbnRzKTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fcmVzdChzLCBlKSB7XHJcbiAgICB2YXIgdCA9IHt9O1xyXG4gICAgZm9yICh2YXIgcCBpbiBzKSBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKHMsIHApICYmIGUuaW5kZXhPZihwKSA8IDApXHJcbiAgICAgICAgdFtwXSA9IHNbcF07XHJcbiAgICBpZiAocyAhPSBudWxsICYmIHR5cGVvZiBPYmplY3QuZ2V0T3duUHJvcGVydHlTeW1ib2xzID09PSBcImZ1bmN0aW9uXCIpXHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDAsIHAgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlTeW1ib2xzKHMpOyBpIDwgcC5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICBpZiAoZS5pbmRleE9mKHBbaV0pIDwgMCAmJiBPYmplY3QucHJvdG90eXBlLnByb3BlcnR5SXNFbnVtZXJhYmxlLmNhbGwocywgcFtpXSkpXHJcbiAgICAgICAgICAgICAgICB0W3BbaV1dID0gc1twW2ldXTtcclxuICAgICAgICB9XHJcbiAgICByZXR1cm4gdDtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fZGVjb3JhdGUoZGVjb3JhdG9ycywgdGFyZ2V0LCBrZXksIGRlc2MpIHtcclxuICAgIHZhciBjID0gYXJndW1lbnRzLmxlbmd0aCwgciA9IGMgPCAzID8gdGFyZ2V0IDogZGVzYyA9PT0gbnVsbCA/IGRlc2MgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKHRhcmdldCwga2V5KSA6IGRlc2MsIGQ7XHJcbiAgICBpZiAodHlwZW9mIFJlZmxlY3QgPT09IFwib2JqZWN0XCIgJiYgdHlwZW9mIFJlZmxlY3QuZGVjb3JhdGUgPT09IFwiZnVuY3Rpb25cIikgciA9IFJlZmxlY3QuZGVjb3JhdGUoZGVjb3JhdG9ycywgdGFyZ2V0LCBrZXksIGRlc2MpO1xyXG4gICAgZWxzZSBmb3IgKHZhciBpID0gZGVjb3JhdG9ycy5sZW5ndGggLSAxOyBpID49IDA7IGktLSkgaWYgKGQgPSBkZWNvcmF0b3JzW2ldKSByID0gKGMgPCAzID8gZChyKSA6IGMgPiAzID8gZCh0YXJnZXQsIGtleSwgcikgOiBkKHRhcmdldCwga2V5KSkgfHwgcjtcclxuICAgIHJldHVybiBjID4gMyAmJiByICYmIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0YXJnZXQsIGtleSwgciksIHI7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX3BhcmFtKHBhcmFtSW5kZXgsIGRlY29yYXRvcikge1xyXG4gICAgcmV0dXJuIGZ1bmN0aW9uICh0YXJnZXQsIGtleSkgeyBkZWNvcmF0b3IodGFyZ2V0LCBrZXksIHBhcmFtSW5kZXgpOyB9XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX2VzRGVjb3JhdGUoY3RvciwgZGVzY3JpcHRvckluLCBkZWNvcmF0b3JzLCBjb250ZXh0SW4sIGluaXRpYWxpemVycywgZXh0cmFJbml0aWFsaXplcnMpIHtcclxuICAgIGZ1bmN0aW9uIGFjY2VwdChmKSB7IGlmIChmICE9PSB2b2lkIDAgJiYgdHlwZW9mIGYgIT09IFwiZnVuY3Rpb25cIikgdGhyb3cgbmV3IFR5cGVFcnJvcihcIkZ1bmN0aW9uIGV4cGVjdGVkXCIpOyByZXR1cm4gZjsgfVxyXG4gICAgdmFyIGtpbmQgPSBjb250ZXh0SW4ua2luZCwga2V5ID0ga2luZCA9PT0gXCJnZXR0ZXJcIiA/IFwiZ2V0XCIgOiBraW5kID09PSBcInNldHRlclwiID8gXCJzZXRcIiA6IFwidmFsdWVcIjtcclxuICAgIHZhciB0YXJnZXQgPSAhZGVzY3JpcHRvckluICYmIGN0b3IgPyBjb250ZXh0SW5bXCJzdGF0aWNcIl0gPyBjdG9yIDogY3Rvci5wcm90b3R5cGUgOiBudWxsO1xyXG4gICAgdmFyIGRlc2NyaXB0b3IgPSBkZXNjcmlwdG9ySW4gfHwgKHRhcmdldCA/IE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IodGFyZ2V0LCBjb250ZXh0SW4ubmFtZSkgOiB7fSk7XHJcbiAgICB2YXIgXywgZG9uZSA9IGZhbHNlO1xyXG4gICAgZm9yICh2YXIgaSA9IGRlY29yYXRvcnMubGVuZ3RoIC0gMTsgaSA+PSAwOyBpLS0pIHtcclxuICAgICAgICB2YXIgY29udGV4dCA9IHt9O1xyXG4gICAgICAgIGZvciAodmFyIHAgaW4gY29udGV4dEluKSBjb250ZXh0W3BdID0gcCA9PT0gXCJhY2Nlc3NcIiA/IHt9IDogY29udGV4dEluW3BdO1xyXG4gICAgICAgIGZvciAodmFyIHAgaW4gY29udGV4dEluLmFjY2VzcykgY29udGV4dC5hY2Nlc3NbcF0gPSBjb250ZXh0SW4uYWNjZXNzW3BdO1xyXG4gICAgICAgIGNvbnRleHQuYWRkSW5pdGlhbGl6ZXIgPSBmdW5jdGlvbiAoZikgeyBpZiAoZG9uZSkgdGhyb3cgbmV3IFR5cGVFcnJvcihcIkNhbm5vdCBhZGQgaW5pdGlhbGl6ZXJzIGFmdGVyIGRlY29yYXRpb24gaGFzIGNvbXBsZXRlZFwiKTsgZXh0cmFJbml0aWFsaXplcnMucHVzaChhY2NlcHQoZiB8fCBudWxsKSk7IH07XHJcbiAgICAgICAgdmFyIHJlc3VsdCA9ICgwLCBkZWNvcmF0b3JzW2ldKShraW5kID09PSBcImFjY2Vzc29yXCIgPyB7IGdldDogZGVzY3JpcHRvci5nZXQsIHNldDogZGVzY3JpcHRvci5zZXQgfSA6IGRlc2NyaXB0b3Jba2V5XSwgY29udGV4dCk7XHJcbiAgICAgICAgaWYgKGtpbmQgPT09IFwiYWNjZXNzb3JcIikge1xyXG4gICAgICAgICAgICBpZiAocmVzdWx0ID09PSB2b2lkIDApIGNvbnRpbnVlO1xyXG4gICAgICAgICAgICBpZiAocmVzdWx0ID09PSBudWxsIHx8IHR5cGVvZiByZXN1bHQgIT09IFwib2JqZWN0XCIpIHRocm93IG5ldyBUeXBlRXJyb3IoXCJPYmplY3QgZXhwZWN0ZWRcIik7XHJcbiAgICAgICAgICAgIGlmIChfID0gYWNjZXB0KHJlc3VsdC5nZXQpKSBkZXNjcmlwdG9yLmdldCA9IF87XHJcbiAgICAgICAgICAgIGlmIChfID0gYWNjZXB0KHJlc3VsdC5zZXQpKSBkZXNjcmlwdG9yLnNldCA9IF87XHJcbiAgICAgICAgICAgIGlmIChfID0gYWNjZXB0KHJlc3VsdC5pbml0KSkgaW5pdGlhbGl6ZXJzLnVuc2hpZnQoXyk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2UgaWYgKF8gPSBhY2NlcHQocmVzdWx0KSkge1xyXG4gICAgICAgICAgICBpZiAoa2luZCA9PT0gXCJmaWVsZFwiKSBpbml0aWFsaXplcnMudW5zaGlmdChfKTtcclxuICAgICAgICAgICAgZWxzZSBkZXNjcmlwdG9yW2tleV0gPSBfO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIGlmICh0YXJnZXQpIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0YXJnZXQsIGNvbnRleHRJbi5uYW1lLCBkZXNjcmlwdG9yKTtcclxuICAgIGRvbmUgPSB0cnVlO1xyXG59O1xyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fcnVuSW5pdGlhbGl6ZXJzKHRoaXNBcmcsIGluaXRpYWxpemVycywgdmFsdWUpIHtcclxuICAgIHZhciB1c2VWYWx1ZSA9IGFyZ3VtZW50cy5sZW5ndGggPiAyO1xyXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBpbml0aWFsaXplcnMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICB2YWx1ZSA9IHVzZVZhbHVlID8gaW5pdGlhbGl6ZXJzW2ldLmNhbGwodGhpc0FyZywgdmFsdWUpIDogaW5pdGlhbGl6ZXJzW2ldLmNhbGwodGhpc0FyZyk7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gdXNlVmFsdWUgPyB2YWx1ZSA6IHZvaWQgMDtcclxufTtcclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX3Byb3BLZXkoeCkge1xyXG4gICAgcmV0dXJuIHR5cGVvZiB4ID09PSBcInN5bWJvbFwiID8geCA6IFwiXCIuY29uY2F0KHgpO1xyXG59O1xyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fc2V0RnVuY3Rpb25OYW1lKGYsIG5hbWUsIHByZWZpeCkge1xyXG4gICAgaWYgKHR5cGVvZiBuYW1lID09PSBcInN5bWJvbFwiKSBuYW1lID0gbmFtZS5kZXNjcmlwdGlvbiA/IFwiW1wiLmNvbmNhdChuYW1lLmRlc2NyaXB0aW9uLCBcIl1cIikgOiBcIlwiO1xyXG4gICAgcmV0dXJuIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShmLCBcIm5hbWVcIiwgeyBjb25maWd1cmFibGU6IHRydWUsIHZhbHVlOiBwcmVmaXggPyBcIlwiLmNvbmNhdChwcmVmaXgsIFwiIFwiLCBuYW1lKSA6IG5hbWUgfSk7XHJcbn07XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19tZXRhZGF0YShtZXRhZGF0YUtleSwgbWV0YWRhdGFWYWx1ZSkge1xyXG4gICAgaWYgKHR5cGVvZiBSZWZsZWN0ID09PSBcIm9iamVjdFwiICYmIHR5cGVvZiBSZWZsZWN0Lm1ldGFkYXRhID09PSBcImZ1bmN0aW9uXCIpIHJldHVybiBSZWZsZWN0Lm1ldGFkYXRhKG1ldGFkYXRhS2V5LCBtZXRhZGF0YVZhbHVlKTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fYXdhaXRlcih0aGlzQXJnLCBfYXJndW1lbnRzLCBQLCBnZW5lcmF0b3IpIHtcclxuICAgIGZ1bmN0aW9uIGFkb3B0KHZhbHVlKSB7IHJldHVybiB2YWx1ZSBpbnN0YW5jZW9mIFAgPyB2YWx1ZSA6IG5ldyBQKGZ1bmN0aW9uIChyZXNvbHZlKSB7IHJlc29sdmUodmFsdWUpOyB9KTsgfVxyXG4gICAgcmV0dXJuIG5ldyAoUCB8fCAoUCA9IFByb21pc2UpKShmdW5jdGlvbiAocmVzb2x2ZSwgcmVqZWN0KSB7XHJcbiAgICAgICAgZnVuY3Rpb24gZnVsZmlsbGVkKHZhbHVlKSB7IHRyeSB7IHN0ZXAoZ2VuZXJhdG9yLm5leHQodmFsdWUpKTsgfSBjYXRjaCAoZSkgeyByZWplY3QoZSk7IH0gfVxyXG4gICAgICAgIGZ1bmN0aW9uIHJlamVjdGVkKHZhbHVlKSB7IHRyeSB7IHN0ZXAoZ2VuZXJhdG9yW1widGhyb3dcIl0odmFsdWUpKTsgfSBjYXRjaCAoZSkgeyByZWplY3QoZSk7IH0gfVxyXG4gICAgICAgIGZ1bmN0aW9uIHN0ZXAocmVzdWx0KSB7IHJlc3VsdC5kb25lID8gcmVzb2x2ZShyZXN1bHQudmFsdWUpIDogYWRvcHQocmVzdWx0LnZhbHVlKS50aGVuKGZ1bGZpbGxlZCwgcmVqZWN0ZWQpOyB9XHJcbiAgICAgICAgc3RlcCgoZ2VuZXJhdG9yID0gZ2VuZXJhdG9yLmFwcGx5KHRoaXNBcmcsIF9hcmd1bWVudHMgfHwgW10pKS5uZXh0KCkpO1xyXG4gICAgfSk7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX2dlbmVyYXRvcih0aGlzQXJnLCBib2R5KSB7XHJcbiAgICB2YXIgXyA9IHsgbGFiZWw6IDAsIHNlbnQ6IGZ1bmN0aW9uKCkgeyBpZiAodFswXSAmIDEpIHRocm93IHRbMV07IHJldHVybiB0WzFdOyB9LCB0cnlzOiBbXSwgb3BzOiBbXSB9LCBmLCB5LCB0LCBnID0gT2JqZWN0LmNyZWF0ZSgodHlwZW9mIEl0ZXJhdG9yID09PSBcImZ1bmN0aW9uXCIgPyBJdGVyYXRvciA6IE9iamVjdCkucHJvdG90eXBlKTtcclxuICAgIHJldHVybiBnLm5leHQgPSB2ZXJiKDApLCBnW1widGhyb3dcIl0gPSB2ZXJiKDEpLCBnW1wicmV0dXJuXCJdID0gdmVyYigyKSwgdHlwZW9mIFN5bWJvbCA9PT0gXCJmdW5jdGlvblwiICYmIChnW1N5bWJvbC5pdGVyYXRvcl0gPSBmdW5jdGlvbigpIHsgcmV0dXJuIHRoaXM7IH0pLCBnO1xyXG4gICAgZnVuY3Rpb24gdmVyYihuKSB7IHJldHVybiBmdW5jdGlvbiAodikgeyByZXR1cm4gc3RlcChbbiwgdl0pOyB9OyB9XHJcbiAgICBmdW5jdGlvbiBzdGVwKG9wKSB7XHJcbiAgICAgICAgaWYgKGYpIHRocm93IG5ldyBUeXBlRXJyb3IoXCJHZW5lcmF0b3IgaXMgYWxyZWFkeSBleGVjdXRpbmcuXCIpO1xyXG4gICAgICAgIHdoaWxlIChnICYmIChnID0gMCwgb3BbMF0gJiYgKF8gPSAwKSksIF8pIHRyeSB7XHJcbiAgICAgICAgICAgIGlmIChmID0gMSwgeSAmJiAodCA9IG9wWzBdICYgMiA/IHlbXCJyZXR1cm5cIl0gOiBvcFswXSA/IHlbXCJ0aHJvd1wiXSB8fCAoKHQgPSB5W1wicmV0dXJuXCJdKSAmJiB0LmNhbGwoeSksIDApIDogeS5uZXh0KSAmJiAhKHQgPSB0LmNhbGwoeSwgb3BbMV0pKS5kb25lKSByZXR1cm4gdDtcclxuICAgICAgICAgICAgaWYgKHkgPSAwLCB0KSBvcCA9IFtvcFswXSAmIDIsIHQudmFsdWVdO1xyXG4gICAgICAgICAgICBzd2l0Y2ggKG9wWzBdKSB7XHJcbiAgICAgICAgICAgICAgICBjYXNlIDA6IGNhc2UgMTogdCA9IG9wOyBicmVhaztcclxuICAgICAgICAgICAgICAgIGNhc2UgNDogXy5sYWJlbCsrOyByZXR1cm4geyB2YWx1ZTogb3BbMV0sIGRvbmU6IGZhbHNlIH07XHJcbiAgICAgICAgICAgICAgICBjYXNlIDU6IF8ubGFiZWwrKzsgeSA9IG9wWzFdOyBvcCA9IFswXTsgY29udGludWU7XHJcbiAgICAgICAgICAgICAgICBjYXNlIDc6IG9wID0gXy5vcHMucG9wKCk7IF8udHJ5cy5wb3AoKTsgY29udGludWU7XHJcbiAgICAgICAgICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgICAgICAgICAgIGlmICghKHQgPSBfLnRyeXMsIHQgPSB0Lmxlbmd0aCA+IDAgJiYgdFt0Lmxlbmd0aCAtIDFdKSAmJiAob3BbMF0gPT09IDYgfHwgb3BbMF0gPT09IDIpKSB7IF8gPSAwOyBjb250aW51ZTsgfVxyXG4gICAgICAgICAgICAgICAgICAgIGlmIChvcFswXSA9PT0gMyAmJiAoIXQgfHwgKG9wWzFdID4gdFswXSAmJiBvcFsxXSA8IHRbM10pKSkgeyBfLmxhYmVsID0gb3BbMV07IGJyZWFrOyB9XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKG9wWzBdID09PSA2ICYmIF8ubGFiZWwgPCB0WzFdKSB7IF8ubGFiZWwgPSB0WzFdOyB0ID0gb3A7IGJyZWFrOyB9XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHQgJiYgXy5sYWJlbCA8IHRbMl0pIHsgXy5sYWJlbCA9IHRbMl07IF8ub3BzLnB1c2gob3ApOyBicmVhazsgfVxyXG4gICAgICAgICAgICAgICAgICAgIGlmICh0WzJdKSBfLm9wcy5wb3AoKTtcclxuICAgICAgICAgICAgICAgICAgICBfLnRyeXMucG9wKCk7IGNvbnRpbnVlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIG9wID0gYm9keS5jYWxsKHRoaXNBcmcsIF8pO1xyXG4gICAgICAgIH0gY2F0Y2ggKGUpIHsgb3AgPSBbNiwgZV07IHkgPSAwOyB9IGZpbmFsbHkgeyBmID0gdCA9IDA7IH1cclxuICAgICAgICBpZiAob3BbMF0gJiA1KSB0aHJvdyBvcFsxXTsgcmV0dXJuIHsgdmFsdWU6IG9wWzBdID8gb3BbMV0gOiB2b2lkIDAsIGRvbmU6IHRydWUgfTtcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IHZhciBfX2NyZWF0ZUJpbmRpbmcgPSBPYmplY3QuY3JlYXRlID8gKGZ1bmN0aW9uKG8sIG0sIGssIGsyKSB7XHJcbiAgICBpZiAoazIgPT09IHVuZGVmaW5lZCkgazIgPSBrO1xyXG4gICAgdmFyIGRlc2MgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKG0sIGspO1xyXG4gICAgaWYgKCFkZXNjIHx8IChcImdldFwiIGluIGRlc2MgPyAhbS5fX2VzTW9kdWxlIDogZGVzYy53cml0YWJsZSB8fCBkZXNjLmNvbmZpZ3VyYWJsZSkpIHtcclxuICAgICAgICBkZXNjID0geyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGZ1bmN0aW9uKCkgeyByZXR1cm4gbVtrXTsgfSB9O1xyXG4gICAgfVxyXG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KG8sIGsyLCBkZXNjKTtcclxufSkgOiAoZnVuY3Rpb24obywgbSwgaywgazIpIHtcclxuICAgIGlmIChrMiA9PT0gdW5kZWZpbmVkKSBrMiA9IGs7XHJcbiAgICBvW2syXSA9IG1ba107XHJcbn0pO1xyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fZXhwb3J0U3RhcihtLCBvKSB7XHJcbiAgICBmb3IgKHZhciBwIGluIG0pIGlmIChwICE9PSBcImRlZmF1bHRcIiAmJiAhT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG8sIHApKSBfX2NyZWF0ZUJpbmRpbmcobywgbSwgcCk7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX3ZhbHVlcyhvKSB7XHJcbiAgICB2YXIgcyA9IHR5cGVvZiBTeW1ib2wgPT09IFwiZnVuY3Rpb25cIiAmJiBTeW1ib2wuaXRlcmF0b3IsIG0gPSBzICYmIG9bc10sIGkgPSAwO1xyXG4gICAgaWYgKG0pIHJldHVybiBtLmNhbGwobyk7XHJcbiAgICBpZiAobyAmJiB0eXBlb2Ygby5sZW5ndGggPT09IFwibnVtYmVyXCIpIHJldHVybiB7XHJcbiAgICAgICAgbmV4dDogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICBpZiAobyAmJiBpID49IG8ubGVuZ3RoKSBvID0gdm9pZCAwO1xyXG4gICAgICAgICAgICByZXR1cm4geyB2YWx1ZTogbyAmJiBvW2krK10sIGRvbmU6ICFvIH07XHJcbiAgICAgICAgfVxyXG4gICAgfTtcclxuICAgIHRocm93IG5ldyBUeXBlRXJyb3IocyA/IFwiT2JqZWN0IGlzIG5vdCBpdGVyYWJsZS5cIiA6IFwiU3ltYm9sLml0ZXJhdG9yIGlzIG5vdCBkZWZpbmVkLlwiKTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fcmVhZChvLCBuKSB7XHJcbiAgICB2YXIgbSA9IHR5cGVvZiBTeW1ib2wgPT09IFwiZnVuY3Rpb25cIiAmJiBvW1N5bWJvbC5pdGVyYXRvcl07XHJcbiAgICBpZiAoIW0pIHJldHVybiBvO1xyXG4gICAgdmFyIGkgPSBtLmNhbGwobyksIHIsIGFyID0gW10sIGU7XHJcbiAgICB0cnkge1xyXG4gICAgICAgIHdoaWxlICgobiA9PT0gdm9pZCAwIHx8IG4tLSA+IDApICYmICEociA9IGkubmV4dCgpKS5kb25lKSBhci5wdXNoKHIudmFsdWUpO1xyXG4gICAgfVxyXG4gICAgY2F0Y2ggKGVycm9yKSB7IGUgPSB7IGVycm9yOiBlcnJvciB9OyB9XHJcbiAgICBmaW5hbGx5IHtcclxuICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICBpZiAociAmJiAhci5kb25lICYmIChtID0gaVtcInJldHVyblwiXSkpIG0uY2FsbChpKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZmluYWxseSB7IGlmIChlKSB0aHJvdyBlLmVycm9yOyB9XHJcbiAgICB9XHJcbiAgICByZXR1cm4gYXI7XHJcbn1cclxuXHJcbi8qKiBAZGVwcmVjYXRlZCAqL1xyXG5leHBvcnQgZnVuY3Rpb24gX19zcHJlYWQoKSB7XHJcbiAgICBmb3IgKHZhciBhciA9IFtdLCBpID0gMDsgaSA8IGFyZ3VtZW50cy5sZW5ndGg7IGkrKylcclxuICAgICAgICBhciA9IGFyLmNvbmNhdChfX3JlYWQoYXJndW1lbnRzW2ldKSk7XHJcbiAgICByZXR1cm4gYXI7XHJcbn1cclxuXHJcbi8qKiBAZGVwcmVjYXRlZCAqL1xyXG5leHBvcnQgZnVuY3Rpb24gX19zcHJlYWRBcnJheXMoKSB7XHJcbiAgICBmb3IgKHZhciBzID0gMCwgaSA9IDAsIGlsID0gYXJndW1lbnRzLmxlbmd0aDsgaSA8IGlsOyBpKyspIHMgKz0gYXJndW1lbnRzW2ldLmxlbmd0aDtcclxuICAgIGZvciAodmFyIHIgPSBBcnJheShzKSwgayA9IDAsIGkgPSAwOyBpIDwgaWw7IGkrKylcclxuICAgICAgICBmb3IgKHZhciBhID0gYXJndW1lbnRzW2ldLCBqID0gMCwgamwgPSBhLmxlbmd0aDsgaiA8IGpsOyBqKyssIGsrKylcclxuICAgICAgICAgICAgcltrXSA9IGFbal07XHJcbiAgICByZXR1cm4gcjtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fc3ByZWFkQXJyYXkodG8sIGZyb20sIHBhY2spIHtcclxuICAgIGlmIChwYWNrIHx8IGFyZ3VtZW50cy5sZW5ndGggPT09IDIpIGZvciAodmFyIGkgPSAwLCBsID0gZnJvbS5sZW5ndGgsIGFyOyBpIDwgbDsgaSsrKSB7XHJcbiAgICAgICAgaWYgKGFyIHx8ICEoaSBpbiBmcm9tKSkge1xyXG4gICAgICAgICAgICBpZiAoIWFyKSBhciA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGZyb20sIDAsIGkpO1xyXG4gICAgICAgICAgICBhcltpXSA9IGZyb21baV07XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgcmV0dXJuIHRvLmNvbmNhdChhciB8fCBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChmcm9tKSk7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX2F3YWl0KHYpIHtcclxuICAgIHJldHVybiB0aGlzIGluc3RhbmNlb2YgX19hd2FpdCA/ICh0aGlzLnYgPSB2LCB0aGlzKSA6IG5ldyBfX2F3YWl0KHYpO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19hc3luY0dlbmVyYXRvcih0aGlzQXJnLCBfYXJndW1lbnRzLCBnZW5lcmF0b3IpIHtcclxuICAgIGlmICghU3ltYm9sLmFzeW5jSXRlcmF0b3IpIHRocm93IG5ldyBUeXBlRXJyb3IoXCJTeW1ib2wuYXN5bmNJdGVyYXRvciBpcyBub3QgZGVmaW5lZC5cIik7XHJcbiAgICB2YXIgZyA9IGdlbmVyYXRvci5hcHBseSh0aGlzQXJnLCBfYXJndW1lbnRzIHx8IFtdKSwgaSwgcSA9IFtdO1xyXG4gICAgcmV0dXJuIGkgPSBPYmplY3QuY3JlYXRlKCh0eXBlb2YgQXN5bmNJdGVyYXRvciA9PT0gXCJmdW5jdGlvblwiID8gQXN5bmNJdGVyYXRvciA6IE9iamVjdCkucHJvdG90eXBlKSwgdmVyYihcIm5leHRcIiksIHZlcmIoXCJ0aHJvd1wiKSwgdmVyYihcInJldHVyblwiLCBhd2FpdFJldHVybiksIGlbU3ltYm9sLmFzeW5jSXRlcmF0b3JdID0gZnVuY3Rpb24gKCkgeyByZXR1cm4gdGhpczsgfSwgaTtcclxuICAgIGZ1bmN0aW9uIGF3YWl0UmV0dXJuKGYpIHsgcmV0dXJuIGZ1bmN0aW9uICh2KSB7IHJldHVybiBQcm9taXNlLnJlc29sdmUodikudGhlbihmLCByZWplY3QpOyB9OyB9XHJcbiAgICBmdW5jdGlvbiB2ZXJiKG4sIGYpIHsgaWYgKGdbbl0pIHsgaVtuXSA9IGZ1bmN0aW9uICh2KSB7IHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbiAoYSwgYikgeyBxLnB1c2goW24sIHYsIGEsIGJdKSA+IDEgfHwgcmVzdW1lKG4sIHYpOyB9KTsgfTsgaWYgKGYpIGlbbl0gPSBmKGlbbl0pOyB9IH1cclxuICAgIGZ1bmN0aW9uIHJlc3VtZShuLCB2KSB7IHRyeSB7IHN0ZXAoZ1tuXSh2KSk7IH0gY2F0Y2ggKGUpIHsgc2V0dGxlKHFbMF1bM10sIGUpOyB9IH1cclxuICAgIGZ1bmN0aW9uIHN0ZXAocikgeyByLnZhbHVlIGluc3RhbmNlb2YgX19hd2FpdCA/IFByb21pc2UucmVzb2x2ZShyLnZhbHVlLnYpLnRoZW4oZnVsZmlsbCwgcmVqZWN0KSA6IHNldHRsZShxWzBdWzJdLCByKTsgfVxyXG4gICAgZnVuY3Rpb24gZnVsZmlsbCh2YWx1ZSkgeyByZXN1bWUoXCJuZXh0XCIsIHZhbHVlKTsgfVxyXG4gICAgZnVuY3Rpb24gcmVqZWN0KHZhbHVlKSB7IHJlc3VtZShcInRocm93XCIsIHZhbHVlKTsgfVxyXG4gICAgZnVuY3Rpb24gc2V0dGxlKGYsIHYpIHsgaWYgKGYodiksIHEuc2hpZnQoKSwgcS5sZW5ndGgpIHJlc3VtZShxWzBdWzBdLCBxWzBdWzFdKTsgfVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19hc3luY0RlbGVnYXRvcihvKSB7XHJcbiAgICB2YXIgaSwgcDtcclxuICAgIHJldHVybiBpID0ge30sIHZlcmIoXCJuZXh0XCIpLCB2ZXJiKFwidGhyb3dcIiwgZnVuY3Rpb24gKGUpIHsgdGhyb3cgZTsgfSksIHZlcmIoXCJyZXR1cm5cIiksIGlbU3ltYm9sLml0ZXJhdG9yXSA9IGZ1bmN0aW9uICgpIHsgcmV0dXJuIHRoaXM7IH0sIGk7XHJcbiAgICBmdW5jdGlvbiB2ZXJiKG4sIGYpIHsgaVtuXSA9IG9bbl0gPyBmdW5jdGlvbiAodikgeyByZXR1cm4gKHAgPSAhcCkgPyB7IHZhbHVlOiBfX2F3YWl0KG9bbl0odikpLCBkb25lOiBmYWxzZSB9IDogZiA/IGYodikgOiB2OyB9IDogZjsgfVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19hc3luY1ZhbHVlcyhvKSB7XHJcbiAgICBpZiAoIVN5bWJvbC5hc3luY0l0ZXJhdG9yKSB0aHJvdyBuZXcgVHlwZUVycm9yKFwiU3ltYm9sLmFzeW5jSXRlcmF0b3IgaXMgbm90IGRlZmluZWQuXCIpO1xyXG4gICAgdmFyIG0gPSBvW1N5bWJvbC5hc3luY0l0ZXJhdG9yXSwgaTtcclxuICAgIHJldHVybiBtID8gbS5jYWxsKG8pIDogKG8gPSB0eXBlb2YgX192YWx1ZXMgPT09IFwiZnVuY3Rpb25cIiA/IF9fdmFsdWVzKG8pIDogb1tTeW1ib2wuaXRlcmF0b3JdKCksIGkgPSB7fSwgdmVyYihcIm5leHRcIiksIHZlcmIoXCJ0aHJvd1wiKSwgdmVyYihcInJldHVyblwiKSwgaVtTeW1ib2wuYXN5bmNJdGVyYXRvcl0gPSBmdW5jdGlvbiAoKSB7IHJldHVybiB0aGlzOyB9LCBpKTtcclxuICAgIGZ1bmN0aW9uIHZlcmIobikgeyBpW25dID0gb1tuXSAmJiBmdW5jdGlvbiAodikgeyByZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24gKHJlc29sdmUsIHJlamVjdCkgeyB2ID0gb1tuXSh2KSwgc2V0dGxlKHJlc29sdmUsIHJlamVjdCwgdi5kb25lLCB2LnZhbHVlKTsgfSk7IH07IH1cclxuICAgIGZ1bmN0aW9uIHNldHRsZShyZXNvbHZlLCByZWplY3QsIGQsIHYpIHsgUHJvbWlzZS5yZXNvbHZlKHYpLnRoZW4oZnVuY3Rpb24odikgeyByZXNvbHZlKHsgdmFsdWU6IHYsIGRvbmU6IGQgfSk7IH0sIHJlamVjdCk7IH1cclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fbWFrZVRlbXBsYXRlT2JqZWN0KGNvb2tlZCwgcmF3KSB7XHJcbiAgICBpZiAoT2JqZWN0LmRlZmluZVByb3BlcnR5KSB7IE9iamVjdC5kZWZpbmVQcm9wZXJ0eShjb29rZWQsIFwicmF3XCIsIHsgdmFsdWU6IHJhdyB9KTsgfSBlbHNlIHsgY29va2VkLnJhdyA9IHJhdzsgfVxyXG4gICAgcmV0dXJuIGNvb2tlZDtcclxufTtcclxuXHJcbnZhciBfX3NldE1vZHVsZURlZmF1bHQgPSBPYmplY3QuY3JlYXRlID8gKGZ1bmN0aW9uKG8sIHYpIHtcclxuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShvLCBcImRlZmF1bHRcIiwgeyBlbnVtZXJhYmxlOiB0cnVlLCB2YWx1ZTogdiB9KTtcclxufSkgOiBmdW5jdGlvbihvLCB2KSB7XHJcbiAgICBvW1wiZGVmYXVsdFwiXSA9IHY7XHJcbn07XHJcblxyXG52YXIgb3duS2V5cyA9IGZ1bmN0aW9uKG8pIHtcclxuICAgIG93bktleXMgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlOYW1lcyB8fCBmdW5jdGlvbiAobykge1xyXG4gICAgICAgIHZhciBhciA9IFtdO1xyXG4gICAgICAgIGZvciAodmFyIGsgaW4gbykgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvLCBrKSkgYXJbYXIubGVuZ3RoXSA9IGs7XHJcbiAgICAgICAgcmV0dXJuIGFyO1xyXG4gICAgfTtcclxuICAgIHJldHVybiBvd25LZXlzKG8pO1xyXG59O1xyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9faW1wb3J0U3Rhcihtb2QpIHtcclxuICAgIGlmIChtb2QgJiYgbW9kLl9fZXNNb2R1bGUpIHJldHVybiBtb2Q7XHJcbiAgICB2YXIgcmVzdWx0ID0ge307XHJcbiAgICBpZiAobW9kICE9IG51bGwpIGZvciAodmFyIGsgPSBvd25LZXlzKG1vZCksIGkgPSAwOyBpIDwgay5sZW5ndGg7IGkrKykgaWYgKGtbaV0gIT09IFwiZGVmYXVsdFwiKSBfX2NyZWF0ZUJpbmRpbmcocmVzdWx0LCBtb2QsIGtbaV0pO1xyXG4gICAgX19zZXRNb2R1bGVEZWZhdWx0KHJlc3VsdCwgbW9kKTtcclxuICAgIHJldHVybiByZXN1bHQ7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX2ltcG9ydERlZmF1bHQobW9kKSB7XHJcbiAgICByZXR1cm4gKG1vZCAmJiBtb2QuX19lc01vZHVsZSkgPyBtb2QgOiB7IGRlZmF1bHQ6IG1vZCB9O1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19jbGFzc1ByaXZhdGVGaWVsZEdldChyZWNlaXZlciwgc3RhdGUsIGtpbmQsIGYpIHtcclxuICAgIGlmIChraW5kID09PSBcImFcIiAmJiAhZikgdGhyb3cgbmV3IFR5cGVFcnJvcihcIlByaXZhdGUgYWNjZXNzb3Igd2FzIGRlZmluZWQgd2l0aG91dCBhIGdldHRlclwiKTtcclxuICAgIGlmICh0eXBlb2Ygc3RhdGUgPT09IFwiZnVuY3Rpb25cIiA/IHJlY2VpdmVyICE9PSBzdGF0ZSB8fCAhZiA6ICFzdGF0ZS5oYXMocmVjZWl2ZXIpKSB0aHJvdyBuZXcgVHlwZUVycm9yKFwiQ2Fubm90IHJlYWQgcHJpdmF0ZSBtZW1iZXIgZnJvbSBhbiBvYmplY3Qgd2hvc2UgY2xhc3MgZGlkIG5vdCBkZWNsYXJlIGl0XCIpO1xyXG4gICAgcmV0dXJuIGtpbmQgPT09IFwibVwiID8gZiA6IGtpbmQgPT09IFwiYVwiID8gZi5jYWxsKHJlY2VpdmVyKSA6IGYgPyBmLnZhbHVlIDogc3RhdGUuZ2V0KHJlY2VpdmVyKTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fY2xhc3NQcml2YXRlRmllbGRTZXQocmVjZWl2ZXIsIHN0YXRlLCB2YWx1ZSwga2luZCwgZikge1xyXG4gICAgaWYgKGtpbmQgPT09IFwibVwiKSB0aHJvdyBuZXcgVHlwZUVycm9yKFwiUHJpdmF0ZSBtZXRob2QgaXMgbm90IHdyaXRhYmxlXCIpO1xyXG4gICAgaWYgKGtpbmQgPT09IFwiYVwiICYmICFmKSB0aHJvdyBuZXcgVHlwZUVycm9yKFwiUHJpdmF0ZSBhY2Nlc3NvciB3YXMgZGVmaW5lZCB3aXRob3V0IGEgc2V0dGVyXCIpO1xyXG4gICAgaWYgKHR5cGVvZiBzdGF0ZSA9PT0gXCJmdW5jdGlvblwiID8gcmVjZWl2ZXIgIT09IHN0YXRlIHx8ICFmIDogIXN0YXRlLmhhcyhyZWNlaXZlcikpIHRocm93IG5ldyBUeXBlRXJyb3IoXCJDYW5ub3Qgd3JpdGUgcHJpdmF0ZSBtZW1iZXIgdG8gYW4gb2JqZWN0IHdob3NlIGNsYXNzIGRpZCBub3QgZGVjbGFyZSBpdFwiKTtcclxuICAgIHJldHVybiAoa2luZCA9PT0gXCJhXCIgPyBmLmNhbGwocmVjZWl2ZXIsIHZhbHVlKSA6IGYgPyBmLnZhbHVlID0gdmFsdWUgOiBzdGF0ZS5zZXQocmVjZWl2ZXIsIHZhbHVlKSksIHZhbHVlO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19jbGFzc1ByaXZhdGVGaWVsZEluKHN0YXRlLCByZWNlaXZlcikge1xyXG4gICAgaWYgKHJlY2VpdmVyID09PSBudWxsIHx8ICh0eXBlb2YgcmVjZWl2ZXIgIT09IFwib2JqZWN0XCIgJiYgdHlwZW9mIHJlY2VpdmVyICE9PSBcImZ1bmN0aW9uXCIpKSB0aHJvdyBuZXcgVHlwZUVycm9yKFwiQ2Fubm90IHVzZSAnaW4nIG9wZXJhdG9yIG9uIG5vbi1vYmplY3RcIik7XHJcbiAgICByZXR1cm4gdHlwZW9mIHN0YXRlID09PSBcImZ1bmN0aW9uXCIgPyByZWNlaXZlciA9PT0gc3RhdGUgOiBzdGF0ZS5oYXMocmVjZWl2ZXIpO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19hZGREaXNwb3NhYmxlUmVzb3VyY2UoZW52LCB2YWx1ZSwgYXN5bmMpIHtcclxuICAgIGlmICh2YWx1ZSAhPT0gbnVsbCAmJiB2YWx1ZSAhPT0gdm9pZCAwKSB7XHJcbiAgICAgICAgaWYgKHR5cGVvZiB2YWx1ZSAhPT0gXCJvYmplY3RcIiAmJiB0eXBlb2YgdmFsdWUgIT09IFwiZnVuY3Rpb25cIikgdGhyb3cgbmV3IFR5cGVFcnJvcihcIk9iamVjdCBleHBlY3RlZC5cIik7XHJcbiAgICAgICAgdmFyIGRpc3Bvc2UsIGlubmVyO1xyXG4gICAgICAgIGlmIChhc3luYykge1xyXG4gICAgICAgICAgICBpZiAoIVN5bWJvbC5hc3luY0Rpc3Bvc2UpIHRocm93IG5ldyBUeXBlRXJyb3IoXCJTeW1ib2wuYXN5bmNEaXNwb3NlIGlzIG5vdCBkZWZpbmVkLlwiKTtcclxuICAgICAgICAgICAgZGlzcG9zZSA9IHZhbHVlW1N5bWJvbC5hc3luY0Rpc3Bvc2VdO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoZGlzcG9zZSA9PT0gdm9pZCAwKSB7XHJcbiAgICAgICAgICAgIGlmICghU3ltYm9sLmRpc3Bvc2UpIHRocm93IG5ldyBUeXBlRXJyb3IoXCJTeW1ib2wuZGlzcG9zZSBpcyBub3QgZGVmaW5lZC5cIik7XHJcbiAgICAgICAgICAgIGRpc3Bvc2UgPSB2YWx1ZVtTeW1ib2wuZGlzcG9zZV07XHJcbiAgICAgICAgICAgIGlmIChhc3luYykgaW5uZXIgPSBkaXNwb3NlO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAodHlwZW9mIGRpc3Bvc2UgIT09IFwiZnVuY3Rpb25cIikgdGhyb3cgbmV3IFR5cGVFcnJvcihcIk9iamVjdCBub3QgZGlzcG9zYWJsZS5cIik7XHJcbiAgICAgICAgaWYgKGlubmVyKSBkaXNwb3NlID0gZnVuY3Rpb24oKSB7IHRyeSB7IGlubmVyLmNhbGwodGhpcyk7IH0gY2F0Y2ggKGUpIHsgcmV0dXJuIFByb21pc2UucmVqZWN0KGUpOyB9IH07XHJcbiAgICAgICAgZW52LnN0YWNrLnB1c2goeyB2YWx1ZTogdmFsdWUsIGRpc3Bvc2U6IGRpc3Bvc2UsIGFzeW5jOiBhc3luYyB9KTtcclxuICAgIH1cclxuICAgIGVsc2UgaWYgKGFzeW5jKSB7XHJcbiAgICAgICAgZW52LnN0YWNrLnB1c2goeyBhc3luYzogdHJ1ZSB9KTtcclxuICAgIH1cclxuICAgIHJldHVybiB2YWx1ZTtcclxuXHJcbn1cclxuXHJcbnZhciBfU3VwcHJlc3NlZEVycm9yID0gdHlwZW9mIFN1cHByZXNzZWRFcnJvciA9PT0gXCJmdW5jdGlvblwiID8gU3VwcHJlc3NlZEVycm9yIDogZnVuY3Rpb24gKGVycm9yLCBzdXBwcmVzc2VkLCBtZXNzYWdlKSB7XHJcbiAgICB2YXIgZSA9IG5ldyBFcnJvcihtZXNzYWdlKTtcclxuICAgIHJldHVybiBlLm5hbWUgPSBcIlN1cHByZXNzZWRFcnJvclwiLCBlLmVycm9yID0gZXJyb3IsIGUuc3VwcHJlc3NlZCA9IHN1cHByZXNzZWQsIGU7XHJcbn07XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19kaXNwb3NlUmVzb3VyY2VzKGVudikge1xyXG4gICAgZnVuY3Rpb24gZmFpbChlKSB7XHJcbiAgICAgICAgZW52LmVycm9yID0gZW52Lmhhc0Vycm9yID8gbmV3IF9TdXBwcmVzc2VkRXJyb3IoZSwgZW52LmVycm9yLCBcIkFuIGVycm9yIHdhcyBzdXBwcmVzc2VkIGR1cmluZyBkaXNwb3NhbC5cIikgOiBlO1xyXG4gICAgICAgIGVudi5oYXNFcnJvciA9IHRydWU7XHJcbiAgICB9XHJcbiAgICB2YXIgciwgcyA9IDA7XHJcbiAgICBmdW5jdGlvbiBuZXh0KCkge1xyXG4gICAgICAgIHdoaWxlIChyID0gZW52LnN0YWNrLnBvcCgpKSB7XHJcbiAgICAgICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoIXIuYXN5bmMgJiYgcyA9PT0gMSkgcmV0dXJuIHMgPSAwLCBlbnYuc3RhY2sucHVzaChyKSwgUHJvbWlzZS5yZXNvbHZlKCkudGhlbihuZXh0KTtcclxuICAgICAgICAgICAgICAgIGlmIChyLmRpc3Bvc2UpIHtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgcmVzdWx0ID0gci5kaXNwb3NlLmNhbGwoci52YWx1ZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHIuYXN5bmMpIHJldHVybiBzIHw9IDIsIFByb21pc2UucmVzb2x2ZShyZXN1bHQpLnRoZW4obmV4dCwgZnVuY3Rpb24oZSkgeyBmYWlsKGUpOyByZXR1cm4gbmV4dCgpOyB9KTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGVsc2UgcyB8PSAxO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGNhdGNoIChlKSB7XHJcbiAgICAgICAgICAgICAgICBmYWlsKGUpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChzID09PSAxKSByZXR1cm4gZW52Lmhhc0Vycm9yID8gUHJvbWlzZS5yZWplY3QoZW52LmVycm9yKSA6IFByb21pc2UucmVzb2x2ZSgpO1xyXG4gICAgICAgIGlmIChlbnYuaGFzRXJyb3IpIHRocm93IGVudi5lcnJvcjtcclxuICAgIH1cclxuICAgIHJldHVybiBuZXh0KCk7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX3Jld3JpdGVSZWxhdGl2ZUltcG9ydEV4dGVuc2lvbihwYXRoLCBwcmVzZXJ2ZUpzeCkge1xyXG4gICAgaWYgKHR5cGVvZiBwYXRoID09PSBcInN0cmluZ1wiICYmIC9eXFwuXFwuP1xcLy8udGVzdChwYXRoKSkge1xyXG4gICAgICAgIHJldHVybiBwYXRoLnJlcGxhY2UoL1xcLih0c3gpJHwoKD86XFwuZCk/KSgoPzpcXC5bXi4vXSs/KT8pXFwuKFtjbV0/KXRzJC9pLCBmdW5jdGlvbiAobSwgdHN4LCBkLCBleHQsIGNtKSB7XHJcbiAgICAgICAgICAgIHJldHVybiB0c3ggPyBwcmVzZXJ2ZUpzeCA/IFwiLmpzeFwiIDogXCIuanNcIiA6IGQgJiYgKCFleHQgfHwgIWNtKSA/IG0gOiAoZCArIGV4dCArIFwiLlwiICsgY20udG9Mb3dlckNhc2UoKSArIFwianNcIik7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gcGF0aDtcclxufVxyXG5cclxuZXhwb3J0IGRlZmF1bHQge1xyXG4gICAgX19leHRlbmRzOiBfX2V4dGVuZHMsXHJcbiAgICBfX2Fzc2lnbjogX19hc3NpZ24sXHJcbiAgICBfX3Jlc3Q6IF9fcmVzdCxcclxuICAgIF9fZGVjb3JhdGU6IF9fZGVjb3JhdGUsXHJcbiAgICBfX3BhcmFtOiBfX3BhcmFtLFxyXG4gICAgX19lc0RlY29yYXRlOiBfX2VzRGVjb3JhdGUsXHJcbiAgICBfX3J1bkluaXRpYWxpemVyczogX19ydW5Jbml0aWFsaXplcnMsXHJcbiAgICBfX3Byb3BLZXk6IF9fcHJvcEtleSxcclxuICAgIF9fc2V0RnVuY3Rpb25OYW1lOiBfX3NldEZ1bmN0aW9uTmFtZSxcclxuICAgIF9fbWV0YWRhdGE6IF9fbWV0YWRhdGEsXHJcbiAgICBfX2F3YWl0ZXI6IF9fYXdhaXRlcixcclxuICAgIF9fZ2VuZXJhdG9yOiBfX2dlbmVyYXRvcixcclxuICAgIF9fY3JlYXRlQmluZGluZzogX19jcmVhdGVCaW5kaW5nLFxyXG4gICAgX19leHBvcnRTdGFyOiBfX2V4cG9ydFN0YXIsXHJcbiAgICBfX3ZhbHVlczogX192YWx1ZXMsXHJcbiAgICBfX3JlYWQ6IF9fcmVhZCxcclxuICAgIF9fc3ByZWFkOiBfX3NwcmVhZCxcclxuICAgIF9fc3ByZWFkQXJyYXlzOiBfX3NwcmVhZEFycmF5cyxcclxuICAgIF9fc3ByZWFkQXJyYXk6IF9fc3ByZWFkQXJyYXksXHJcbiAgICBfX2F3YWl0OiBfX2F3YWl0LFxyXG4gICAgX19hc3luY0dlbmVyYXRvcjogX19hc3luY0dlbmVyYXRvcixcclxuICAgIF9fYXN5bmNEZWxlZ2F0b3I6IF9fYXN5bmNEZWxlZ2F0b3IsXHJcbiAgICBfX2FzeW5jVmFsdWVzOiBfX2FzeW5jVmFsdWVzLFxyXG4gICAgX19tYWtlVGVtcGxhdGVPYmplY3Q6IF9fbWFrZVRlbXBsYXRlT2JqZWN0LFxyXG4gICAgX19pbXBvcnRTdGFyOiBfX2ltcG9ydFN0YXIsXHJcbiAgICBfX2ltcG9ydERlZmF1bHQ6IF9faW1wb3J0RGVmYXVsdCxcclxuICAgIF9fY2xhc3NQcml2YXRlRmllbGRHZXQ6IF9fY2xhc3NQcml2YXRlRmllbGRHZXQsXHJcbiAgICBfX2NsYXNzUHJpdmF0ZUZpZWxkU2V0OiBfX2NsYXNzUHJpdmF0ZUZpZWxkU2V0LFxyXG4gICAgX19jbGFzc1ByaXZhdGVGaWVsZEluOiBfX2NsYXNzUHJpdmF0ZUZpZWxkSW4sXHJcbiAgICBfX2FkZERpc3Bvc2FibGVSZXNvdXJjZTogX19hZGREaXNwb3NhYmxlUmVzb3VyY2UsXHJcbiAgICBfX2Rpc3Bvc2VSZXNvdXJjZXM6IF9fZGlzcG9zZVJlc291cmNlcyxcclxuICAgIF9fcmV3cml0ZVJlbGF0aXZlSW1wb3J0RXh0ZW5zaW9uOiBfX3Jld3JpdGVSZWxhdGl2ZUltcG9ydEV4dGVuc2lvbixcclxufTtcclxuIixudWxsLG51bGwsbnVsbCxudWxsLG51bGxdLCJuYW1lcyI6WyJwaW5vIiwiYWNjZXNzIiwicmVzb2x2ZSIsIm5vZGVSZXNvbHZlIiwicmVhZEZpbGUiLCJyb2xsdXAiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7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LEVBQUUsQ0FBQyxPQUFPLENBQUMsRUFBRSxFQUFFLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUU7QUFDbkcsUUFBUSxTQUFTLFFBQVEsQ0FBQyxLQUFLLEVBQUUsRUFBRSxJQUFJLEVBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxPQUFPLENBQUMsRUFBRSxFQUFFLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUU7QUFDdEcsUUFBUSxTQUFTLElBQUksQ0FBQyxNQUFNLEVBQUUsRUFBRSxNQUFNLENBQUMsSUFBSSxHQUFHLE9BQU8sQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLEdBQUcsS0FBSyxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQyxJQUFJLENBQUMsU0FBUyxFQUFFLFFBQVEsQ0FBQyxDQUFDLEVBQUU7QUFDdEgsUUFBUSxJQUFJLENBQUMsQ0FBQyxTQUFTLEdBQUcsU0FBUyxDQUFDLEtBQUssQ0FBQyxPQUFPLEVBQUUsVUFBVSxJQUFJLEVBQUUsQ0FBQyxFQUFFLElBQUksRUFBRSxDQUFDLENBQUM7QUFDOUUsS0FBSyxDQUFDLENBQUM7QUFDUCxDQUFDO0FBQ0Q7QUFDTyxTQUFTLFdBQVcsQ0FBQyxPQUFPLEVBQUUsSUFBSSxFQUFFO0FBQzNDLElBQUksSUFBSSxDQUFDLEdBQUcsRUFBRSxLQUFLLEVBQUUsQ0FBQyxFQUFFLElBQUksRUFBRSxXQUFXLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxFQUFFLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFLElBQUksRUFBRSxFQUFFLEVBQUUsR0FBRyxFQUFFLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsR0FBRyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUMsT0FBTyxRQUFRLEtBQUssVUFBVSxHQUFHLFFBQVEsR0FBRyxNQUFNLEVBQUUsU0FBUyxDQUFDLENBQUM7QUFDck0sSUFBSSxPQUFPLENBQUMsQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxPQUFPLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxPQUFPLE1BQU0sS0FBSyxVQUFVLEtBQUssQ0FBQyxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsR0FBRyxXQUFXLEVBQUUsT0FBTyxJQUFJLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDO0FBQ2hLLElBQUksU0FBUyxJQUFJLENBQUMsQ0FBQyxFQUFFLEVBQUUsT0FBTyxVQUFVLENBQUMsRUFBRSxFQUFFLE9BQU8sSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUU7QUFDdEUsSUFBSSxTQUFTLElBQUksQ0FBQyxFQUFFLEVBQUU7QUFDdEIsUUFBUSxJQUFJLENBQUMsRUFBRSxNQUFNLElBQUksU0FBUyxDQUFDLGlDQUFpQyxDQUFDLENBQUM7QUFDdEUsUUFBUSxPQUFPLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsSUFBSTtBQUN0RCxZQUFZLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsSUFBSSxFQUFFLE9BQU8sQ0FBQyxDQUFDO0FBQ3pLLFlBQVksSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQztBQUNwRCxZQUFZLFFBQVEsRUFBRSxDQUFDLENBQUMsQ0FBQztBQUN6QixnQkFBZ0IsS0FBSyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsTUFBTTtBQUM5QyxnQkFBZ0IsS0FBSyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEtBQUssRUFBRSxDQUFDLENBQUMsT0FBTyxFQUFFLEtBQUssRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUUsSUFBSSxFQUFFLEtBQUssRUFBRSxDQUFDO0FBQ3hFLGdCQUFnQixLQUFLLENBQUMsRUFBRSxDQUFDLENBQUMsS0FBSyxFQUFFLENBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTO0FBQ2pFLGdCQUFnQixLQUFLLENBQUMsRUFBRSxFQUFFLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxTQUFTO0FBQ2pFLGdCQUFnQjtBQUNoQixvQkFBb0IsSUFBSSxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUMsTUFBTSxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsQ0FBQyxLQUFLLEVBQUUsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLFNBQVMsRUFBRTtBQUNoSSxvQkFBb0IsSUFBSSxFQUFFLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQyxLQUFLLEVBQUUsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsS0FBSyxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sRUFBRTtBQUMxRyxvQkFBb0IsSUFBSSxFQUFFLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQyxLQUFLLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLEtBQUssR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsTUFBTSxFQUFFO0FBQ3pGLG9CQUFvQixJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsS0FBSyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQyxLQUFLLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxNQUFNLEVBQUU7QUFDdkYsb0JBQW9CLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxFQUFFLENBQUM7QUFDMUMsb0JBQW9CLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxT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
