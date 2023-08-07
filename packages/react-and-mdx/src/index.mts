import { SourceMapGenerator } from "source-map";
import { VFile } from "vfile";
import { createFilter } from "@rollup/pluginutils";
import { createFormatAwareProcessors } from "@mdx-js/mdx/lib/util/create-format-aware-processors.js";
import remarkFrontmatter from "remark-frontmatter";
import remarkMdxFrontmatter from "remark-mdx-frontmatter";
import { Plugin } from "rollup";
import fs from "node:fs";
import { createRequire } from "node:module";
import path from "node:path";

let warns: string[] = [];

const preflight = () => {
  const validateTypescriptJsx = () => {
    try {
      const require = createRequire(process.cwd());
      const tsconfig = require(path.resolve(process.cwd(), "./tsconfig.json"));
      if (!tsconfig || !tsconfig.compilerOptions.jsx) return;

      if (tsconfig.compilerOptions.jsx !== "react-jsx") {
        warns.push(
          "Please set tsconfig.json#compilerOptions#jsx to `react-jsx` for proper usage"
        );
      }
    } catch (_) {}
  };

  validateTypescriptJsx();
};

export function reactAndMdx(options: any): Plugin {
  const { include, exclude } = options || {};
  preflight();
  const { extnames, process } = createFormatAwareProcessors({
    SourceMapGenerator,
    remarkPlugins: [remarkFrontmatter, remarkMdxFrontmatter],
    providerImportSource: "@mdx-js/react", // 组件本身必须要被provider包裹
    jsxImportSource: "react",
    jsxRuntime: "automatic",
  });
  const filter = createFilter(include, exclude);

  return {
    name: "DOCIT",

    async load(id) {
      const file = new VFile({ path: id });

      // add custom content to target MDX
      if (
        file.extname &&
        filter(file.path) &&
        extnames.includes(file.extname)
      ) {
        return {
          code:
            fs.readFileSync(id, { encoding: "utf-8" }) +
            `
            ### Yes Iam Added!
          `,
        };
      }

      return null;
    },
    async transform(value: string, path: string) {
      const file = new VFile({ value, path });

      if (
        file.extname &&
        filter(file.path) &&
        extnames.includes(file.extname)
      ) {
        if (warns.length !== 0) {
          // FIXME: cannot warn in buildStart stage, since we include a file path in the log itself???
          warns.forEach(this.warn);
          warns = [];
        }

        const compiled = await process(file);
        const code = String(compiled.value);
        const result = { code, map: compiled.map };
        return result;
      }
    },
  };
}
