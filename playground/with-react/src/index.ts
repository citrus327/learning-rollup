import $, { ajaxSetup } from "jquery";
import { hello, world } from "./fn";
import * as lodash from "lodash";
import { stub } from "./sub/subsub/c";
import { foo } from "@blizzbolts/typus";
import { Comp } from "./comp";

console.log(hello(), lodash.pick({}, "1"), $.ajax, ajaxSetup, stub, foo);

const includes = lodash.includes;
export { world };
export { includes };
export { Comp };
