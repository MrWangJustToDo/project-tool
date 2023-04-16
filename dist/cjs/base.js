'use strict';

var baseLint = {
    parser: "@typescript-eslint/parser",
    plugins: ["@typescript-eslint", "prettier", "import"],
    "extends": ["eslint:recommended", "plugin:@typescript-eslint/recommended", "plugin:import/recommended", "plugin:import/typescript", "prettier"],
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
                destructuredArrayIgnorePattern: "^_"
            },
        ],
        "import/first": "error",
        "import/no-duplicates": "error",
        "import/order": [
            "error",
            {
                groups: [["builtin", "external"], "internal", "parent", "sibling", "index", "type"],
                "newlines-between": "always",
                alphabetize: { order: "asc", caseInsensitive: true }
            },
        ],
        "import/newline-after-import": ["error", { count: 1 }],
        "import/no-useless-path-segments": [
            "error",
            {
                noUselessIndex: true
            },
        ]
    },
    settings: {
        "import/parsers": {
            "@typescript-eslint/parser": [".ts", ".tsx"]
        },
        "import/resolver": {
            typescript: {
                alwaysTryTypes: true
            }
        }
    }
};

module.exports = baseLint;
//# sourceMappingURL=base.js.map
