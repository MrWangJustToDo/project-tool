import { rollup } from "rollup";

import { getRollupConfigs } from "./rollupConfig";

import type { Packages, Type } from "./type";
import type { OutputOptions, RollupOptions, RollupBuild } from "rollup";

const build = async (packageName: string, rollupOptions: RollupOptions, mode: string, type: Type) => {
  console.log(`[build] start build package '${packageName}' with ${mode} mode in ${type} format`);
  let bundle: RollupBuild | null = null;
  try {
    const { output, ...options } = rollupOptions;
    bundle = await rollup(options);
    await Promise.all((output as OutputOptions[]).map((output) => bundle?.write(output)));
  } catch (e) {
    console.error(`[build] build package '${packageName}' with ${mode} mode in ${type} format failed \n ${(e as Error).message}`);
    throw e;
  } finally {
    await bundle?.close();
  }
  console.log(`[build] build package '${packageName}' with ${mode} mode in ${type} format success`);
};

export async function rollupBuild(_packageName: { name: Packages; alias: string }, packageScope?: string): Promise<void>;
export async function rollupBuild(_packageName: Packages, packageScope?: string): Promise<void>;
export async function rollupBuild(_packageName: Packages | { name: Packages; alias: string }, packageScope?: string) {
  const packageName = typeof _packageName === "string" ? _packageName : _packageName.name;

  const aliasName = typeof _packageName === "string" ? _packageName : _packageName.alias;

  const { singleOther, singleDevUMD, multipleDevOther, multipleDevUMD, multipleProdOther, multipleProdUMD } = await getRollupConfigs(packageName, packageScope);

  const all: Array<() => void> = [];

  singleOther.map((config) => all.push(() => build(aliasName, config, "process.env", "cjs/esm")));

  singleDevUMD.map((config) => all.push(() => build(aliasName, config, "development", "umd")));

  multipleDevOther.map((config) => all.push(() => build(aliasName, config, "development", "cjs&esm")));

  multipleDevUMD.map((config) => all.push(() => build(aliasName, config, "development", "umd")));

  multipleProdOther.map((config) => all.push(() => build(aliasName, config, "production", "cjs&esm")));

  multipleProdUMD.map((config) => all.push(() => build(aliasName, config, "production", "umd")));

  await Promise.all(all.map((f) => f()));
}
