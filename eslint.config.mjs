import js from "@eslint/js"
import pluginNext from "@next/eslint-plugin-next"
import eslintConfigPrettier from "eslint-config-prettier"
import pluginReact from "eslint-plugin-react"
import pluginReactHooks from "eslint-plugin-react-hooks"
import pluginImport from "eslint-plugin-import"
import pluginBoundaries from "eslint-plugin-boundaries"
import pluginJsxA11y from "eslint-plugin-jsx-a11y"
import globals from "globals"
import tseslint from "typescript-eslint"

/**
 * ESLint configuration for Next.js project with FSD architecture
 *
 * @type {import("eslint").Linter.Config}
 * */
const eslintConfig = [
  js.configs.recommended,
  eslintConfigPrettier,
  ...tseslint.configs.recommended,
  {
    ...pluginReact.configs.flat.recommended,
    languageOptions: {
      ...pluginReact.configs.flat.recommended.languageOptions,
      globals: {
        ...globals.serviceworker,
      },
    },
  },
  {
    plugins: {
      "@next/next": pluginNext,
    },
    rules: {
      ...pluginNext.configs.recommended.rules,
      ...pluginNext.configs["core-web-vitals"].rules,
    },
  },
  {
    plugins: {
      "jsx-a11y": pluginJsxA11y,
    },
    rules: {
      ...pluginJsxA11y.flatConfigs.recommended.rules,
    },
  },
  {
    plugins: {
      "react-hooks": pluginReactHooks,
    },
    settings: {
      react: { version: "detect" },
      "import/resolver": {
        typescript: {
          alwaysTryTypes: true,
        },
      },
    },
    rules: {
      ...pluginReactHooks.configs.recommended.rules,
      // React scope no longer necessary with new JSX transform.
      "react/react-in-jsx-scope": "off",
      "react/prop-types": "off",
    },
  },
  {
    plugins: {
      import: pluginImport,
      boundaries: pluginBoundaries,
    },
    settings: {
      "boundaries/elements": [
        { type: "app", pattern: "src/app" },
        { type: "pages", pattern: "src/pages/*", capture: ["page"] },
        { type: "widgets", pattern: "src/widgets/*", capture: ["widget"] },
        { type: "features", pattern: "src/features/*", capture: ["feature"] },
        { type: "entities", pattern: "src/entities/*", capture: ["entity"] },
        { type: "shared", pattern: "src/shared/*", capture: ["segment"] },
      ],
    },
    rules: {
      "import/order": [
        "error",
        {
          groups: [
            "builtin",
            "external",
            "internal",
            "parent",
            "sibling",
            "index",
          ],
          pathGroups: [
            {
              pattern: "{@/,~/}pages/**",
              group: "internal",
              position: "after",
            },
            {
              pattern: "{@/,~/}widgets/**",
              group: "internal",
              position: "after",
            },
            {
              pattern: "{@/,~/}features/**",
              group: "internal",
              position: "after",
            },
            {
              pattern: "{@/,~/}entities/**",
              group: "internal",
              position: "after",
            },
            {
              pattern: "{@/,~/}shared/**",
              group: "internal",
              position: "after",
            },
          ],
          pathGroupsExcludedImportTypes: ["builtin"],
        },
      ],
      "import/no-internal-modules": "off",
      "boundaries/element-types": [
        "error",
        {
          default: "disallow",
          rules: [
            { from: "app", allow: ["app", "pages", "widgets", "features", "entities", "shared"] },
            { from: "pages", allow: ["widgets", "features", "entities", "shared"] },
            { from: "widgets", allow: ["features", "entities", "shared"] },
            { from: "features", allow: ["entities", "shared"] },
            { from: "entities", allow: ["shared"] },
            { from: "shared", allow: ["shared"] },
          ],
        },
      ],
    },
  },
  {
    rules: {
      "linebreak-style": [
        "error",
        "unix"
      ],
      "no-tabs": [
        "error"
      ],
      "semi": [
        "error",
        "never"
      ],
      "quotes": [
        "error",
        "double"
      ],
      "eol-last": [
        "error",
        "always",
      ],
      // Allow any type
      "@typescript-eslint/no-explicit-any": "off",
    },
  },
  {
    ignores: [
      ".next/**",
      "out/**",
      "build/**",
      "next-env.d.ts",
    ],
  },
]

export default eslintConfig
