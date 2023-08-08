import type { NormalizedInputOptions, Plugin } from "rollup";

const POLYFILL_ID = "\0polyfill";
const PROXY_SUFFIX = "?inject-polyfill-proxy";

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

      if (source === POLYFILL_ID) {
        return { id: POLYFILL_ID, moduleSideEffects: true };
      }
      if (options.isEntry) {
        const resolution = await this.resolve(source, importer, {
          skipSelf: true,
          ...options,
        });

        if (!resolution || resolution.external === true) {
          return resolution;
        }

        const moduleInfo = await this.load(resolution);

        moduleInfo.moduleSideEffects = true;

        return `${resolution.id}${PROXY_SUFFIX}`;
      }

      return null;
    },
    load(id) {
      console.log("load", id);

      if (id === POLYFILL_ID) {
        // Replace with actual polyfill
        return "console.log('polyfill');";
      }

      if (id.endsWith(PROXY_SUFFIX)) {
        const entryId = id.slice(0, -PROXY_SUFFIX.length);
        // We know ModuleInfo.hasDefaultExport is reliable because
        // we awaited this.load in resolveId
        const { hasDefaultExport } = this.getModuleInfo(entryId)!;
        let code =
          `import ${JSON.stringify(POLYFILL_ID)};` +
          `export * from ${JSON.stringify(entryId)};`;
        // Namespace reexports do not reexport default, so we need
        // special handling here
        if (hasDefaultExport) {
          code += `export { default } from ${JSON.stringify(entryId)};`;
        }
        return code;
      }
      return null;
    },
    transform(code, id) {
      console.log("transform", id);
      return null;
    },
    // moduleParsed(info) {
    //   console.log("moduleParsed", info.id);
    // },
  };
};
