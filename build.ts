import { rollupBuild } from "./packages/rollup/src";

// prepare package release
const start = async () => {
  await rollupBuild({ packageName: "axios", packageScope: "packages" });
  await rollupBuild({ packageName: "eslint", packageScope: "packages" });
  await rollupBuild({ packageName: "rollup", packageScope: "packages" });
  await rollupBuild({ packageName: "stylelint", packageScope: "packages" });
};

start();
