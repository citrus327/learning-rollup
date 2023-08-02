import { hello, world } from "./fn";
import * as lodash from "lodash";
import $, { ajaxSetup } from "jquery";

console.log(hello(), lodash.pick({}, "1"), $.ajax, ajaxSetup);

const includes = lodash.includes;
export { world };
export { includes };
