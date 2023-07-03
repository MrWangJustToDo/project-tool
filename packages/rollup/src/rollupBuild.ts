import { rollup } from "rollup";

import { logger } from "./log";
import { getRollupConfigs } from "./rollupConfig";

import type { Options, Type } from "./type";
import type { OutputOptions, RollupOptions, RollupBuild } from "rollup";

const build = async (packageName: string, rollupOptions: RollupOptions, mode: string, type: Type) => {
  logger().info(`[build] start build package '${packageName}' with '${mode}' mode in '${type}' format`);
  let bundle: RollupBuild | null = null;
  try {
    const { output, ...options } = rollupOptions;
    bundle = await rollup(options);
    await Promise.all((output as OutputOptions[]).map((output) => bundle?.write(output)));
  } catch (e) {
    logger().error(`[build] build package '${packageName}' with '${mode}' mode in '${type}' format failed \n ${(e as Error).message}`);
    process.exit(1);
  } finally {
    await bundle?.close();
  }
  logger().info(`[build] build package '${packageName}' with '${mode}' mode in '${type}' format success`);
};

export const rollupBuild = async (options: Options) => {
  const aliasName = options.alias || options.packageName;

  const { singleOther, singleDevUMD, multipleDevOther, multipleDevUMD, multipleProdOther, multipleProdUMD, type } = await getRollupConfigs(options);

  const all: Array<() => void> = [];

  type.map((config) => all.push(() => build(aliasName, config, "type", "type")));

  singleOther.map((config) => all.push(() => build(aliasName, config, "process.env", (config.output as OutputOptions[]).map((v) => v.format).join("&"))));

  singleDevUMD.map((config) => all.push(() => build(aliasName, config, "development", (config.output as OutputOptions[]).map((v) => v.format).join("&"))));

  multipleDevOther.map((config) => all.push(() => build(aliasName, config, "development", (config.output as OutputOptions[]).map((v) => v.format).join("&"))));

  multipleDevUMD.map((config) => all.push(() => build(aliasName, config, "development", (config.output as OutputOptions[]).map((v) => v.format).join("&"))));

  multipleProdOther.map((config) => all.push(() => build(aliasName, config, "production", (config.output as OutputOptions[]).map((v) => v.format).join("&"))));

  multipleProdUMD.map((config) => all.push(() => build(aliasName, config, "production", (config.output as OutputOptions[]).map((v) => v.format).join("&"))));

  await Promise.all(all.map((f) => f()));
};
