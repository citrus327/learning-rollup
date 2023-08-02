import { external } from "rollup-plugin-external";
import { defineConfig } from "rollup";
import ts from "@rollup/plugin-typescript";
import nodeResolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";

export default defineConfig({
  input: "src/index.ts",
  external: "jquery",
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
  plugins: [
    commonjs(),
    nodeResolve(),
    ts(),
    external({
      includeDeps: false,
    }),
  ],
});
