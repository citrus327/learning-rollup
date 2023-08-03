import { logPrefix } from "rollup-plugin-log-prefix";
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
  plugins: [
    logPrefix({
      prefix: "SIMPLE",
    }),
  ],
});
