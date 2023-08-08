import type { NormalizedInputOptions, Plugin } from "rollup";

export const lifeCycle = (): Plugin => {
  let normalizedOptions: NormalizedInputOptions;
  return {
    name: "rollup-plugin-lifecycle",
    buildStart(options) {
      console.log("buildStart");
      normalizedOptions = options;
    },
    async resolveId(source, importer, options) {
      console.log("resolveId", source);
      return null;
      // return null;
    },
    load(id) {
      return null;
    },
    transform(code, id) {
      console.log("transform", id);
      return null;
    },
    moduleParsed(info) {
      console.log("moduleParsed", info.id);
    },
  };
};
