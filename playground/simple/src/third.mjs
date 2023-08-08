import { get } from "lodash-es";

const obj = {
  a: {
    c: 5,
  },
  b: 2,
};

const c = get(obj, "a.c");

export { c };
