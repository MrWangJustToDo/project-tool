import { rollupBuild } from "./packages/rollup/src";

const start = async () => {
  await rollupBuild("axios", "packages");
  await rollupBuild("eslint", "packages");
  await rollupBuild("rollup", "packages");
  await rollupBuild("stylelint", "packages");
};

start();
