import eslint from "@eslint/js";
import eslintConfigPrettier from "eslint-config-prettier";
import eslintPluginImport from "eslint-plugin-import";
import eslintPluginPrettier from "eslint-plugin-prettier";
import tseslint from "typescript-eslint";

import type { Linter } from "eslint";

export const baseLint: Linter.Config[] = [
  // Global ignores (replaces ignorePatterns)
  {
    ignores: ["**/dist/**", "**/dev/**", "**/node_modules/**", "**/*.d.ts", "**/*.js", "**/*.jsx"],
  },

  // ESLint recommended
  eslint.configs.recommended,

  // TypeScript-ESLint recommended
  ...tseslint.configs.recommended,

  // Import plugin recommended + typescript
  eslintPluginImport.flatConfigs.recommended,
  eslintPluginImport.flatConfigs.typescript,

  // Prettier (must be last among "extends"-style configs)
  eslintConfigPrettier,

  // Custom rules & settings
  {
    plugins: {
      prettier: eslintPluginPrettier,
    },
    rules: {
      "max-lines": ["error", { max: 400, skipBlankLines: true }],

      "@typescript-eslint/interface-name-prefix": "off",

      "@typescript-eslint/explicit-function-return-type": "off",

      "@typescript-eslint/explicit-module-boundary-types": "off",

      "@typescript-eslint/no-explicit-any": "off",

      "@typescript-eslint/consistent-type-imports": "error",

      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          argsIgnorePattern: "^_",
          ignoreRestSiblings: true,
          destructuredArrayIgnorePattern: "^_",
        },
      ],

      "import/first": "error",

      "import/no-duplicates": "error",

      "import/order": [
        "error",
        {
          groups: [["builtin", "external"], "internal", "parent", "sibling", "index", "type"],
          "newlines-between": "always",
          alphabetize: { order: "asc", caseInsensitive: true },
        },
      ],

      "import/newline-after-import": ["error", { count: 1 }],

      "import/no-useless-path-segments": [
        "error",
        {
          noUselessIndex: true,
        },
      ],

      "prettier/prettier": "error",
    },
    settings: {
      "import/parsers": {
        "@typescript-eslint/parser": [".ts", ".tsx"],
      },
      "import/resolver": {
        typescript: {
          alwaysTryTypes: true,
        },
      },
    },
  },
];
