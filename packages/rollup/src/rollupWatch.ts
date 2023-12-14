import uniq from "lodash/uniq";
import { watch as rollup } from "rollup";

import { logger } from "./log";
import { getRollupConfigs } from "./rollupConfig";

import type { Type, Options } from "./type";
import type { RollupOptions, OutputOptions } from "rollup";

const watch = (packageName: string, rollupOptions: RollupOptions, mode: string, type: Type) => {
  rollupOptions.watch = {
    buildDelay: 100,
  };

  const watcher = rollup(rollupOptions);

  watcher.on("event", (event) => {
    if (event.code === "BUNDLE_START") {
      // look like rollup watch have a bug for some usage

      logger().info(`[watch] start build package '${packageName}' with '${mode}' mode in '${type}' format`);
    }
    if (event.code === "BUNDLE_END") {
      if (event.result) event.result.close();

      logger().info(`[watch] package '${packageName}' with '${mode}' mode in '${type}' format build success`);
    }
    if (event.code === "ERROR") {
      if (event.result) event.result.close();

      logger().error(`[watch] package '${packageName}' with '${mode}' mode in '${type}' format build failed \n ${event.error.stack}`);
    }
  });
};

export const rollupWatch = async (options: Options) => {
  const aliasName = options.alias || options.packageName;

  try {
    const { singleOther, singleDevUMD, multipleDevOther, multipleDevUMD } = await getRollupConfigs(options);

    const umdBuild = singleDevUMD.length ? singleDevUMD : multipleDevUMD;

    singleOther.forEach((config) => {
      const pkgName = config.pkgName;
      const name = pkgName ? aliasName + "/" + pkgName : aliasName;
      delete config.pkgName;
      watch(name, config as RollupOptions, "process.env", uniq((config.output as OutputOptions[]).map((v) => v.format)).join("&"));
    });

    multipleDevOther.forEach((config) => {
      const pkgName = config.pkgName;
      const name = pkgName ? aliasName + "/" + pkgName : aliasName;
      delete config.pkgName;
      watch(name, config as RollupOptions, "development", uniq((config.output as OutputOptions[]).map((v) => v.format)).join("&"));
    });

    umdBuild.forEach((config) => {
      const pkgName = config.pkgName;
      const name = pkgName ? aliasName + "/" + pkgName : aliasName;
      delete config.pkgName;
      watch(name, config as RollupOptions, "development", uniq((config.output as OutputOptions[]).map((v) => v.format)).join("&"));
    });
  } catch (e) {
    logger().error((e as Error)?.message);
    process.exit(1);
  }
};
