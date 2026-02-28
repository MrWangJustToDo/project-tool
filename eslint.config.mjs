import { baseLint } from "@project-tool/eslint/index.js";

export default [
  ...baseLint,

  // Override max-lines for the root project
  {
    rules: {
      "max-lines": ["error", { max: 500, skipBlankLines: true }],
    },
  },
];
