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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguZGV2ZWxvcG1lbnQuanMiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9iYXNlLnRzIiwiLi4vLi4vc3JjL3JlYWN0LnRzIl0sInNvdXJjZXNDb250ZW50IjpbbnVsbCxudWxsXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFFYSxJQUFBLFFBQVEsR0FBc0I7QUFDekMsSUFBQSxNQUFNLEVBQUUsMkJBQTJCO0FBQ25DLElBQUEsT0FBTyxFQUFFLENBQUMsb0JBQW9CLEVBQUUsVUFBVSxFQUFFLFFBQVEsQ0FBQztJQUNyRCxPQUFPLEVBQUUsQ0FBQyxvQkFBb0IsRUFBRSx1Q0FBdUMsRUFBRSwyQkFBMkIsRUFBRSwwQkFBMEIsRUFBRSxVQUFVLENBQUM7QUFDN0ksSUFBQSxjQUFjLEVBQUUsQ0FBQyxNQUFNLEVBQUUsS0FBSyxFQUFFLGNBQWMsRUFBRSxXQUFXLEVBQUUsU0FBUyxFQUFFLFVBQVUsQ0FBQztBQUNuRixJQUFBLEtBQUssRUFBRTtBQUNMLFFBQUEsV0FBVyxFQUFFLENBQUMsT0FBTyxFQUFFLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxjQUFjLEVBQUUsSUFBSSxFQUFFLENBQUM7QUFFMUQsUUFBQSwwQ0FBMEMsRUFBRSxLQUFLO0FBRWpELFFBQUEsa0RBQWtELEVBQUUsS0FBSztBQUV6RCxRQUFBLG1EQUFtRCxFQUFFLEtBQUs7QUFFMUQsUUFBQSxvQ0FBb0MsRUFBRSxLQUFLO0FBRTNDLFFBQUEsNENBQTRDLEVBQUUsT0FBTztBQUVyRCxRQUFBLG1DQUFtQyxFQUFFO1lBQ25DLE9BQU87QUFDUCxZQUFBO0FBQ0UsZ0JBQUEsaUJBQWlCLEVBQUUsSUFBSTtBQUN2QixnQkFBQSxrQkFBa0IsRUFBRSxJQUFJO0FBQ3hCLGdCQUFBLDhCQUE4QixFQUFFLElBQUk7QUFDckMsYUFBQTtBQUNGLFNBQUE7QUFFRCxRQUFBLGNBQWMsRUFBRSxPQUFPO0FBRXZCLFFBQUEsc0JBQXNCLEVBQUUsT0FBTztBQUUvQixRQUFBLGNBQWMsRUFBRTtZQUNkLE9BQU87QUFDUCxZQUFBO0FBQ0UsZ0JBQUEsTUFBTSxFQUFFLENBQUMsQ0FBQyxTQUFTLEVBQUUsVUFBVSxDQUFDLEVBQUUsVUFBVSxFQUFFLFFBQVEsRUFBRSxTQUFTLEVBQUUsT0FBTyxFQUFFLE1BQU0sQ0FBQztBQUNuRixnQkFBQSxrQkFBa0IsRUFBRSxRQUFRO2dCQUM1QixXQUFXLEVBQUUsRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFLGVBQWUsRUFBRSxJQUFJLEVBQUU7QUFDckQsYUFBQTtBQUNGLFNBQUE7UUFFRCw2QkFBNkIsRUFBRSxDQUFDLE9BQU8sRUFBRSxFQUFFLEtBQUssRUFBRSxDQUFDLEVBQUUsQ0FBQztBQUV0RCxRQUFBLGlDQUFpQyxFQUFFO1lBQ2pDLE9BQU87QUFDUCxZQUFBO0FBQ0UsZ0JBQUEsY0FBYyxFQUFFLElBQUk7QUFDckIsYUFBQTtBQUNGLFNBQUE7QUFDRixLQUFBO0FBQ0QsSUFBQSxRQUFRLEVBQUU7QUFDUixRQUFBLGdCQUFnQixFQUFFO0FBQ2hCLFlBQUEsMkJBQTJCLEVBQUUsQ0FBQyxLQUFLLEVBQUUsTUFBTSxDQUFDO0FBQzdDLFNBQUE7QUFDRCxRQUFBLGlCQUFpQixFQUFFO0FBQ2pCLFlBQUEsVUFBVSxFQUFFO0FBQ1YsZ0JBQUEsY0FBYyxFQUFFLElBQUk7QUFDckIsYUFBQTtBQUNGLFNBQUE7QUFDRixLQUFBOzs7QUMxRFUsSUFBQSxTQUFTLEdBQXNCO0FBQzFDLElBQUEsTUFBTSxFQUFFLDJCQUEyQjtBQUNuQyxJQUFBLE9BQU8sRUFBRTtBQUNQLFFBQUEsMEJBQTBCO0FBQzFCLFFBQUEsZ0NBQWdDO0FBQ2hDLFFBQUEsNkJBQTZCO0FBQzdCLFFBQUEsMEJBQTBCO0FBQzNCLEtBQUE7QUFDRCxJQUFBLGFBQWEsRUFBRTtBQUNiLFFBQUEsWUFBWSxFQUFFO0FBQ1osWUFBQSxHQUFHLEVBQUUsSUFBSTtBQUNWLFNBQUE7QUFDRixLQUFBO0FBQ0QsSUFBQSxPQUFPLEVBQUUsQ0FBQyxPQUFPLEVBQUUsYUFBYSxDQUFDO0FBQ2pDLElBQUEsUUFBUSxFQUFFO0FBQ1IsUUFBQSxLQUFLLEVBQUU7QUFDTCxZQUFBLE9BQU8sRUFBRSxRQUFRO0FBQ2xCLFNBQUE7QUFDRCxRQUFBLFVBQVUsRUFBRSxRQUFRO0FBQ3JCLEtBQUE7QUFDRCxJQUFBLEtBQUssRUFBRTs7QUFFTCxRQUFBLGtCQUFrQixFQUFFLEtBQUs7O0FBRXpCLFFBQUEsMEJBQTBCLEVBQUUsS0FBSztBQUNsQyxLQUFBOzs7Ozs7In0=
