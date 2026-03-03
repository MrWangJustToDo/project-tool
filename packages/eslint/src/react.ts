import eslintPluginJsxA11y from "eslint-plugin-jsx-a11y";
import eslintPluginReact from "eslint-plugin-react";
import eslintPluginReactHooks from "eslint-plugin-react-hooks";

import type { Linter } from "eslint";

export const reactLint: Linter.Config[] = [
  // React recommended (flat config)
  eslintPluginReact.configs.flat.recommended,

  // React JSX runtime (no need to import React in scope)
  eslintPluginReact.configs.flat["jsx-runtime"],

  // React hooks recommended (flat config)
  eslintPluginReactHooks.configs.flat["recommended-latest"],

  // JSX a11y recommended (flat config)
  eslintPluginJsxA11y.flatConfigs.recommended,

  // Custom overrides
  {
    settings: {
      react: {
        version: "detect",
      },
    },
    rules: {
      // We will use TypeScript's types for component props instead
      "react/prop-types": "off",
      // This rule is not compatible with Next.js's <Link /> components
      "jsx-a11y/anchor-is-valid": "off",
    },
  },
];
