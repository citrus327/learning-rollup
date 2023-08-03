import type { Plugin } from "rollup";
import type { LogPrefixOptions } from "./types";

export const logPrefix = (options: LogPrefixOptions): Plugin => {
  const { prefix } = options;
  return {
    name: "log-prefix",
    onLog: {
      order: "pre",
      handler(level, log) {
        this[level](`${prefix} - ${log.message}`);
        return false;
      },
    },
  };
};
