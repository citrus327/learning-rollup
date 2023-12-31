/**
 * https://github.com/rollup/plugins/blob/5ec2abe0325ed6b23bca26a5455d2a3b137e9e29/shared/rollup.config.mjs
 */
import { readFileSync } from "node:fs";
import { builtinModules } from "module";
import typescript from "@rollup/plugin-typescript";
import nodeResolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import json from "@rollup/plugin-json";

/**
 * Create a base rollup config
 * @param {Record<string,any>} pkg Imported package.json
 * @param {string[]} external Imported package.json
 * @returns {import('rollup').RollupOptions}
 */
function createConfig({ pkg, external = [] }) {
  return {
    input: "src/index.mts",
    external: Object.keys(pkg.peerDependencies || {})
      .concat(builtinModules)
      .concat(external),
    onwarn: (warning) => {
      throw Object.assign(new Error(), warning);
    },
    strictDeprecations: true,
    output: [
      {
        format: "cjs",
        file: pkg.main,
        exports: "named",
        footer: "module.exports = Object.assign(exports.default, exports);",
        sourcemap: true,
      },
      {
        format: "es",
        file: pkg.module,
        plugins: [emitModulePackageFile()],
        sourcemap: true,
      },
    ],
    plugins: [
      commonjs(),
      nodeResolve(),
      json(),
      typescript({
        sourceMap: true,
        tsconfig: "./tsconfig.json",
        compilerOptions: {
          noEmit: false,
          emitDeclarationOnly: true,
          declaration: true,
          outDir: "./",
        },
      }),
    ],
  };
}

function emitModulePackageFile() {
  return {
    name: "emit-module-package-file",
    generateBundle() {
      this.emitFile({
        type: "asset",
        fileName: "package.json",
        source: `{"type":"module"}`,
      });
    },
  };
}

export default createConfig({
  pkg: JSON.parse(
    readFileSync(new URL("./package.json", import.meta.url), "utf8")
  ),
});
