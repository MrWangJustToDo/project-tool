import commonjs from "@rollup/plugin-commonjs";
import { nodeResolve } from "@rollup/plugin-node-resolve";
import replace from "@rollup/plugin-replace";
import terser from "@rollup/plugin-terser";
import fs from "fs";
import { readFile, access } from "fs/promises";
import cloneDeep from "lodash/cloneDeep";
import { resolve } from "path";
import typescript from "rollup-plugin-typescript2";

import { safeParse } from "./safeParse";

import type { Mode, MultipleOutput, Options } from "./type";
import type { RollupOptions } from "rollup";

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
    clean: true,
    tsconfig: resolve(absolutePath, "tsconfig.json"),
    useTsconfigDeclarationDir: type === "type" ? true : false,
    tsconfigOverride: {
      compilerOptions: {
        composite: type === "type" ? true : false,
        sourceMap: (mode === "process.env" || mode === "development") && type !== "type" ? true : false,
        declaration: type === "type" ? true : false,
        noEmit: type === "type",
        declarationDir: type === "type" ? "dist/types" : null,
      },
    },
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
    const multipleOutput = options.output.filter((output: MultipleOutput) => output.multiple);

    const umdGlobalIgnore: string[] = [];

    options.output = multipleOutput.map((output: MultipleOutput) => {
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

    const multipleOtherConfig = options.output.filter((output) => output.format !== "umd");
    const multipleUMDConfig = options.output.filter((output) => output.format === "umd");

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
      allOptions.multipleOther = {
        ...options,
        output: multipleOtherConfig,
        external: configOption.external || ((id) => id.includes("node_modules")),
        plugins: [
          nodeResolve(),
          commonjs({ exclude: "node_modules" }),
          replace(
            packageFileObject["name"] === "@project-tool/rollup"
              ? {}
              : {
                  __DEV__: mode === "development",
                  __VERSION__: JSON.stringify(packageFileObject["version"] || "0.0.1"),
                  preventAssignment: true,
                }
          ),
          tsConfig(absolutePath, mode),
        ],
      };
    }

    if (multipleUMDConfig.length) {
      allOptions.multipleUMD = {
        ...options,
        output: multipleUMDConfig,
        external: (id) => {
          if (umdGlobalIgnore.some((name) => id.endsWith(name))) return true;
        },
        plugins: [
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
          tsConfig(absolutePath, mode),
          mode === "production" ? terser() : null,
        ],
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
  type?: RollupOptions;
  singleOther?: RollupOptions;
  singleUMD?: RollupOptions;
} => {
  const allOptions: {
    type?: RollupOptions;
    singleOther?: RollupOptions;
    singleUMD?: RollupOptions;
  } = {};

  if (typeof options.input === "string" && !options.input.startsWith(absolutePath)) {
    options.input = resolve(absolutePath, options.input);
  }

  if (options.output) {
    options.output = Array.isArray(options.output) ? options.output : [options.output];
    const singleOutput = options.output.filter((output: MultipleOutput) => !output.multiple);

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

    const singleOther = options.output.filter((output) => output.format !== "umd");
    const singleUMD = options.output.filter((output) => output.format === "umd");

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

    allOptions.type = {
      ...options,
      output: singleOther,
      external: configOption.external || ((id) => id.includes("node_modules")),
      plugins: [
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
        tsConfig(absolutePath, "process.env", "type"),
      ],
    };

    if (singleOther.length) {
      allOptions.singleOther = {
        ...options,
        output: singleOther,
        external: configOption.external || ((id) => id.includes("node_modules")),
        plugins: [
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
          tsConfig(absolutePath, "process.env"),
        ],
      };
    }

    if (singleUMD.length) {
      allOptions.singleUMD = {
        ...options,
        output: singleUMD,
        external: (id) => {
          if (umdGlobalIgnore.some((name) => id.endsWith(name))) return true;
        },
        plugins: [
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
          tsConfig(absolutePath, "process.env"),
        ],
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

  const type = allSingleRollupOptions["type"];

  const singleOther = allSingleRollupOptions["singleOther"];

  const singleDevUMD = allSingleRollupOptions["singleUMD"];

  const multipleDevOther = allDevBuild["multipleOther"];

  const multipleDevUMD = allDevBuild["multipleUMD"];

  const multipleProdOther = allProdBuild["multipleOther"];

  const multipleProdUMD = allProdBuild["multipleUMD"];

  return {
    type,
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
    type: all.map((i) => i.type).filter(filterFun),
    singleOther: all.map((i) => i.singleOther).filter(filterFun),
    singleDevUMD: all.map((i) => i.singleDevUMD).filter(filterFun),
    multipleDevOther: all.map((i) => i.multipleDevOther).filter(filterFun),
    multipleDevUMD: all.map((i) => i.multipleDevUMD).filter(filterFun),
    multipleProdOther: all.map((i) => i.multipleProdOther).filter(filterFun),
    multipleProdUMD: all.map((i) => i.multipleProdUMD).filter(filterFun),
  };
};
