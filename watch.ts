import { rollupWatch } from "./packages/rollup/src";

const start = () => {
  rollupWatch({ packageName: "axios", packageScope: "packages" });
  rollupWatch({ packageName: "eslint", packageScope: "packages" });
  rollupWatch({ packageName: "rollup", packageScope: "packages" });
  rollupWatch({ packageName: "stylelint", packageScope: "packages" });
};

start();
