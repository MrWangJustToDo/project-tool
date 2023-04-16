'use strict';

var reactLint = {
    parser: "@typescript-eslint/parser",
    "extends": [
        "plugin:react/recommended",
        "plugin:react-hooks/recommended",
        "plugin:jsx-a11y/recommended",
        "plugin:react/jsx-runtime", // new JSX runtime for react
    ],
    parserOptions: {
        ecmaFeatures: {
            jsx: true
        }
    },
    plugins: ["react", "react-hooks"],
    settings: {
        react: {
            version: "detect"
        },
        sourceType: "module"
    },
    rules: {
        // We will use TypeScript's types for component props instead
        "react/prop-types": "off",
        // This rule is not compatible with Next.js's <Link /> components
        "jsx-a11y/anchor-is-valid": "off"
    }
};

module.exports = reactLint;
//# sourceMappingURL=react.js.map
