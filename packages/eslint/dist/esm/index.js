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

export { baseLint, reactLint };
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9iYXNlLnRzIiwiLi4vLi4vc3JjL3JlYWN0LnRzIl0sInNvdXJjZXNDb250ZW50IjpbbnVsbCxudWxsXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBRWEsSUFBQSxRQUFRLEdBQXNCO0FBQ3pDLElBQUEsTUFBTSxFQUFFLDJCQUEyQjtBQUNuQyxJQUFBLE9BQU8sRUFBRSxDQUFDLG9CQUFvQixFQUFFLFVBQVUsRUFBRSxRQUFRLENBQUM7SUFDckQsT0FBTyxFQUFFLENBQUMsb0JBQW9CLEVBQUUsdUNBQXVDLEVBQUUsMkJBQTJCLEVBQUUsMEJBQTBCLEVBQUUsVUFBVSxDQUFDO0FBQzdJLElBQUEsY0FBYyxFQUFFLENBQUMsTUFBTSxFQUFFLEtBQUssRUFBRSxjQUFjLEVBQUUsV0FBVyxFQUFFLFNBQVMsRUFBRSxVQUFVLENBQUM7QUFDbkYsSUFBQSxLQUFLLEVBQUU7QUFDTCxRQUFBLFdBQVcsRUFBRSxDQUFDLE9BQU8sRUFBRSxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsY0FBYyxFQUFFLElBQUksRUFBRSxDQUFDO0FBRTFELFFBQUEsMENBQTBDLEVBQUUsS0FBSztBQUVqRCxRQUFBLGtEQUFrRCxFQUFFLEtBQUs7QUFFekQsUUFBQSxtREFBbUQsRUFBRSxLQUFLO0FBRTFELFFBQUEsb0NBQW9DLEVBQUUsS0FBSztBQUUzQyxRQUFBLDRDQUE0QyxFQUFFLE9BQU87QUFFckQsUUFBQSxtQ0FBbUMsRUFBRTtZQUNuQyxPQUFPO0FBQ1AsWUFBQTtBQUNFLGdCQUFBLGlCQUFpQixFQUFFLElBQUk7QUFDdkIsZ0JBQUEsa0JBQWtCLEVBQUUsSUFBSTtBQUN4QixnQkFBQSw4QkFBOEIsRUFBRSxJQUFJO0FBQ3JDLGFBQUE7QUFDRixTQUFBO0FBRUQsUUFBQSxjQUFjLEVBQUUsT0FBTztBQUV2QixRQUFBLHNCQUFzQixFQUFFLE9BQU87QUFFL0IsUUFBQSxjQUFjLEVBQUU7WUFDZCxPQUFPO0FBQ1AsWUFBQTtBQUNFLGdCQUFBLE1BQU0sRUFBRSxDQUFDLENBQUMsU0FBUyxFQUFFLFVBQVUsQ0FBQyxFQUFFLFVBQVUsRUFBRSxRQUFRLEVBQUUsU0FBUyxFQUFFLE9BQU8sRUFBRSxNQUFNLENBQUM7QUFDbkYsZ0JBQUEsa0JBQWtCLEVBQUUsUUFBUTtnQkFDNUIsV0FBVyxFQUFFLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRSxlQUFlLEVBQUUsSUFBSSxFQUFFO0FBQ3JELGFBQUE7QUFDRixTQUFBO1FBRUQsNkJBQTZCLEVBQUUsQ0FBQyxPQUFPLEVBQUUsRUFBRSxLQUFLLEVBQUUsQ0FBQyxFQUFFLENBQUM7QUFFdEQsUUFBQSxpQ0FBaUMsRUFBRTtZQUNqQyxPQUFPO0FBQ1AsWUFBQTtBQUNFLGdCQUFBLGNBQWMsRUFBRSxJQUFJO0FBQ3JCLGFBQUE7QUFDRixTQUFBO0FBQ0YsS0FBQTtBQUNELElBQUEsUUFBUSxFQUFFO0FBQ1IsUUFBQSxnQkFBZ0IsRUFBRTtBQUNoQixZQUFBLDJCQUEyQixFQUFFLENBQUMsS0FBSyxFQUFFLE1BQU0sQ0FBQztBQUM3QyxTQUFBO0FBQ0QsUUFBQSxpQkFBaUIsRUFBRTtBQUNqQixZQUFBLFVBQVUsRUFBRTtBQUNWLGdCQUFBLGNBQWMsRUFBRSxJQUFJO0FBQ3JCLGFBQUE7QUFDRixTQUFBO0FBQ0YsS0FBQTs7O0FDMURVLElBQUEsU0FBUyxHQUFzQjtBQUMxQyxJQUFBLE1BQU0sRUFBRSwyQkFBMkI7QUFDbkMsSUFBQSxPQUFPLEVBQUU7QUFDUCxRQUFBLDBCQUEwQjtBQUMxQixRQUFBLGdDQUFnQztBQUNoQyxRQUFBLDZCQUE2QjtBQUM3QixRQUFBLDBCQUEwQjtBQUMzQixLQUFBO0FBQ0QsSUFBQSxhQUFhLEVBQUU7QUFDYixRQUFBLFlBQVksRUFBRTtBQUNaLFlBQUEsR0FBRyxFQUFFLElBQUk7QUFDVixTQUFBO0FBQ0YsS0FBQTtBQUNELElBQUEsT0FBTyxFQUFFLENBQUMsT0FBTyxFQUFFLGFBQWEsQ0FBQztBQUNqQyxJQUFBLFFBQVEsRUFBRTtBQUNSLFFBQUEsS0FBSyxFQUFFO0FBQ0wsWUFBQSxPQUFPLEVBQUUsUUFBUTtBQUNsQixTQUFBO0FBQ0QsUUFBQSxVQUFVLEVBQUUsUUFBUTtBQUNyQixLQUFBO0FBQ0QsSUFBQSxLQUFLLEVBQUU7O0FBRUwsUUFBQSxrQkFBa0IsRUFBRSxLQUFLOztBQUV6QixRQUFBLDBCQUEwQixFQUFFLEtBQUs7QUFDbEMsS0FBQTs7Ozs7In0=
