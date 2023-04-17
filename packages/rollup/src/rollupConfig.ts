import commonjs from "@rollup/plugin-commonjs";
import { nodeResolve } from "@rollup/plugin-node-resolve";
import replace from "@rollup/plugin-replace";
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

const tsConfig = (absolutePath: string, mode: Mode) => {
  return typescript({
    clean: true,
    tsconfig: resolve(absolutePath, "tsconfig.json"),
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

const transformBuildOptions = (
  options: RollupOptions,
  packageFileObject: Record<string, any>,
  absolutePath: string,
  mode: Mode,
  external?: RollupOptions["external"]
): {
  singleOther?: RollupOptions;
  singleUMD?: RollupOptions;
  multipleOther?: RollupOptions;
  multipleUMD?: RollupOptions;
} => {
  const allOptions: {
    singleOther?: RollupOptions;
    singleUMD?: RollupOptions;
    multipleOther?: RollupOptions;
    multipleUMD?: RollupOptions;
  } = {};
  if (typeof options.input === "string" && !options.input.startsWith(absolutePath)) {
    options.input = resolve(absolutePath, options.input);
  }
  if (options.output) {
    options.output = Array.isArray(options.output) ? options.output : [options.output];
    const singleConfig = options.output.filter((output: MultipleOutput) => !output.multiple);
    const singleOtherConfig = singleConfig.filter((output) => output.format !== "umd");
    const singleUMDConfig = singleConfig.filter((output) => output.format === "umd");
    const multipleConfig = options.output.filter((output: MultipleOutput) => output.multiple);
    const multipleOtherConfig = multipleConfig.filter((output) => output.format !== "umd");
    const multipleUMDConfig = multipleConfig.filter((output) => output.format === "umd");

    const umdGlobalIgnore: string[] = [];

    options.output = options.output.map((output: MultipleOutput) => {
      if (output.dir && !output.dir.startsWith(absolutePath)) {
        output.dir = resolve(absolutePath, output.dir);
        if (output.multiple) {
          const typedEntryFileNames = output.entryFileNames as string;
          const lastIndexofDote = typedEntryFileNames.lastIndexOf(".");
          output.entryFileNames = `${typedEntryFileNames.slice(0, lastIndexofDote)}.${mode}${typedEntryFileNames.slice(lastIndexofDote)}`;
          delete output.multiple;
        }
      }
      if (output.file && !output.file.startsWith(absolutePath)) {
        output.file = resolve(absolutePath, output.file);
        if (output.multiple) {
          const typedEntryFileNames = output.file as string;
          const lastIndexofDote = typedEntryFileNames.lastIndexOf(".");
          output.file = `${typedEntryFileNames.slice(0, lastIndexofDote)}.${mode}${typedEntryFileNames.slice(lastIndexofDote)}`;
          delete output.multiple;
        }
      }
      if (output.globals) {
        const allGlobal = Object.keys(output.globals);
        umdGlobalIgnore.push(...allGlobal);
      }
      return output;
    });

    options.onwarn = (msg, warn) => {
      if (!/Circular/.test(msg.message)) {
        warn(msg);
      }
    };

    if (singleOtherConfig.length) {
      allOptions.singleOther = {
        ...options,
        output: singleOtherConfig,
        external: external || ((id) => id.includes("node_modules")),
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
          tsConfig(absolutePath, mode),
        ],
      };
    }

    if (singleUMDConfig.length) {
      allOptions.singleUMD = {
        ...options,
        output: singleUMDConfig,
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
                  __DEV__: 'process.env.NODE_ENV === "development"',
                  __VERSION__: JSON.stringify(packageFileObject["version"] || "0.0.1"),
                  preventAssignment: true,
                }
          ),
          tsConfig(absolutePath, mode),
        ],
      };
    }

    if (multipleOtherConfig.length) {
      allOptions.multipleOther = {
        ...options,
        output: multipleOtherConfig,
        external: external || ((id) => id.includes("node_modules")),
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
          tsConfig(absolutePath, mode),
          // mode === "production" ? terser() : null,
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
                  __DEV__: 'process.env.NODE_ENV === "development"',
                  __VERSION__: JSON.stringify(packageFileObject["version"] || "0.0.1"),
                  preventAssignment: true,
                }
          ),
          tsConfig(absolutePath, mode),
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

  const allRollupOptions = modes.map((mode) => transformBuildOptions(cloneDeep(rollupConfig), packageFileObject, absolutePath, mode, options.external));

  const allDevBuild = allRollupOptions[0];

  const allProdBuild = allRollupOptions[1];

  // single build bundle base on current process env, so only need build once
  const singleOther = allDevBuild["singleOther"];

  const singleDevUMD = allDevBuild["singleUMD"];

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
