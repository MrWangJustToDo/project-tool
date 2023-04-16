"use strict";

if (process.env.NODE_ENV === "production") {
  module.exports = require("./dist/cjs/request.production");
} else {
  module.exports = require("./dist/cjs/request.development");
}

