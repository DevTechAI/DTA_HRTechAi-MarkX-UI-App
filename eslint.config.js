import { FlatCompat } from "@eslint/eslintrc";
import { dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    rules: {
      "@typescript-eslint/no-unused-vars": [
        "warn",
        { argsIgnorePattern: "^_" },
      ],
      "@typescript-eslint/no-explicit-any": "warn",
      // Disable the problematic Next.js rule that's causing issues
      "@next/next/no-assign-module-variable": "off",
      // Additional rules to handle common MarkX HR portal patterns
      "react-hooks/exhaustive-deps": "warn",
      "no-console": "warn",
    },
  },
  {
    // Ignore files that commonly have module assignments and build files
    ignores: [
      "node_modules/**",
      ".next/**",
      "dist/**",
      "build/**",
      "out/**",
      "*.config.js",
      "*.config.mjs",
      "*.config.ts",
      "next.config.js",
      "tailwind.config.js",
      "postcss.config.js",
      "**/*.d.ts",
      ".env*",
      "*.log",
    ],
  },
];

export default eslintConfig;
