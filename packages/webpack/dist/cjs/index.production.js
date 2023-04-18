'use strict';

var webpackMerge = require('webpack-merge');
var path = require('path');
var ESLintWebpackPlugin = require('eslint-webpack-plugin');
var ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
var webpack = require('webpack');
var webpackBundleAnalyzer = require('webpack-bundle-analyzer');
var webpackManifestPlugin = require('webpack-manifest-plugin');
var nodeExternals = require('webpack-node-externals');

var outputPath = function (env, isDEV, outputScope) { return path.resolve(process.cwd(), isDEV ? "dev" : "dist", outputScope, env); };
var outputConfig = function (_a) {
    var env = _a.env, isDEV = _a.isDEV, isMIDDLEWARE = _a.isMIDDLEWARE, DEV_HOST = _a.DEV_HOST, WDS_PORT = _a.WDS_PORT, PROD_HOST = _a.PROD_HOST, PROD_PORT = _a.PROD_PORT, OUTPUT_SCOPE = _a.OUTPUT_SCOPE;
    return env === "client"
        ? {
            clean: true,
            // 输出路径
            path: outputPath(env, Boolean(isDEV), OUTPUT_SCOPE),
            // 输出文件名
            filename: isDEV ? "[name].js" : "[name]-[contenthash].js",
            // 按需加载的chunk名
            chunkFilename: isDEV ? "[name].js" : "[name]-[contenthash].js",
            // 引入资源的url路径
            publicPath: isDEV ? (isMIDDLEWARE ? "/dev/" : "http://".concat(DEV_HOST, ":").concat(WDS_PORT, "/dev/")) : "http://".concat(PROD_HOST, ":").concat(PROD_PORT, "/").concat(OUTPUT_SCOPE, "client/"),
        }
        : {
            clean: true,
            path: outputPath(env, Boolean(isDEV), OUTPUT_SCOPE),
            // 输出文件名
            filename: "app.js",
            // 按需加载的chunk名
            chunkFilename: isDEV ? "[name].js" : "[name]-[contenthash].js",
            // 引入资源的url路径
            publicPath: isDEV ? (isMIDDLEWARE ? "/dev/" : "http://".concat(DEV_HOST, ":").concat(WDS_PORT, "/dev/")) : "http://".concat(PROD_HOST, ":").concat(PROD_PORT, "/").concat(OUTPUT_SCOPE, "client/"),
            library: {
                type: "commonjs2",
            },
        };
};

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

function __spreadArray(to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
}

exports.MANIFEST = void 0;
(function (MANIFEST) {
    MANIFEST["manifest_loadable"] = "manifest-loadable.json";
    MANIFEST["manifest_deps"] = "manifest-deps.json";
    MANIFEST["manifest_dev"] = "manifest-dev.json";
    MANIFEST["manifest_prod"] = "manifest-prod.json";
    MANIFEST["manifest_static"] = "manifest-static.json";
})(exports.MANIFEST || (exports.MANIFEST = {}));

// https://github.com/artem-malko/react-ssr-template/blob/main/src/infrastructure/dependencyManager/webpack/plugin.ts
var RawSource = webpack.sources.RawSource;
var pluginName = "webpack-page-deps-plugin";
// https://github.com/shellscape/webpack-manifest-plugin/blob/6a521600b0b7dd66db805bf8fb8afaa8c41290cb/src/index.ts#L48
var hashKey = /([a-f0-9]{16,32}\.?)/gi;
var transformExtensions = /^(gz|map)$/i;
var STATIC_PAGE_EXPORT = "isStatic";
var WebpackPageDepsPlugin = /** @class */ (function () {
    function WebpackPageDepsPlugin(p) {
        if (p === void 0) { p = {}; }
        this.fileName = p.fileName || exports.MANIFEST.manifest_deps;
    }
    WebpackPageDepsPlugin.prototype.apply = function (compiler) {
        var _this = this;
        compiler.hooks.thisCompilation.tap(pluginName, function (compilation) {
            compilation.hooks.processAssets.tapPromise({ name: pluginName, stage: webpack.Compilation.PROCESS_ASSETS_STAGE_REPORT }, function () { return _this.emitStates(compilation); });
        });
    };
    WebpackPageDepsPlugin.prototype.emitStates = function (compilation) {
        var _this = this;
        var statsChunks = compilation.getStats().toJson().chunks;
        if (!statsChunks) {
            throw new Error("NO CHUNKS IN STATS");
        }
        return Promise.resolve()
            .then(function () {
            var reducedStats = statsChunks.reduce(function (mutableAcc, statsChunk) {
                var _a, _b;
                if (!statsChunk.id) {
                    return mutableAcc;
                }
                // generate chunk name which keep same with `webpack-manifest-plugin`
                // files contain current chunk all files, like js, css...
                var files = Array.from(statsChunk.files || []).map(function (fileName) {
                    var _a, _b;
                    var replaced = fileName.replace(/\?.*/, "");
                    var split = replaced.split(".");
                    var extension = split.pop();
                    var finalExtension = extension && transformExtensions.test(extension) ? "".concat(split.pop(), ".").concat(extension) : extension;
                    var name = ((_a = statsChunk.names) === null || _a === void 0 ? void 0 : _a[0]) ? ((_b = statsChunk.names) === null || _b === void 0 ? void 0 : _b[0]) + "." + finalExtension : fileName;
                    return name.replace(hashKey, "");
                });
                mutableAcc.chunkIdToChunkName[statsChunk.id] = {
                    id: statsChunk.id,
                    name: files[0],
                    locName: (_b = (_a = statsChunk.origins) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.request,
                };
                if (statsChunk.modules) {
                    mutableAcc.chunkIdToModules[statsChunk.id] = statsChunk.modules;
                }
                if (files[0]) {
                    mutableAcc.chunkIdToFileNameMap[statsChunk.id] = files;
                }
                if (statsChunk.children) {
                    mutableAcc.chunkIdToChildrenIds[statsChunk.id] = statsChunk.children.filter(function (childId) {
                        var _a;
                        /**
                         * It's strange, but sometimes it is possible, that current chunk can have one dep
                         * in parents and in children.
                         * To prevent recursion in the next steps, we filter that ids out
                         */
                        return !((_a = statsChunk.parents) === null || _a === void 0 ? void 0 : _a.includes(childId));
                    });
                }
                return mutableAcc;
            }, {
                chunkIdToModules: {},
                chunkIdToFileNameMap: {},
                chunkIdToChunkName: {},
                chunkIdToChildrenIds: {},
            });
            return Object.keys(reducedStats.chunkIdToChunkName).reduce(function (mutableAcc, chunkId) {
                var _a = reducedStats.chunkIdToChunkName[chunkId], chunkName = _a.name, locName = _a.locName;
                // We do not collect deps for not page's chunks
                if (!chunkName || !/page/i.test(chunkName)) {
                    return mutableAcc;
                }
                var childrenIds = reducedStats.chunkIdToChildrenIds[chunkId];
                var modules = reducedStats.chunkIdToModules[chunkId];
                var files = getFiles(reducedStats.chunkIdToFileNameMap, reducedStats.chunkIdToChildrenIds, childrenIds);
                var mainModule = modules.find(function (item) { return !item.dependent; });
                var mainExport = (mainModule === null || mainModule === void 0 ? void 0 : mainModule.providedExports) || [];
                var path = locName;
                var isDynamicPage = path.includes("/:");
                mutableAcc[path] = {
                    path: __spreadArray([chunkName], files, true),
                    static: isDynamicPage ? false : mainExport.some(function (name) { return name === STATIC_PAGE_EXPORT; }),
                };
                return mutableAcc;
            }, {});
        })
            .then(function (result) {
            var resultString = JSON.stringify(result, null, 2);
            var resultStringBuf = Buffer.from(resultString, "utf-8");
            var source = new RawSource(resultStringBuf);
            var filename = _this.fileName;
            var asset = compilation.getAsset(filename);
            if (asset) {
                compilation.updateAsset(filename, source);
            }
            else {
                compilation.emitAsset(filename, source);
            }
        });
    };
    return WebpackPageDepsPlugin;
}());
/**
 * This function has a recurtion inside, cause the first level children can have its own children
 */
var getFiles = function (chunkIdToFileNameMap, chunkIdToChildrenIds, childrenIds) {
    var mutableFoundFiles = [];
    function innerFunc(chunkIdToFileNameMap, chunkIdToChildrenIds, childrenIds) {
        if (!(childrenIds === null || childrenIds === void 0 ? void 0 : childrenIds.length)) {
            return mutableFoundFiles;
        }
        childrenIds.forEach(function (childId) {
            var _a;
            var fileName = chunkIdToFileNameMap[childId];
            if ((_a = chunkIdToChildrenIds[childId]) === null || _a === void 0 ? void 0 : _a.length) {
                innerFunc(chunkIdToFileNameMap, chunkIdToChildrenIds, chunkIdToChildrenIds[childId]);
            }
            if (fileName.length) {
                var needAdd = fileName.filter(function (f) { return !mutableFoundFiles.includes(f); });
                mutableFoundFiles.push.apply(mutableFoundFiles, needAdd);
            }
        });
    }
    innerFunc(chunkIdToFileNameMap, chunkIdToChildrenIds, childrenIds);
    return mutableFoundFiles;
};

var pluginsConfig = function (_a) {
    var env = _a.env, isDEV = _a.isDEV, isMIDDLEWARE = _a.isMIDDLEWARE, TS_CHECK = _a.TS_CHECK, ESLINT_CHECK = _a.ESLINT_CHECK, BUNDLE_CHECK = _a.BUNDLE_CHECK;
    return [
        env === "client" &&
            new webpackManifestPlugin.WebpackManifestPlugin({
                fileName: isDEV ? exports.MANIFEST.manifest_dev : exports.MANIFEST.manifest_prod,
            }),
        env === "client" && new WebpackPageDepsPlugin(),
        new webpack.DefinePlugin({
            __CLIENT__: env === "client",
            __SERVER__: env === "server",
            __DEVELOPMENT__: isDEV,
            __BUILD_TIME__: JSON.stringify(new Date().toLocaleString()),
        }),
        env === "client" && isDEV && isMIDDLEWARE && new webpack.HotModuleReplacementPlugin(),
        env === "server" && isDEV && !isMIDDLEWARE && new webpack.HotModuleReplacementPlugin(),
        // there are a error https://github.com/TypeStrong/fork-ts-checker-webpack-plugin/issues/775
        env === "client" &&
            isDEV &&
            TS_CHECK &&
            new ForkTsCheckerWebpackPlugin({
                async: false,
            }),
        env === "client" &&
            isDEV &&
            ESLINT_CHECK &&
            new ESLintWebpackPlugin({
                extensions: ["ts", "tsx"],
                quiet: true,
            }),
        env === "client" && isDEV && BUNDLE_CHECK && new webpackBundleAnalyzer.BundleAnalyzerPlugin(),
    ].filter(Boolean);
};

var commonConfig = function (_a) {
    var env = _a.env, isDEV = _a.isDEV;
    return ({
        name: env,
        mode: (isDEV ? "development" : "production"),
        target: env === "client" ? "web" : "node16",
        context: path.resolve(process.cwd()),
        externalsPresets: env === "server" ? { node: true } : { web: true },
    });
};

var statsConfig = function (_a) {
    var env = _a.env, isDEV = _a.isDEV;
    return isDEV || env === "server" ? "errors-only" : "normal";
};

var BaseConfig = function (props) { return (__assign(__assign({}, commonConfig(props)), { stats: statsConfig(props), infrastructureLogging: {
        level: "error",
    } })); };

var ClientConfig = function (props) {
    var isDEV = props.isDEV, isMIDDLEWARE = props.isMIDDLEWARE, entry = props.entry;
    var clientBase = BaseConfig(props);
    var output = outputConfig(props);
    var plugins = pluginsConfig(props);
    return webpackMerge.merge(clientBase, {
        devtool: isDEV ? "eval-cheap-module-source-map" : "hidden-source-map",
        entry: {
            main: isDEV && isMIDDLEWARE ? ["webpack-hot-middleware/client", entry] : entry,
        },
        output: output,
        plugins: plugins,
    });
};

var externalsConfig = function (_a) {
    var env = _a.env;
    return env === "server"
        ? [
            nodeExternals({
                // load non-javascript files with extensions, presumably via loaders
                allowlist: [/\.(?!(?:jsx?|json)$).{1,5}$/i, "webpack/hot/poll?1000", "lodash-es"],
            }),
        ]
        : {};
};

var ServerConfig = function (props) {
    var isDEV = props.isDEV, isMIDDLEWARE = props.isMIDDLEWARE, entry = props.entry;
    var serverBase = BaseConfig(props);
    var output = outputConfig(props);
    var plugins = pluginsConfig(props);
    var externals = externalsConfig(props);
    return webpackMerge.merge(serverBase, {
        entry: {
            main: isDEV && !isMIDDLEWARE ? ["webpack/hot/poll?1000", entry] : entry,
        },
        output: output,
        plugins: plugins,
        externals: externals,
    });
};

var config = function (_a) {
    var serverEntry = _a.serverEntry, clientEntry = _a.clientEntry, webpackClient = _a.webpackClient, webpackServer = _a.webpackServer, isDEV = _a.isDEV, isMIDDLEWARE = _a.isMIDDLEWARE, WDS_PORT = _a.WDS_PORT, DEV_HOST = _a.DEV_HOST, DEV_PORT = _a.DEV_PORT, PROD_HOST = _a.PROD_HOST, PROD_PORT = _a.PROD_PORT, OUTPUT_SCOPE = _a.OUTPUT_SCOPE, 
    // check
    TS_CHECK = _a.TS_CHECK, ESLINT_CHECK = _a.ESLINT_CHECK, BUNDLE_CHECK = _a.BUNDLE_CHECK;
    var externalClientConfig = webpackClient === null || webpackClient === void 0 ? void 0 : webpackClient({
        env: "client",
        isDEV: isDEV,
        isMIDDLEWARE: isMIDDLEWARE,
        entry: clientEntry,
        WDS_PORT: WDS_PORT,
        DEV_HOST: DEV_HOST,
        DEV_PORT: DEV_PORT,
        PROD_HOST: PROD_HOST,
        PROD_PORT: PROD_PORT,
        OUTPUT_SCOPE: OUTPUT_SCOPE,
    });
    var externalServerConfig = webpackServer === null || webpackServer === void 0 ? void 0 : webpackServer({
        env: "server",
        isDEV: isDEV,
        isMIDDLEWARE: isMIDDLEWARE,
        entry: serverEntry,
        WDS_PORT: WDS_PORT,
        DEV_HOST: DEV_HOST,
        DEV_PORT: DEV_PORT,
        PROD_HOST: PROD_HOST,
        PROD_PORT: PROD_PORT,
        OUTPUT_SCOPE: OUTPUT_SCOPE,
    });
    return [
        webpackMerge.merge(ClientConfig({
            env: "client",
            isDEV: isDEV,
            isMIDDLEWARE: isMIDDLEWARE,
            entry: clientEntry,
            WDS_PORT: WDS_PORT,
            DEV_HOST: DEV_HOST,
            DEV_PORT: DEV_PORT,
            PROD_HOST: PROD_HOST,
            PROD_PORT: PROD_PORT,
            OUTPUT_SCOPE: OUTPUT_SCOPE,
            TS_CHECK: TS_CHECK,
            ESLINT_CHECK: ESLINT_CHECK,
            BUNDLE_CHECK: BUNDLE_CHECK,
        }), externalClientConfig || {}),
        webpackMerge.merge(ServerConfig({
            env: "server",
            entry: serverEntry,
            isDEV: isDEV,
            isMIDDLEWARE: isMIDDLEWARE,
            WDS_PORT: WDS_PORT,
            DEV_HOST: DEV_HOST,
            DEV_PORT: DEV_PORT,
            PROD_HOST: PROD_HOST,
            PROD_PORT: PROD_PORT,
            OUTPUT_SCOPE: OUTPUT_SCOPE,
            TS_CHECK: TS_CHECK,
            ESLINT_CHECK: ESLINT_CHECK,
            BUNDLE_CHECK: BUNDLE_CHECK,
        }), externalServerConfig || {}),
    ];
};
var singleConfig = function (props) {
    var _a;
    return webpackMerge.merge(props.env === 'client' ? ClientConfig(props) : ServerConfig(props), (_a = props.extendConfig) === null || _a === void 0 ? void 0 : _a.call(props, props));
};

var definedUniversalWebpackConfig = config;
var definedWebpackConfig = singleConfig;

exports.definedUniversalWebpackConfig = definedUniversalWebpackConfig;
exports.definedWebpackConfig = definedWebpackConfig;
Object.keys(webpackMerge).forEach(function (k) {
  if (k !== 'default' && !exports.hasOwnProperty(k)) Object.defineProperty(exports, k, {
    enumerable: true,
    get: function () { return webpackMerge[k]; }
  });
});
//# sourceMappingURL=index.production.js.map
