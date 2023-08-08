import { defineConfig } from "rollup";
import nodeResolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import { lifeCycle } from "rollup-plugin-life-cycle";
export default defineConfig({
  input: "src/index.mjs",
  output: [
    {
      // file: "./dist/cjs/index.cjs",
      dir: "./dist/cjs",
      format: "cjs",
    },
    {
      // file: "./dist/esm/index.esm.mjs",
      dir: "./dist/esm",
      format: "esm",
    },
  ],
  plugins: [nodeResolve(), commonjs(), lifeCycle()],
});
