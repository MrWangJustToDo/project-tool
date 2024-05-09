import commonjs from "@rollup/plugin-commonjs";
import json from "@rollup/plugin-json";
import { nodeResolve } from "@rollup/plugin-node-resolve";
import replace from "@rollup/plugin-replace";
import terser from "@rollup/plugin-terser";
import typescript from "@rollup/plugin-typescript";
import fs from "fs";
import { readFile, access } from "fs/promises";
import cloneDeep from "lodash/cloneDeep";
import { resolve } from "path";

import { safeParse } from "./safeParse";

import type { Mode, CustomOutput, Options, RollupOptions, CustomExternalOptions } from "./type";
import type { ExternalOption } from "rollup";

const defaultBuildOptions: RollupOptions = {
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

const checkFileExist = (path: string) => {
  return access(path, fs.constants.F_OK)
    .then(() => true)
    .catch(() => false);
};

const tsConfig = (absolutePath: string, mode: Mode, type?: "type") => {
  return typescript({
    cacheDir: resolve(absolutePath, ".cache"),
    tsconfig: resolve(absolutePath, "tsconfig.json"),
    sourceMap: true,
    declaration: type === "type" ? true : false,
    declarationMap: type === "type" ? true : false,
    declarationDir: type === "type" ? resolve(absolutePath, "dist/types") : null,
  });
};

const transformMultipleBuildConfig = (
  options: RollupOptions,
  packageFileObject: Record<string, any>,
  absolutePath: string,
  mode: Mode,
  configOption: Options
): {
  multipleOther?: RollupOptions;
  multipleUMD?: RollupOptions;
} => {
  const allOptions: {
    multipleOther?: RollupOptions;
    multipleUMD?: RollupOptions;
  } = {};

  if (typeof options.input === "string" && !options.input.startsWith(absolutePath)) {
    options.input = resolve(absolutePath, options.input);
  }
  if (options.output) {
    options.output = Array.isArray(options.output) ? options.output : [options.output];
    const CustomOutput = options.output.filter((output: CustomOutput) => output.multiple);

    const umdGlobalIgnore: string[] = [];

    options.output = CustomOutput.map((output: CustomOutput) => {
      if (output.dir && !output.dir.startsWith(absolutePath)) {
        output.dir = resolve(absolutePath, output.dir);
        if (configOption.multipleNameTransform) {
          output.entryFileNames = configOption.multipleNameTransform(output.entryFileNames as string, mode);
        } else {
          const typedEntryFileNames = output.entryFileNames as string;
          const lastIndexofDote = typedEntryFileNames.lastIndexOf(".");
          output.entryFileNames = `${typedEntryFileNames.slice(0, lastIndexofDote)}.${mode}${typedEntryFileNames.slice(lastIndexofDote)}`;
        }
        delete output.multiple;
      }
      if (output.file && !output.file.startsWith(absolutePath)) {
        output.file = resolve(absolutePath, output.file);
        if (configOption.multipleNameTransform) {
          output.file = configOption.multipleNameTransform(output.file, mode);
        } else {
          const typedEntryFileNames = output.file as string;
          const lastIndexofDote = typedEntryFileNames.lastIndexOf(".");
          output.file = `${typedEntryFileNames.slice(0, lastIndexofDote)}.${mode}${typedEntryFileNames.slice(lastIndexofDote)}`;
        }
        delete output.multiple;
      }
      return output;
    });

    const multipleOtherConfig = options.output.filter((output) => output.format !== "umd") as CustomOutput[];
    const multipleUMDConfig = options.output.filter((output) => output.format === "umd") as CustomOutput[];

    multipleUMDConfig.forEach((output) => {
      if (output.globals) {
        const allGlobal = Object.keys(output.globals);
        umdGlobalIgnore.push(...allGlobal);
      }
    });

    options.onwarn = (msg, warn) => {
      if (!/Circular/.test(msg.message)) {
        warn(msg);
      }
    };

    if (multipleOtherConfig.length) {
      let currentTsConfig = tsConfig(absolutePath, mode);
      if (mode === "development" && multipleOtherConfig.some((config) => config.type)) {
        currentTsConfig = tsConfig(absolutePath, mode, "type");
      }

      multipleOtherConfig.forEach((config) => delete config.type);

      const pluginsBuilder = mode === "development" ? configOption.plugins?.multipleDevOther : configOption.plugins?.multipleProdOther;
      const defaultPlugins = [
        nodeResolve(),
        commonjs({ exclude: "node_modules" }),
        replace(
          packageFileObject["name"] === "@project-tool/rollup"
            ? {}
            : {
                __DEV__: mode === "development",
                ["process.env.NODE_ENV"]: JSON.stringify(mode),
                __VERSION__: JSON.stringify(packageFileObject["version"] || "0.0.1"),
                preventAssignment: true,
              }
        ),
        currentTsConfig,
        json(),
      ];
      const plugins = pluginsBuilder
        ? pluginsBuilder({
            defaultPlugins,
            defaultPluginIndex: {
              nodeResolve: 0,
              commonjs: 1,
              replace: 2,
              typescript: 3,
              json: 4,
            },
            defaultPluginPackages: { commonjs, typescript, json, replace, terser, nodeResolve },
            defaultPluginProps: {
              options,
              packageFileObject,
              absolutePath,
              mode,
              configOption,
            },
          })
        : defaultPlugins;
      allOptions.multipleOther = {
        ...options,
        output: multipleOtherConfig,
        external:
          (typeof (configOption.external as CustomExternalOptions)?.generateExternal === "function"
            ? // eslint-disable-next-line @typescript-eslint/ban-ts-comment
              // @ts-ignore
              (configOption.external as CustomExternalOptions)?.generateExternal(mode === "development" ? "multipleDevOther" : "multipleProdOther")
            : (configOption.external as ExternalOption)) || ((id) => id.includes("node_modules") && !id.includes("tslib")),
        plugins: plugins,
      };
    }

    if (multipleUMDConfig.length) {
      let currentTsConfig = tsConfig(absolutePath, mode);

      if (mode === "development" && multipleUMDConfig.some((config) => config.type)) {
        currentTsConfig = tsConfig(absolutePath, mode, "type");
      }

      multipleUMDConfig.forEach((config) => delete config.type);

      const pluginsBuilder = mode === "development" ? configOption.plugins?.multipleDevUMD : configOption.plugins?.multipleProdUMD;
      const defaultPlugins = [
        nodeResolve(),
        commonjs({ exclude: "node_modules" }),
        replace(
          packageFileObject["name"] === "@project-tool/rollup"
            ? {}
            : {
                __DEV__: mode === "development",
                ["process.env.NODE_ENV"]: JSON.stringify(mode),
                __VERSION__: JSON.stringify(packageFileObject["version"] || "0.0.1"),
                preventAssignment: true,
              }
        ),
        currentTsConfig,
        json(),
        mode === "production" ? terser() : null,
      ];
      const plugins = pluginsBuilder
        ? pluginsBuilder({
            defaultPlugins,
            defaultPluginIndex: {
              nodeResolve: 0,
              commonjs: 1,
              replace: 2,
              typescript: 3,
              json: 4,
              terser: 5,
            },
            defaultPluginPackages: { commonjs, typescript, json, replace, terser, nodeResolve },
            defaultPluginProps: {
              options,
              packageFileObject,
              absolutePath,
              mode,
              configOption,
            },
          })
        : defaultPlugins;

      allOptions.multipleUMD = {
        ...options,
        output: multipleUMDConfig,
        external: (id) => {
          if (umdGlobalIgnore.some((name) => id.endsWith(name))) return true;
        },
        plugins: plugins,
      };
    }
  }

  return allOptions;
};

const transformSingleBuildConfig = (
  options: RollupOptions,
  packageFileObject: Record<string, any>,
  absolutePath: string,
  configOption: Options
): {
  singleOther?: RollupOptions;
  singleUMD?: RollupOptions;
} => {
  const allOptions: {
    singleOther?: RollupOptions;
    singleUMD?: RollupOptions;
  } = {};

  if (typeof options.input === "string" && !options.input.startsWith(absolutePath)) {
    options.input = resolve(absolutePath, options.input);
  }

  if (options.output) {
    options.output = Array.isArray(options.output) ? options.output : [options.output];
    const singleOutput = options.output.filter((output: CustomOutput) => !output.multiple);

    const umdGlobalIgnore: string[] = [];

    options.output = singleOutput.map((output) => {
      if (output.dir && !output.dir.startsWith(absolutePath)) {
        output.dir = resolve(absolutePath, output.dir);
      }
      if (output.file && !output.file.startsWith(absolutePath)) {
        output.file = resolve(absolutePath, output.file);
      }
      return output;
    });

    const singleOther = options.output.filter((output) => output.format !== "umd") as CustomOutput[];
    const singleUMD = options.output.filter((output) => output.format === "umd") as CustomOutput[];

    singleUMD.forEach((output) => {
      if (output.globals) {
        const allGlobal = Object.keys(output.globals);
        umdGlobalIgnore.push(...allGlobal);
      }
    });

    options.onwarn = (msg, warn) => {
      if (!/Circular/.test(msg.message)) {
        warn(msg);
      }
    };

    if (singleOther.length) {
      let currentTsConfig = tsConfig(absolutePath, "process.env");
      if (singleOther.some((config) => config.type)) {
        currentTsConfig = tsConfig(absolutePath, "process.env", "type");
      }

      singleOther.forEach((config) => delete config.type);

      const pluginsBuilder = configOption.plugins?.singleOther;
      const defaultPlugins = [
        nodeResolve(),
        commonjs({ exclude: "node_modules" }),
        replace(
          packageFileObject["name"] === "@project-tool/rollup"
            ? {}
            : {
                __DEV__: 'process.env.NODE_ENV === "development"',
                __VERSION__: JSON.stringify(packageFileObject["version"] || "0.0.1"),
                preventAssignment: true,
              }
        ),
        currentTsConfig,
        json(),
      ];
      const plugins = pluginsBuilder
        ? pluginsBuilder({
            defaultPlugins,
            defaultPluginIndex: {
              nodeResolve: 0,
              commonjs: 1,
              replace: 2,
              typescript: 3,
              json: 4,
            },
            defaultPluginPackages: { commonjs, typescript, json, replace, terser, nodeResolve },
            defaultPluginProps: {
              options,
              packageFileObject,
              absolutePath,
              mode: "process.env",
              configOption,
            },
          })
        : defaultPlugins;

      allOptions.singleOther = {
        ...options,
        output: singleOther,
        external:
          (typeof (configOption.external as CustomExternalOptions)?.generateExternal === "function"
            ? // eslint-disable-next-line @typescript-eslint/ban-ts-comment
              // @ts-ignore
              (configOption.external as CustomExternalOptions).generateExternal("singleOther")
            : (configOption.external as ExternalOption)) || ((id) => id.includes("node_modules") && !id.includes("tslib")),
        plugins: plugins,
      };
    }

    if (singleUMD.length) {
      let currentTsConfig = tsConfig(absolutePath, "process.env");
      if (singleUMD.some((config) => config.type)) {
        currentTsConfig = tsConfig(absolutePath, "process.env", "type");
      }

      const pluginsBuilder = configOption.plugins?.singleDevUMD;
      const defaultPlugins = [
        nodeResolve(),
        commonjs({ exclude: "node_modules" }),
        replace(
          packageFileObject["name"] === "@project-tool/rollup"
            ? {}
            : {
                __DEV__: JSON.stringify(true),
                __VERSION__: JSON.stringify(packageFileObject["version"] || "0.0.1"),
                preventAssignment: true,
              }
        ),
        currentTsConfig,
        json(),
      ];
      const plugins = pluginsBuilder
        ? pluginsBuilder({
            defaultPlugins,
            defaultPluginIndex: {
              nodeResolve: 0,
              commonjs: 1,
              replace: 2,
              typescript: 3,
              json: 4,
            },
            defaultPluginPackages: { commonjs, typescript, json, replace, terser, nodeResolve },
            defaultPluginProps: {
              options,
              packageFileObject,
              absolutePath,
              mode: "process.env",
              configOption,
            },
          })
        : defaultPlugins;

      allOptions.singleUMD = {
        ...options,
        output: singleUMD,
        external: (id) => {
          if (umdGlobalIgnore.some((name) => id.endsWith(name))) return true;
        },
        plugins: plugins,
      };
    }
  }

  return allOptions;
};

const flattenRollupConfig = (
  rollupConfig: RollupOptions,
  packageName: string,
  packageFileObject: Record<string, any>,
  absolutePath: string,
  options: Options
) => {
  const modes: Mode[] = ["development", "production"];

  if (!rollupConfig.input) {
    throw new Error(`current package "${packageName}" not have a input config`);
  }

  if (!rollupConfig.output) {
    throw new Error(`current package "${packageName}" not have a output config`);
  }

  const allMultipleRollupOptions = modes.map((mode) => transformMultipleBuildConfig(cloneDeep(rollupConfig), packageFileObject, absolutePath, mode, options));

  const allSingleRollupOptions = transformSingleBuildConfig(cloneDeep(rollupConfig), packageFileObject, absolutePath, options);

  const allDevBuild = allMultipleRollupOptions[0];

  const allProdBuild = allMultipleRollupOptions[1];

  const singleOther = allSingleRollupOptions["singleOther"];

  const singleDevUMD = allSingleRollupOptions["singleUMD"];

  const multipleDevOther = allDevBuild["multipleOther"];

  const multipleDevUMD = allDevBuild["multipleUMD"];

  const multipleProdOther = allProdBuild["multipleOther"];

  const multipleProdUMD = allProdBuild["multipleUMD"];

  return {
    singleOther,
    singleDevUMD,
    multipleDevOther,
    multipleDevUMD,
    multipleProdOther,
    multipleProdUMD,
  };
};

function filterFun<T>(t?: T): t is T {
  return t ? true : false;
}

export const getRollupConfigs = async (options: Options) => {
  const packageScope = options.packageScope;

  const packageName = options.packageName;

  const absolutePath = packageScope ? resolve(process.cwd(), packageScope, packageName) : resolve(process.cwd(), packageName);

  const packageFilePath = resolve(absolutePath, "package.json");

  const tsconfigFilePath = resolve(absolutePath, "tsconfig.json");

  const isPackageFileExist = await checkFileExist(packageFilePath);

  const isTsconfigFileExist = await checkFileExist(tsconfigFilePath);

  if (!isPackageFileExist) {
    throw new Error(`current package "${packageName}" not exist, absolutePath: ${packageFilePath}`);
  }

  if (!isTsconfigFileExist) {
    throw new Error(`current package "${packageName}" not have a "tsconfig.json", absolutePath: ${tsconfigFilePath}`);
  }

  const packageFileContent = await readFile(packageFilePath, {
    encoding: "utf-8",
  });

  const packageFileObject = safeParse(packageFileContent);

  let rollupConfig: RollupOptions[] = [
    {
      ...defaultBuildOptions,
    },
  ];

  if (packageFileObject["buildOptions"]) {
    const typedBuildOptions = packageFileObject["buildOptions"] as RollupOptions | RollupOptions[];
    rollupConfig = Array.isArray(typedBuildOptions) ? typedBuildOptions : [typedBuildOptions];
  }

  const all = rollupConfig.map((config) => flattenRollupConfig(config, packageName, packageFileObject, absolutePath, options));

  return {
    singleOther: all.map((i) => i.singleOther).filter(filterFun),
    singleDevUMD: all.map((i) => i.singleDevUMD).filter(filterFun),
    multipleDevOther: all.map((i) => i.multipleDevOther).filter(filterFun),
    multipleDevUMD: all.map((i) => i.multipleDevUMD).filter(filterFun),
    multipleProdOther: all.map((i) => i.multipleProdOther).filter(filterFun),
    multipleProdUMD: all.map((i) => i.multipleProdUMD).filter(filterFun),
  };
};
