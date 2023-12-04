'use strict';

var baseLint = {
    parser: "@typescript-eslint/parser",
    plugins: ["@typescript-eslint", "prettier", "import"],
    extends: ["eslint:recommended", "plugin:@typescript-eslint/recommended", "plugin:import/recommended", "plugin:import/typescript", "prettier"],
    ignorePatterns: ["dist", "dev", "node_modules", "**/*.d.ts", "**/*.js", "**/*.jsx"],
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
};

var reactLint = {
    parser: "@typescript-eslint/parser",
    extends: [
        "plugin:react/recommended",
        "plugin:react-hooks/recommended",
        "plugin:jsx-a11y/recommended",
        "plugin:react/jsx-runtime", // new JSX runtime for react
    ],
    parserOptions: {
        ecmaFeatures: {
            jsx: true,
        },
    },
    plugins: ["react", "react-hooks"],
    settings: {
        react: {
            version: "detect",
        },
        sourceType: "module",
    },
    rules: {
        // We will use TypeScript's types for component props instead
        "react/prop-types": "off",
        // This rule is not compatible with Next.js's <Link /> components
        "jsx-a11y/anchor-is-valid": "off",
    },
};

exports.baseLint = baseLint;
exports.reactLint = reactLint;
//# sourceMappingURL=index.development.js.map
