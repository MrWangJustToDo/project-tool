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
        "plugin:react/recommended", // React rules
        "plugin:react-hooks/recommended", // React hooks rules
        "plugin:jsx-a11y/recommended", // Accessibility rules
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXgucHJvZHVjdGlvbi5qcyIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL2Jhc2UudHMiLCIuLi8uLi9zcmMvcmVhY3QudHMiXSwic291cmNlc0NvbnRlbnQiOltudWxsLG51bGxdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUVhLElBQUEsUUFBUSxHQUFzQjtBQUN6QyxJQUFBLE1BQU0sRUFBRSwyQkFBMkI7QUFDbkMsSUFBQSxPQUFPLEVBQUUsQ0FBQyxvQkFBb0IsRUFBRSxVQUFVLEVBQUUsUUFBUSxDQUFDO0lBQ3JELE9BQU8sRUFBRSxDQUFDLG9CQUFvQixFQUFFLHVDQUF1QyxFQUFFLDJCQUEyQixFQUFFLDBCQUEwQixFQUFFLFVBQVUsQ0FBQztBQUM3SSxJQUFBLGNBQWMsRUFBRSxDQUFDLE1BQU0sRUFBRSxLQUFLLEVBQUUsY0FBYyxFQUFFLFdBQVcsRUFBRSxTQUFTLEVBQUUsVUFBVSxDQUFDO0FBQ25GLElBQUEsS0FBSyxFQUFFO0FBQ0wsUUFBQSxXQUFXLEVBQUUsQ0FBQyxPQUFPLEVBQUUsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLGNBQWMsRUFBRSxJQUFJLEVBQUUsQ0FBQztBQUUxRCxRQUFBLDBDQUEwQyxFQUFFLEtBQUs7QUFFakQsUUFBQSxrREFBa0QsRUFBRSxLQUFLO0FBRXpELFFBQUEsbURBQW1ELEVBQUUsS0FBSztBQUUxRCxRQUFBLG9DQUFvQyxFQUFFLEtBQUs7QUFFM0MsUUFBQSw0Q0FBNEMsRUFBRSxPQUFPO0FBRXJELFFBQUEsbUNBQW1DLEVBQUU7WUFDbkMsT0FBTztBQUNQLFlBQUE7QUFDRSxnQkFBQSxpQkFBaUIsRUFBRSxJQUFJO0FBQ3ZCLGdCQUFBLGtCQUFrQixFQUFFLElBQUk7QUFDeEIsZ0JBQUEsOEJBQThCLEVBQUUsSUFBSTtBQUNyQyxhQUFBO0FBQ0YsU0FBQTtBQUVELFFBQUEsY0FBYyxFQUFFLE9BQU87QUFFdkIsUUFBQSxzQkFBc0IsRUFBRSxPQUFPO0FBRS9CLFFBQUEsY0FBYyxFQUFFO1lBQ2QsT0FBTztBQUNQLFlBQUE7QUFDRSxnQkFBQSxNQUFNLEVBQUUsQ0FBQyxDQUFDLFNBQVMsRUFBRSxVQUFVLENBQUMsRUFBRSxVQUFVLEVBQUUsUUFBUSxFQUFFLFNBQVMsRUFBRSxPQUFPLEVBQUUsTUFBTSxDQUFDO0FBQ25GLGdCQUFBLGtCQUFrQixFQUFFLFFBQVE7Z0JBQzVCLFdBQVcsRUFBRSxFQUFFLEtBQUssRUFBRSxLQUFLLEVBQUUsZUFBZSxFQUFFLElBQUksRUFBRTtBQUNyRCxhQUFBO0FBQ0YsU0FBQTtRQUVELDZCQUE2QixFQUFFLENBQUMsT0FBTyxFQUFFLEVBQUUsS0FBSyxFQUFFLENBQUMsRUFBRSxDQUFDO0FBRXRELFFBQUEsaUNBQWlDLEVBQUU7WUFDakMsT0FBTztBQUNQLFlBQUE7QUFDRSxnQkFBQSxjQUFjLEVBQUUsSUFBSTtBQUNyQixhQUFBO0FBQ0YsU0FBQTtBQUNGLEtBQUE7QUFDRCxJQUFBLFFBQVEsRUFBRTtBQUNSLFFBQUEsZ0JBQWdCLEVBQUU7QUFDaEIsWUFBQSwyQkFBMkIsRUFBRSxDQUFDLEtBQUssRUFBRSxNQUFNLENBQUM7QUFDN0MsU0FBQTtBQUNELFFBQUEsaUJBQWlCLEVBQUU7QUFDakIsWUFBQSxVQUFVLEVBQUU7QUFDVixnQkFBQSxjQUFjLEVBQUUsSUFBSTtBQUNyQixhQUFBO0FBQ0YsU0FBQTtBQUNGLEtBQUE7OztBQzFEVSxJQUFBLFNBQVMsR0FBc0I7QUFDMUMsSUFBQSxNQUFNLEVBQUUsMkJBQTJCO0FBQ25DLElBQUEsT0FBTyxFQUFFO0FBQ1AsUUFBQSwwQkFBMEI7QUFDMUIsUUFBQSxnQ0FBZ0M7QUFDaEMsUUFBQSw2QkFBNkI7QUFDN0IsUUFBQSwwQkFBMEI7QUFDM0IsS0FBQTtBQUNELElBQUEsYUFBYSxFQUFFO0FBQ2IsUUFBQSxZQUFZLEVBQUU7QUFDWixZQUFBLEdBQUcsRUFBRSxJQUFJO0FBQ1YsU0FBQTtBQUNGLEtBQUE7QUFDRCxJQUFBLE9BQU8sRUFBRSxDQUFDLE9BQU8sRUFBRSxhQUFhLENBQUM7QUFDakMsSUFBQSxRQUFRLEVBQUU7QUFDUixRQUFBLEtBQUssRUFBRTtBQUNMLFlBQUEsT0FBTyxFQUFFLFFBQVE7QUFDbEIsU0FBQTtBQUNELFFBQUEsVUFBVSxFQUFFLFFBQVE7QUFDckIsS0FBQTtBQUNELElBQUEsS0FBSyxFQUFFOztBQUVMLFFBQUEsa0JBQWtCLEVBQUUsS0FBSzs7QUFFekIsUUFBQSwwQkFBMEIsRUFBRSxLQUFLO0FBQ2xDLEtBQUE7Ozs7OzsifQ==
