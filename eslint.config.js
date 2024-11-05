import js from "@eslint/js";
import typescriptParser from "@typescript-eslint/parser";
import typescriptPlugin from "@typescript-eslint/eslint-plugin";
import chaiFriendlyPlugin from "eslint-plugin-chai-friendly";

export default [
  js.configs.recommended,
  {
    files: ["**/*.ts", "**/*.tsx"],
    languageOptions: {
      parser: typescriptParser,
      globals: {
        window: "readonly",
        document: "readonly",
        console: "readonly",
        module: "readonly",
        process: "readonly",
        __dirname: "readonly",
        require: "readonly",
        describe: "readonly",
        it: "readonly",
        before: "readonly",
        beforeEach: "readonly",
        after: "readonly",
        afterEach: "readonly",
      },
    },
    plugins: {
      "@typescript-eslint": typescriptPlugin,
      "chai-friendly": chaiFriendlyPlugin,
    },
    rules: {
      "@typescript-eslint/no-unused-expressions": "off",
      "chai-friendly/no-unused-expressions": "error",
      "no-unused-vars": "off",
    },
  },
  {
    files: ["**/*.test.ts", "**/*.spec.ts"],
    rules: {
      "@typescript-eslint/no-unused-expressions": "off",
    },
  },
];
