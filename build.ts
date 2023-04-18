import { rollupBuild } from "./packages/rollup/src";

const start = async () => {
  await rollupBuild({ packageName: "axios", packageScope: "packages" });
  await rollupBuild({ packageName: "eslint", packageScope: "packages" });
  await rollupBuild({ packageName: "rollup", packageScope: "packages" });
  await rollupBuild({ packageName: "stylelint", packageScope: "packages" });
  await rollupBuild({ packageName: "webpack", packageScope: "packages" });
};

start();
