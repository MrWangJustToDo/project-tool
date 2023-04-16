'use strict';

var base = {
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

var react = {
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

var stylelint = {
    "extends": ["stylelint-config-standard", "stylelint-config-standard-scss"],
    plugins: ["stylelint-order", "stylelint-prettier", "stylelint-scss"],
    ignoreFiles: ["**/*.js", "**/*.ts", "**/*.jsx", "**/*.tsx", "**/*.json", "**/*.html"],
    rules: {
        // 颜色指定大写
        "color-hex-case": "upper",
        // 禁止空块
        "block-no-empty": true,
        // 颜色6位长度
        "color-hex-length": "long",
        // 兼容自定义标签名
        "selector-type-no-unknown": [
            true,
            {
                ignoreTypes: []
            },
        ],
        // 忽略伪类选择器 ::v-deep
        "selector-pseudo-element-no-unknown": [
            true,
            {
                ignorePseudoElements: ["v-deep"]
            },
        ],
        // 禁止低优先级的选择器出现在高优先级的选择器之后。
        "no-descending-specificity": null,
        // 不验证@未知的名字，为了兼容scss的函数
        "at-rule-no-unknown": null,
        // 禁止空注释
        "comment-no-empty": true,
        // 禁止简写属性的冗余值
        "shorthand-property-no-redundant-values": true,
        // 禁止值的浏览器引擎前缀
        "value-no-vendor-prefix": true,
        // property-no-vendor-prefix
        "property-no-vendor-prefix": true,
        // 禁止小于 1 的小数有一个前导零
        "number-leading-zero": "never",
        // 禁止空第一行
        "no-empty-first-line": true,
        "order/order": ["custom-properties", "declarations"],
        "order/properties-order": ["width", "height"]
    }
};

exports.base = base;
exports.react = react;
exports.stylelint = stylelint;
//# sourceMappingURL=lint.js.map
