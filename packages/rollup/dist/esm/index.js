import uniq from 'lodash/uniq';
import { rollup, watch as watch$1 } from 'rollup';
import { pino } from 'pino';
import pretty from 'pino-pretty';
import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import replace from '@rollup/plugin-replace';
import terser from '@rollup/plugin-terser';
import * as path from 'path';
import path__default, { dirname, relative, resolve } from 'path';
import { createFilter } from '@rollup/pluginutils';
import typescript$1 from 'typescript';
import { fileURLToPath } from 'url';
import resolve$1 from 'resolve';
import fs, { promises, readFileSync } from 'fs';
import { access, readFile } from 'fs/promises';
import cloneDeep from 'lodash/cloneDeep';

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
/* global Reflect, Promise, SuppressedError, Symbol */


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

typeof SuppressedError === "function" ? SuppressedError : function (error, suppressed, message) {
    var e = new Error(message);
    return e.name = "SuppressedError", e.error = error, e.suppressed = suppressed, e;
};

var logger = function () { return pino(pretty()); };

/**
 * Create a format diagnostics host to use with the Typescript type checking APIs.
 * Typescript hosts are used to represent the user's system,
 * with an API for checking case sensitivity etc.
 * @param compilerOptions Typescript compiler options. Affects functions such as `getNewLine`.
 * @see https://github.com/Microsoft/TypeScript/wiki/Using-the-Compiler-API
 */
function createFormattingHost(ts, compilerOptions) {
    return {
        /** Returns the compiler options for the project. */
        getCompilationSettings: () => compilerOptions,
        /** Returns the current working directory. */
        getCurrentDirectory: () => process.cwd(),
        /** Returns the string that corresponds with the selected `NewLineKind`. */
        getNewLine() {
            switch (compilerOptions.newLine) {
                case ts.NewLineKind.CarriageReturnLineFeed:
                    return '\r\n';
                case ts.NewLineKind.LineFeed:
                    return '\n';
                default:
                    return ts.sys.newLine;
            }
        },
        /** Returns a lower case name on case insensitive systems, otherwise the original name. */
        getCanonicalFileName: (fileName) => ts.sys.useCaseSensitiveFileNames ? fileName : fileName.toLowerCase()
    };
}

/**
 * Create a helper for resolving modules using Typescript.
 * @param host Typescript host that extends `ModuleResolutionHost`
 * with methods for sanitizing filenames and getting compiler options.
 */
function createModuleResolver(ts, host, filter) {
    const compilerOptions = host.getCompilationSettings();
    const cache = ts.createModuleResolutionCache(process.cwd(), host.getCanonicalFileName, compilerOptions);
    const moduleHost = { ...ts.sys, ...host };
    return (moduleName, containingFile, redirectedReference, mode) => {
        const { resolvedModule } = ts.resolveModuleName(moduleName, containingFile, compilerOptions, moduleHost, cache, redirectedReference, mode);
        /**
         * If the module's path contains 'node_modules', ts considers it an external library and refuses to compile it,
         * so we have to change the value of `isExternalLibraryImport` to false if it's true
         * */
        if ((resolvedModule === null || resolvedModule === void 0 ? void 0 : resolvedModule.isExternalLibraryImport) && filter(resolvedModule === null || resolvedModule === void 0 ? void 0 : resolvedModule.resolvedFileName)) {
            resolvedModule.isExternalLibraryImport = false;
        }
        return resolvedModule;
    };
}

// const resolveIdAsync = (file: string, opts: AsyncOpts) =>
//   new Promise<string>((fulfil, reject) =>
//     resolveId(file, opts, (err, contents) =>
//       err || typeof contents === 'undefined' ? reject(err) : fulfil(contents)
//     )
//   );
const resolveId = (file, opts) => resolve$1.sync(file, opts);
/**
 * Returns code asynchronously for the tslib helper library.
 */
const getTsLibPath = () => {
    // Note: This isn't preferable, but we've no other way to test this bit. Removing the tslib devDep
    //       during the test run doesn't work due to the nature of the pnpm flat node_modules, and
    //       other workspace dependencies that depenend upon tslib.
    try {
        // eslint-disable-next-line no-underscore-dangle
        return resolveId(process.env.__TSLIB_TEST_PATH__ || 'tslib/tslib.es6.js', {
            // @ts-ignore import.meta.url is allowed because the Rollup plugin injects the correct module format
            basedir: fileURLToPath(new URL('.', import.meta.url))
        });
    }
    catch (_) {
        return null;
    }
};

/**
 * Separate the Rollup plugin options from the Typescript compiler options,
 * and normalize the Rollup options.
 * @returns Object with normalized options:
 * - `filter`: Checks if a file should be included.
 * - `tsconfig`: Path to a tsconfig, or directive to ignore tsconfig.
 * - `compilerOptions`: Custom Typescript compiler options that override tsconfig.
 * - `typescript`: Instance of Typescript library (possibly custom).
 * - `tslib`: ESM code from the tslib helper library (possibly custom).
 */
const getPluginOptions = (options) => {
    const { cacheDir, exclude, include, filterRoot, noForceEmit, transformers, tsconfig, tslib, typescript, outputToFilesystem, compilerOptions, 
    // previously was compilerOptions
    ...extra } = options;
    return {
        cacheDir,
        include,
        exclude,
        filterRoot,
        noForceEmit: noForceEmit || false,
        tsconfig,
        compilerOptions: { ...extra, ...compilerOptions },
        typescript: typescript || typescript$1,
        tslib: tslib || getTsLibPath(),
        transformers,
        outputToFilesystem
    };
};

/**
 * Converts a Typescript type error into an equivalent Rollup warning object.
 */
function diagnosticToWarning(ts, host, diagnostic) {
    const pluginCode = `TS${diagnostic.code}`;
    const message = ts.flattenDiagnosticMessageText(diagnostic.messageText, '\n');
    // Build a Rollup warning object from the diagnostics object.
    const warning = {
        pluginCode,
        message: `@rollup/plugin-typescript ${pluginCode}: ${message}`
    };
    if (diagnostic.file) {
        // Add information about the file location
        const { line, character } = diagnostic.file.getLineAndCharacterOfPosition(diagnostic.start);
        warning.loc = {
            column: character + 1,
            line: line + 1,
            file: diagnostic.file.fileName
        };
        if (host) {
            // Extract a code frame from Typescript
            const formatted = ts.formatDiagnosticsWithColorAndContext([diagnostic], host);
            // Typescript only exposes this formatter as a string prefixed with the flattened message.
            // We need to remove it here since Rollup treats the properties as separate parts.
            let frame = formatted.slice(formatted.indexOf(message) + message.length);
            const newLine = host.getNewLine();
            if (frame.startsWith(newLine)) {
                frame = frame.slice(frame.indexOf(newLine) + newLine.length);
            }
            warning.frame = frame;
        }
    }
    return warning;
}

const DEFAULT_COMPILER_OPTIONS = {
    module: 'esnext',
    skipLibCheck: true
};
const OVERRIDABLE_EMIT_COMPILER_OPTIONS = {
    noEmit: false,
    emitDeclarationOnly: false
};
const FORCED_COMPILER_OPTIONS = {
    // Always use tslib
    noEmitHelpers: true,
    importHelpers: true,
    // Preventing Typescript from resolving code may break compilation
    noResolve: false
};

/* eslint-disable no-param-reassign */
const DIRECTORY_PROPS = ['outDir', 'declarationDir'];
/**
 * Mutates the compiler options to convert paths from relative to absolute.
 * This should be used with compiler options passed through the Rollup plugin options,
 * not those found from loading a tsconfig.json file.
 * @param compilerOptions Compiler options to _mutate_.
 * @param relativeTo Paths are resolved relative to this path.
 */
function makePathsAbsolute(compilerOptions, relativeTo) {
    for (const pathProp of DIRECTORY_PROPS) {
        if (compilerOptions[pathProp]) {
            compilerOptions[pathProp] = resolve(relativeTo, compilerOptions[pathProp]);
        }
    }
}
/**
 * Mutates the compiler options to normalize some values for Rollup.
 * @param compilerOptions Compiler options to _mutate_.
 * @returns True if the source map compiler option was not initially set.
 */
function normalizeCompilerOptions(ts, compilerOptions) {
    let autoSetSourceMap = false;
    if (compilerOptions.inlineSourceMap) {
        // Force separate source map files for Rollup to work with.
        compilerOptions.sourceMap = true;
        compilerOptions.inlineSourceMap = false;
    }
    else if (typeof compilerOptions.sourceMap !== 'boolean') {
        // Default to using source maps.
        // If the plugin user sets sourceMap to false we keep that option.
        compilerOptions.sourceMap = true;
        // Using inlineSources to make sure typescript generate source content
        // instead of source path.
        compilerOptions.inlineSources = true;
        autoSetSourceMap = true;
    }
    switch (compilerOptions.module) {
        case ts.ModuleKind.ES2015:
        case ts.ModuleKind.ESNext:
        case ts.ModuleKind.Node16:
        case ts.ModuleKind.NodeNext:
        case ts.ModuleKind.CommonJS:
            // OK module type
            return autoSetSourceMap;
        case ts.ModuleKind.None:
        case ts.ModuleKind.AMD:
        case ts.ModuleKind.UMD:
        case ts.ModuleKind.System: {
            // Invalid module type
            const moduleType = ts.ModuleKind[compilerOptions.module];
            throw new Error(`@rollup/plugin-typescript: The module kind should be 'ES2015', 'ESNext', 'node16' or 'nodenext', found: '${moduleType}'`);
        }
        default:
            // Unknown or unspecified module type, force ESNext
            compilerOptions.module = ts.ModuleKind.ESNext;
    }
    return autoSetSourceMap;
}

const { ModuleKind: ModuleKind$1, ModuleResolutionKind } = typescript$1;
function makeForcedCompilerOptions(noForceEmit) {
    return { ...FORCED_COMPILER_OPTIONS, ...(noForceEmit ? {} : OVERRIDABLE_EMIT_COMPILER_OPTIONS) };
}
/**
 * Finds the path to the tsconfig file relative to the current working directory.
 * @param relativePath Relative tsconfig path given by the user.
 * If `false` is passed, then a null path is returned.
 * @returns The absolute path, or null if the file does not exist.
 */
function getTsConfigPath(ts, relativePath) {
    if (relativePath === false)
        return null;
    // Resolve path to file. `tsConfigOption` defaults to 'tsconfig.json'.
    const tsConfigPath = resolve(process.cwd(), relativePath || 'tsconfig.json');
    if (!ts.sys.fileExists(tsConfigPath)) {
        if (relativePath) {
            // If an explicit path was provided but no file was found, throw
            throw new Error(`Could not find specified tsconfig.json at ${tsConfigPath}`);
        }
        else {
            return null;
        }
    }
    return tsConfigPath;
}
/**
 * Tries to read the tsconfig file at `tsConfigPath`.
 * @param tsConfigPath Absolute path to tsconfig JSON file.
 * @param explicitPath If true, the path was set by the plugin user.
 * If false, the path was computed automatically.
 */
function readTsConfigFile(ts, tsConfigPath) {
    const { config, error } = ts.readConfigFile(tsConfigPath, (path) => readFileSync(path, 'utf8'));
    if (error) {
        throw Object.assign(Error(), diagnosticToWarning(ts, null, error));
    }
    return config || {};
}
/**
 * Returns true if any of the `compilerOptions` contain an enum value (i.e.: ts.ScriptKind) rather than a string.
 * This indicates that the internal CompilerOptions type is used rather than the JsonCompilerOptions.
 */
function containsEnumOptions(compilerOptions) {
    const enums = [
        'module',
        'target',
        'jsx',
        'moduleResolution',
        'newLine'
    ];
    return enums.some((prop) => prop in compilerOptions && typeof compilerOptions[prop] === 'number');
}
/**
 * The module resolution kind is a function of the resolved `compilerOptions.module`.
 * This needs to be set explicitly for `resolveModuleName` to select the correct resolution method
 */
function setModuleResolutionKind(parsedConfig) {
    const moduleKind = parsedConfig.options.module;
    // Fallback if `parsedConfig.options.moduleResolution` is not set
    const moduleResolution = moduleKind === ModuleKind$1.Node16
        ? ModuleResolutionKind.Node16
        : moduleKind === ModuleKind$1.NodeNext
            ? ModuleResolutionKind.NodeNext
            : ModuleResolutionKind.NodeJs;
    return {
        ...parsedConfig,
        options: {
            moduleResolution,
            ...parsedConfig.options
        }
    };
}
const configCache = new Map();
/**
 * Parse the Typescript config to use with the plugin.
 * @param ts Typescript library instance.
 * @param tsconfig Path to the tsconfig file, or `false` to ignore the file.
 * @param compilerOptions Options passed to the plugin directly for Typescript.
 *
 * @returns Parsed tsconfig.json file with some important properties:
 * - `options`: Parsed compiler options.
 * - `fileNames` Type definition files that should be included in the build.
 * - `errors`: Any errors from parsing the config file.
 */
function parseTypescriptConfig(ts, tsconfig, compilerOptions, noForceEmit) {
    /* eslint-disable no-undefined */
    const cwd = process.cwd();
    makePathsAbsolute(compilerOptions, cwd);
    let parsedConfig;
    // Resolve path to file. If file is not found, pass undefined path to `parseJsonConfigFileContent`.
    // eslint-disable-next-line no-undefined
    const tsConfigPath = getTsConfigPath(ts, tsconfig) || undefined;
    const tsConfigFile = tsConfigPath ? readTsConfigFile(ts, tsConfigPath) : {};
    const basePath = tsConfigPath ? dirname(tsConfigPath) : cwd;
    // If compilerOptions has enums, it represents an CompilerOptions object instead of parsed JSON.
    // This determines where the data is passed to the parser.
    if (containsEnumOptions(compilerOptions)) {
        parsedConfig = setModuleResolutionKind(ts.parseJsonConfigFileContent({
            ...tsConfigFile,
            compilerOptions: {
                ...DEFAULT_COMPILER_OPTIONS,
                ...tsConfigFile.compilerOptions
            }
        }, ts.sys, basePath, { ...compilerOptions, ...makeForcedCompilerOptions(noForceEmit) }, tsConfigPath, undefined, undefined, configCache));
    }
    else {
        parsedConfig = setModuleResolutionKind(ts.parseJsonConfigFileContent({
            ...tsConfigFile,
            compilerOptions: {
                ...DEFAULT_COMPILER_OPTIONS,
                ...tsConfigFile.compilerOptions,
                ...compilerOptions
            }
        }, ts.sys, basePath, makeForcedCompilerOptions(noForceEmit), tsConfigPath, undefined, undefined, configCache));
    }
    const autoSetSourceMap = normalizeCompilerOptions(ts, parsedConfig.options);
    return {
        ...parsedConfig,
        autoSetSourceMap
    };
}
/**
 * If errors are detected in the parsed options,
 * display all of them as warnings then emit an error.
 */
function emitParsedOptionsErrors(ts, context, parsedOptions) {
    if (parsedOptions.errors.length > 0) {
        parsedOptions.errors.forEach((error) => context.warn(diagnosticToWarning(ts, null, error)));
        context.error(`@rollup/plugin-typescript: Couldn't process compiler options`);
    }
}

/**
 * Validate that the `compilerOptions.sourceMap` option matches `outputOptions.sourcemap`.
 * @param context Rollup plugin context used to emit warnings.
 * @param compilerOptions Typescript compiler options.
 * @param outputOptions Rollup output options.
 * @param autoSetSourceMap True if the `compilerOptions.sourceMap` property was set to `true`
 * by the plugin, not the user.
 */
function validateSourceMap(context, compilerOptions, outputOptions, autoSetSourceMap) {
    if (compilerOptions.sourceMap && !outputOptions.sourcemap && !autoSetSourceMap) {
        context.warn(`@rollup/plugin-typescript: Rollup 'sourcemap' option must be set to generate source maps.`);
    }
    else if (!compilerOptions.sourceMap && outputOptions.sourcemap) {
        context.warn(`@rollup/plugin-typescript: Typescript 'sourceMap' compiler option must be set to generate source maps.`);
    }
}
/**
 * Validate that the out directory used by Typescript can be controlled by Rollup.
 * @param context Rollup plugin context used to emit errors.
 * @param compilerOptions Typescript compiler options.
 * @param outputOptions Rollup output options.
 */
function validatePaths(context, compilerOptions, outputOptions) {
    if (compilerOptions.out) {
        context.error(`@rollup/plugin-typescript: Deprecated Typescript compiler option 'out' is not supported. Use 'outDir' instead.`);
    }
    else if (compilerOptions.outFile) {
        context.error(`@rollup/plugin-typescript: Typescript compiler option 'outFile' is not supported. Use 'outDir' instead.`);
    }
    for (const dirProperty of DIRECTORY_PROPS) {
        if (compilerOptions[dirProperty] && outputOptions.dir) {
            // Checks if the given path lies within Rollup output dir
            const fromRollupDirToTs = relative(outputOptions.dir, compilerOptions[dirProperty]);
            if (fromRollupDirToTs.startsWith('..')) {
                context.error(`@rollup/plugin-typescript: Path of Typescript compiler option '${dirProperty}' must be located inside Rollup 'dir' option.`);
            }
        }
    }
    if (compilerOptions.declaration || compilerOptions.declarationMap || compilerOptions.composite) {
        if (DIRECTORY_PROPS.every((dirProperty) => !compilerOptions[dirProperty])) {
            context.error(`@rollup/plugin-typescript: You are using one of Typescript's compiler options 'declaration', 'declarationMap' or 'composite'. ` +
                `In this case 'outDir' or 'declarationDir' must be specified to generate declaration files.`);
        }
    }
}

/**
 * Checks if the given OutputFile represents some code
 */
function isCodeOutputFile(name) {
    return !isMapOutputFile(name) && !isDeclarationOutputFile(name);
}
/**
 * Checks if the given OutputFile represents some source map
 */
function isMapOutputFile(name) {
    return name.endsWith('.map');
}
/**
 * Checks if the given OutputFile represents some TypeScript source map
 */
function isTypeScriptMapOutputFile(name) {
    return name.endsWith('ts.map');
}
/**
 * Checks if the given OutputFile represents some declaration
 */
function isDeclarationOutputFile(name) {
    return /\.d\.[cm]?ts$/.test(name);
}
/**
 * Returns the content of a filename either from the current
 * typescript compiler instance or from the cached content.
 * @param fileName The filename for the contents to retrieve
 * @param emittedFiles The files emitted in the current typescript instance
 * @param tsCache A cache to files cached by Typescript
 */
function getEmittedFile(fileName, emittedFiles, tsCache) {
    let code;
    if (fileName) {
        if (emittedFiles.has(fileName)) {
            code = emittedFiles.get(fileName);
        }
        else {
            code = tsCache.getCached(fileName);
        }
    }
    return code;
}
/**
 * Finds the corresponding emitted Javascript files for a given Typescript file.
 * @param id Path to the Typescript file.
 * @param emittedFiles Map of file names to source code,
 * containing files emitted by the Typescript compiler.
 */
function findTypescriptOutput(ts, parsedOptions, id, emittedFiles, tsCache) {
    const emittedFileNames = ts.getOutputFileNames(parsedOptions, id, !ts.sys.useCaseSensitiveFileNames);
    const codeFile = emittedFileNames.find(isCodeOutputFile);
    const mapFile = emittedFileNames.find(isMapOutputFile);
    return {
        code: getEmittedFile(codeFile, emittedFiles, tsCache),
        map: getEmittedFile(mapFile, emittedFiles, tsCache),
        declarations: emittedFileNames.filter((name) => name !== codeFile && name !== mapFile)
    };
}
function normalizePath(fileName) {
    return fileName.split(path.win32.sep).join(path.posix.sep);
}
async function emitFile({ dir }, outputToFilesystem, context, filePath, fileSource) {
    const normalizedFilePath = normalizePath(filePath);
    // const normalizedPath = normalizePath(filePath);
    // Note: `dir` can be a value like `dist` in which case, `path.relative` could result in a value
    // of something like `'../.tsbuildinfo'. Our else-case below needs to mimic `path.relative`
    // returning a dot-notated relative path, so the first if-then branch is entered into
    const relativePath = dir ? path.relative(dir, normalizedFilePath) : '..';
    // legal paths do not start with . nor .. : https://github.com/rollup/rollup/issues/3507#issuecomment-616495912
    if (relativePath.startsWith('..')) {
        if (outputToFilesystem == null) {
            context.warn(`@rollup/plugin-typescript: outputToFilesystem option is defaulting to true.`);
        }
        if (outputToFilesystem !== false) {
            await promises.mkdir(path.dirname(normalizedFilePath), { recursive: true });
            await promises.writeFile(normalizedFilePath, fileSource);
        }
    }
    else {
        context.emitFile({
            type: 'asset',
            fileName: relativePath,
            source: fileSource
        });
    }
}

// import { resolveIdAsync } from './tslib';
const { ModuleKind } = typescript$1;
const pluginName = '@rollup/plugin-typescript';
const moduleErrorMessage = `
${pluginName}: Rollup requires that TypeScript produces ES Modules. Unfortunately your configuration specifies a
 "module" other than "esnext". Unless you know what you're doing, please change "module" to "esnext"
 in the target tsconfig.json file or plugin options.`.replace(/\n/g, '');
const tsLibErrorMessage = `${pluginName}: Could not find module 'tslib', which is required by this plugin. Is it installed?`;
let undef;
const validModules = [
    ModuleKind.ES2015,
    ModuleKind.ES2020,
    ModuleKind.ESNext,
    ModuleKind.Node16,
    ModuleKind.NodeNext,
    undef
];
// eslint-disable-next-line import/prefer-default-export
const preflight = ({ config, context, inputPreserveModules, tslib }) => {
    if (!validModules.includes(config.options.module)) {
        context.warn(moduleErrorMessage);
    }
    if (!inputPreserveModules && tslib === null) {
        context.error(tsLibErrorMessage);
    }
};

// `Cannot compile modules into 'es6' when targeting 'ES5' or lower.`
const CANNOT_COMPILE_ESM = 1204;
/**
 * Emit a Rollup warning or error for a Typescript type error.
 */
function emitDiagnostic(ts, context, host, diagnostic) {
    if (diagnostic.code === CANNOT_COMPILE_ESM)
        return;
    const { noEmitOnError } = host.getCompilationSettings();
    // Build a Rollup warning object from the diagnostics object.
    const warning = diagnosticToWarning(ts, host, diagnostic);
    // Errors are fatal. Otherwise emit warnings.
    if (noEmitOnError && diagnostic.category === ts.DiagnosticCategory.Error) {
        context.error(warning);
    }
    else {
        context.warn(warning);
    }
}
function buildDiagnosticReporter(ts, context, host) {
    return function reportDiagnostics(diagnostic) {
        emitDiagnostic(ts, context, host, diagnostic);
    };
}

/**
 * Merges all received custom transformer definitions into a single CustomTransformers object
 */
function mergeTransformers(builder, ...input) {
    // List of all transformer stages
    const transformerTypes = ['after', 'afterDeclarations', 'before'];
    const accumulator = {
        after: [],
        afterDeclarations: [],
        before: []
    };
    let program;
    let typeChecker;
    input.forEach((transformers) => {
        if (!transformers) {
            // Skip empty arguments lists
            return;
        }
        transformerTypes.forEach((stage) => {
            getTransformers(transformers[stage]).forEach((transformer) => {
                if (!transformer) {
                    // Skip empty
                    return;
                }
                if ('type' in transformer) {
                    if (typeof transformer.factory === 'function') {
                        // Allow custom factories to grab the extra information required
                        program = program || builder.getProgram();
                        typeChecker = typeChecker || program.getTypeChecker();
                        let factory;
                        if (transformer.type === 'program') {
                            program = program || builder.getProgram();
                            factory = transformer.factory(program);
                        }
                        else {
                            program = program || builder.getProgram();
                            typeChecker = typeChecker || program.getTypeChecker();
                            factory = transformer.factory(typeChecker);
                        }
                        // Forward the requested reference to the custom transformer factory
                        if (factory) {
                            accumulator[stage].push(factory);
                        }
                    }
                }
                else {
                    // Add normal transformer factories as is
                    accumulator[stage].push(transformer);
                }
            });
        });
    });
    return accumulator;
}
function getTransformers(transformers) {
    return transformers || [];
}

const { DiagnosticCategory } = typescript$1;
// @see https://github.com/microsoft/TypeScript/blob/master/src/compiler/diagnosticMessages.json
// eslint-disable-next-line no-shadow
var DiagnosticCode;
(function (DiagnosticCode) {
    DiagnosticCode[DiagnosticCode["FILE_CHANGE_DETECTED"] = 6032] = "FILE_CHANGE_DETECTED";
    DiagnosticCode[DiagnosticCode["FOUND_1_ERROR_WATCHING_FOR_FILE_CHANGES"] = 6193] = "FOUND_1_ERROR_WATCHING_FOR_FILE_CHANGES";
    DiagnosticCode[DiagnosticCode["FOUND_N_ERRORS_WATCHING_FOR_FILE_CHANGES"] = 6194] = "FOUND_N_ERRORS_WATCHING_FOR_FILE_CHANGES";
})(DiagnosticCode || (DiagnosticCode = {}));
function createDeferred(timeout) {
    let promise;
    let resolve = () => { };
    if (timeout) {
        promise = Promise.race([
            new Promise((r) => setTimeout(r, timeout, true)),
            new Promise((r) => (resolve = r))
        ]);
    }
    else {
        promise = new Promise((r) => (resolve = r));
    }
    return { promise, resolve };
}
/**
 * Typescript watch program helper to sync Typescript watch status with Rollup hooks.
 */
class WatchProgramHelper {
    constructor() {
        this._startDeferred = null;
        this._finishDeferred = null;
    }
    watch(timeout = 1000) {
        // Race watcher start promise against a timeout in case Typescript and Rollup change detection is not in sync.
        this._startDeferred = createDeferred(timeout);
        this._finishDeferred = createDeferred();
    }
    handleStatus(diagnostic) {
        // Fullfil deferred promises by Typescript diagnostic message codes.
        if (diagnostic.category === DiagnosticCategory.Message) {
            switch (diagnostic.code) {
                case DiagnosticCode.FILE_CHANGE_DETECTED:
                    this.resolveStart();
                    break;
                case DiagnosticCode.FOUND_1_ERROR_WATCHING_FOR_FILE_CHANGES:
                case DiagnosticCode.FOUND_N_ERRORS_WATCHING_FOR_FILE_CHANGES:
                    this.resolveFinish();
                    break;
            }
        }
    }
    resolveStart() {
        if (this._startDeferred) {
            this._startDeferred.resolve(false);
            this._startDeferred = null;
        }
    }
    resolveFinish() {
        if (this._finishDeferred) {
            this._finishDeferred.resolve(false);
            this._finishDeferred = null;
        }
    }
    async wait() {
        var _a;
        if (this._startDeferred) {
            const timeout = await this._startDeferred.promise;
            // If there is no file change detected by Typescript skip deferred promises.
            if (timeout) {
                this._startDeferred = null;
                this._finishDeferred = null;
            }
            await ((_a = this._finishDeferred) === null || _a === void 0 ? void 0 : _a.promise);
        }
    }
}
/**
 * Create a language service host to use with the Typescript compiler & type checking APIs.
 * Typescript hosts are used to represent the user's system,
 * with an API for reading files, checking directories and case sensitivity etc.
 * @see https://github.com/Microsoft/TypeScript/wiki/Using-the-Compiler-API
 */
function createWatchHost(ts, context, { formatHost, parsedOptions, writeFile, status, resolveModule, transformers }) {
    const createProgram = ts.createEmitAndSemanticDiagnosticsBuilderProgram;
    const baseHost = ts.createWatchCompilerHost(parsedOptions.fileNames, parsedOptions.options, ts.sys, createProgram, buildDiagnosticReporter(ts, context, formatHost), status, parsedOptions.projectReferences);
    return {
        ...baseHost,
        /** Override the created program so an in-memory emit is used */
        afterProgramCreate(program) {
            const origEmit = program.emit;
            // eslint-disable-next-line no-param-reassign
            program.emit = (targetSourceFile, _, ...args) => origEmit(targetSourceFile, writeFile, 
            // cancellationToken
            args[0], 
            // emitOnlyDtsFiles
            args[1], mergeTransformers(program, transformers, args[2]));
            return baseHost.afterProgramCreate(program);
        },
        /** Add helper to deal with module resolution */
        resolveModuleNames(moduleNames, containingFile, _reusedNames, redirectedReference, _optionsOnlyWithNewerTsVersions, containingSourceFile) {
            return moduleNames.map((moduleName, i) => {
                var _a;
                const mode = containingSourceFile
                    ? (_a = ts.getModeForResolutionAtIndex) === null || _a === void 0 ? void 0 : _a.call(ts, containingSourceFile, i)
                    : undefined; // eslint-disable-line no-undefined
                return resolveModule(moduleName, containingFile, redirectedReference, mode);
            });
        }
    };
}
function createWatchProgram(ts, context, options) {
    return ts.createWatchProgram(createWatchHost(ts, context, options));
}

/** Creates the folders needed given a path to a file to be saved*/
const createFileFolder = (filePath) => {
    const folderPath = path__default.dirname(filePath);
    fs.mkdirSync(folderPath, { recursive: true });
};
class TSCache {
    constructor(cacheFolder = '.rollup.cache') {
        this._cacheFolder = cacheFolder;
    }
    /** Returns the path to the cached file */
    cachedFilename(fileName) {
        return path__default.join(this._cacheFolder, fileName.replace(/^([a-zA-Z]+):/, '$1'));
    }
    /** Emits a file in the cache folder */
    cacheCode(fileName, code) {
        const cachedPath = this.cachedFilename(fileName);
        createFileFolder(cachedPath);
        fs.writeFileSync(cachedPath, code);
    }
    /** Checks if a file is in the cache */
    isCached(fileName) {
        return fs.existsSync(this.cachedFilename(fileName));
    }
    /** Read a file from the cache given the output name*/
    getCached(fileName) {
        let code;
        if (this.isCached(fileName)) {
            code = fs.readFileSync(this.cachedFilename(fileName), { encoding: 'utf-8' });
        }
        return code;
    }
}

function typescript(options = {}) {
    const { cacheDir, compilerOptions, exclude, filterRoot, include, outputToFilesystem, noForceEmit, transformers, tsconfig, tslib, typescript: ts } = getPluginOptions(options);
    const tsCache = new TSCache(cacheDir);
    const emittedFiles = new Map();
    const watchProgramHelper = new WatchProgramHelper();
    const parsedOptions = parseTypescriptConfig(ts, tsconfig, compilerOptions, noForceEmit);
    const filter = createFilter(include || '{,**/}*.(cts|mts|ts|tsx)', exclude, {
        resolve: filterRoot !== null && filterRoot !== void 0 ? filterRoot : parsedOptions.options.rootDir
    });
    parsedOptions.fileNames = parsedOptions.fileNames.filter(filter);
    const formatHost = createFormattingHost(ts, parsedOptions.options);
    const resolveModule = createModuleResolver(ts, formatHost, filter);
    let program = null;
    return {
        name: 'typescript',
        buildStart(rollupOptions) {
            emitParsedOptionsErrors(ts, this, parsedOptions);
            preflight({
                config: parsedOptions,
                context: this,
                // TODO drop rollup@3 support and remove
                inputPreserveModules: rollupOptions
                    .preserveModules,
                tslib
            });
            // Fixes a memory leak https://github.com/rollup/plugins/issues/322
            if (this.meta.watchMode !== true) {
                // eslint-disable-next-line
                program === null || program === void 0 ? void 0 : program.close();
                program = null;
            }
            if (!program) {
                program = createWatchProgram(ts, this, {
                    formatHost,
                    resolveModule,
                    parsedOptions,
                    writeFile(fileName, data) {
                        if (parsedOptions.options.composite || parsedOptions.options.incremental) {
                            tsCache.cacheCode(fileName, data);
                        }
                        emittedFiles.set(fileName, data);
                    },
                    status(diagnostic) {
                        watchProgramHelper.handleStatus(diagnostic);
                    },
                    transformers
                });
            }
        },
        watchChange(id) {
            if (!filter(id))
                return;
            watchProgramHelper.watch();
        },
        buildEnd() {
            if (this.meta.watchMode !== true) {
                // ESLint doesn't understand optional chaining
                // eslint-disable-next-line
                program === null || program === void 0 ? void 0 : program.close();
            }
        },
        renderStart(outputOptions) {
            validateSourceMap(this, parsedOptions.options, outputOptions, parsedOptions.autoSetSourceMap);
            validatePaths(this, parsedOptions.options, outputOptions);
        },
        resolveId(importee, importer) {
            if (importee === 'tslib') {
                return tslib;
            }
            if (!importer)
                return null;
            // Convert path from windows separators to posix separators
            const containingFile = normalizePath(importer);
            // when using node16 or nodenext module resolution, we need to tell ts if
            // we are resolving to a commonjs or esnext module
            const mode = typeof ts.getImpliedNodeFormatForFile === 'function'
                ? ts.getImpliedNodeFormatForFile(
                // @ts-expect-error
                containingFile, undefined, // eslint-disable-line no-undefined
                { ...ts.sys, ...formatHost }, parsedOptions.options)
                : undefined; // eslint-disable-line no-undefined
            // eslint-disable-next-line no-undefined
            const resolved = resolveModule(importee, containingFile, undefined, mode);
            if (resolved) {
                if (/\.d\.[cm]?ts/.test(resolved.extension))
                    return null;
                if (!filter(resolved.resolvedFileName))
                    return null;
                return path.normalize(resolved.resolvedFileName);
            }
            return null;
        },
        async load(id) {
            if (!filter(id))
                return null;
            this.addWatchFile(id);
            await watchProgramHelper.wait();
            const fileName = normalizePath(id);
            if (!parsedOptions.fileNames.includes(fileName)) {
                // Discovered new file that was not known when originally parsing the TypeScript config
                parsedOptions.fileNames.push(fileName);
            }
            const output = findTypescriptOutput(ts, parsedOptions, id, emittedFiles, tsCache);
            return output.code != null ? output : null;
        },
        async generateBundle(outputOptions) {
            const declarationAndTypeScriptMapFiles = [...emittedFiles.keys()].filter((fileName) => isDeclarationOutputFile(fileName) || isTypeScriptMapOutputFile(fileName));
            declarationAndTypeScriptMapFiles.forEach((id) => {
                const code = getEmittedFile(id, emittedFiles, tsCache);
                if (!code || !parsedOptions.options.declaration) {
                    return;
                }
                let baseDir;
                if (outputOptions.dir) {
                    baseDir = outputOptions.dir;
                }
                else if (outputOptions.file) {
                    // find common path of output.file and configured declation output
                    const outputDir = path.dirname(outputOptions.file);
                    const configured = path.resolve(parsedOptions.options.declarationDir ||
                        parsedOptions.options.outDir ||
                        tsconfig ||
                        process.cwd());
                    const backwards = path
                        .relative(outputDir, configured)
                        .split(path.sep)
                        .filter((v) => v === '..')
                        .join(path.sep);
                    baseDir = path.normalize(`${outputDir}/${backwards}`);
                }
                if (!baseDir)
                    return;
                this.emitFile({
                    type: 'asset',
                    fileName: normalizePath(path.relative(baseDir, id)),
                    source: code
                });
            });
            const tsBuildInfoPath = ts.getTsBuildInfoEmitOutputFilePath(parsedOptions.options);
            if (tsBuildInfoPath) {
                const tsBuildInfoSource = emittedFiles.get(tsBuildInfoPath);
                // https://github.com/rollup/plugins/issues/681
                if (tsBuildInfoSource) {
                    await emitFile(outputOptions, outputToFilesystem, this, tsBuildInfoPath, tsBuildInfoSource);
                }
            }
        }
    };
}

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
var tsConfig = function (absolutePath, mode, type) {
    return typescript({
        cacheDir: resolve(absolutePath, ".cache"),
        tsconfig: resolve(absolutePath, "tsconfig.json"),
        sourceMap: true,
        declaration: type === "type" ? true : false,
        declarationMap: type === "type" ? true : false,
        declarationDir: type === "type" ? resolve(absolutePath, "dist/types") : null,
    });
};
var transformMultipleBuildConfig = function (options, packageFileObject, absolutePath, mode, configOption, hasSingle) {
    var _a, _b;
    var allOptions = {};
    var hasSetType = false;
    if (typeof options.input === "string" && !options.input.startsWith(absolutePath)) {
        options.input = resolve(absolutePath, options.input);
    }
    if (options.output) {
        options.output = Array.isArray(options.output) ? options.output : [options.output];
        var multipleOutput = options.output.filter(function (output) { return output.multiple; });
        var umdGlobalIgnore_1 = [];
        options.output = multipleOutput.map(function (output) {
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
            var currentTsConfig = tsConfig(absolutePath);
            if (!hasSingle && mode === "development" && !hasSetType) {
                hasSetType = true;
                currentTsConfig = tsConfig(absolutePath, mode, "type");
            }
            allOptions.multipleOther = __assign(__assign({}, options), { output: multipleOtherConfig, external: configOption.external || (function (id) { return id.includes("node_modules") && !id.includes("tslib"); }), plugins: [
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
                ] });
        }
        if (multipleUMDConfig.length) {
            var currentTsConfig = tsConfig(absolutePath);
            if (!hasSingle && mode === "development" && !hasSetType) {
                hasSetType = true;
                currentTsConfig = tsConfig(absolutePath, mode, "type");
            }
            allOptions.multipleUMD = __assign(__assign({}, options), { output: multipleUMDConfig, external: function (id) {
                    if (umdGlobalIgnore_1.some(function (name) { return id.endsWith(name); }))
                        return true;
                }, plugins: [
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
                ] });
        }
    }
    return allOptions;
};
var transformSingleBuildConfig = function (options, packageFileObject, absolutePath, configOption, hasSingle) {
    var allOptions = {};
    var hasSetType = false;
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
            var currentTsConfig = tsConfig(absolutePath);
            if (hasSingle && !hasSetType) {
                hasSetType = true;
                currentTsConfig = tsConfig(absolutePath, "process.env", "type");
            }
            allOptions.singleOther = __assign(__assign({}, options), { output: singleOther, external: configOption.external || (function (id) { return id.includes("node_modules") && !id.includes("tslib"); }), plugins: [
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
                ] });
        }
        if (singleUMD.length) {
            var currentTsConfig = tsConfig(absolutePath);
            if (hasSingle && !hasSetType) {
                hasSetType = true;
                currentTsConfig = tsConfig(absolutePath, "process.env", "type");
            }
            allOptions.singleUMD = __assign(__assign({}, options), { output: singleUMD, external: function (id) {
                    if (umdGlobalIgnore_2.some(function (name) { return id.endsWith(name); }))
                        return true;
                }, plugins: [
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
    var hasSingle = (Array.isArray(rollupConfig.output) ? rollupConfig.output : [rollupConfig.output]).some(function (i) { return !i.multiple; });
    var allMultipleRollupOptions = modes.map(function (mode) {
        return transformMultipleBuildConfig(cloneDeep(rollupConfig), packageFileObject, absolutePath, mode, options, hasSingle);
    });
    var allSingleRollupOptions = transformSingleBuildConfig(cloneDeep(rollupConfig), packageFileObject, absolutePath, options, hasSingle);
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
//# sourceMappingURL=index.js.map
