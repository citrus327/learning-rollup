export * from "./fn";
export const fn = () => {
  import("./async.mjs").then((res) => {
    console.log(res.water);
  });
};

import set from "lodash/set";

export const b = set;

// export * from "lodash/get";
