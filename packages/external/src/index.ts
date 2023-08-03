import type { ExternalOption, NullValue, Plugin } from "rollup";
import type { ExternalOptions } from "./types";
import { readFileSync } from "fs";
import path from "path";

type ExternalFn = (
  source: string,
  importer: string | undefined,
  isResolved: boolean
) => boolean | NullValue;

const getExternalFn = (external?: ExternalOption) => {
  if (typeof external === "function") {
    return external;
  } else if (typeof external === "string") {
    return (source: string) => source === external;
  } else if (external instanceof RegExp) {
    return (source: string) => external.test(source);
  } else if (Array.isArray(external)) {
    return (source: string) =>
      external.some((o) =>
        o instanceof RegExp ? o.test(source) : o === source
      );
  } else if (typeof external === "undefined") {
    return () => false;
  } else {
    throw new Error("[rollup-plugin-external] Invalid external options");
  }
};

export const external = (options: ExternalOptions = {}): Plugin => {
  const { packageJsonPath, includeDeps = true } = options;
  return {
    name: "external",
    options(inputOptions) {
      const fn: ExternalFn = getExternalFn(inputOptions.external);

      let _packageJsonPath =
        packageJsonPath || path.resolve(process.cwd(), "./package.json");

      const fileContent = readFileSync(_packageJsonPath, {
        encoding: "utf-8",
      });

      const parsedPackageJson = JSON.parse(fileContent);

      const deps = parsedPackageJson["dependencies"] || {};
      const peerDeps = parsedPackageJson["peerDependencies"] || {};

      const extendDeps: ExternalFn = (source) => {
        const totalDeps = [
          ...(includeDeps ? Object.keys(deps) : []),
          ...Object.keys(peerDeps),
        ];
        // if has a dep called react, then it should match react/jsx-runtime
        return totalDeps.some((o) => {
          const regexp = new RegExp(`^${o}(\\/\.+)*$`);
          return regexp.test(source);
        });
      };

      inputOptions.external = (source, importer, isResolved) => {
        return (
          fn(source, importer, isResolved) ||
          extendDeps(source, importer, isResolved)
        );
      };
    },
  };
};
