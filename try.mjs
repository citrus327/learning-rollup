// import pkg from "./package.json" assert { type: "json" };

// console.log(pkg);

import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
const pkg = require("./package.json");

console.log(pkg);
