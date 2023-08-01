import { template } from "rollup-plugin-external";
import { defineConfig } from "rollup";
import ts from "@rollup/plugin-typescript";
export default defineConfig({
  input: "src/index.mts",
  output: [
    {
      file: "./dist/index.cjs",
      format: "cjs",
    },
    {
      file: "./dist/index.esm.mjs",
      format: "esm",
    },
  ],
  plugins: [ts(), template()],
});
