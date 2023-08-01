import { template } from "rollup-plugin-external";
import { defineConfig } from "rollup";
export default defineConfig({
  input: "src/index.mjs",
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
  plugins: [template()],
});
