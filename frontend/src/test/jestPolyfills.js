/* eslint-disable no-undef */

if (typeof global.TextEncoder === "undefined") {
  const { TextEncoder, TextDecoder } = require("util");

  global.TextEncoder = TextEncoder;

  global.TextDecoder = TextDecoder;
}

if (!global.import) {
  global.import = {};
}
if (!global.import.meta) {
  global.import.meta = {};
}
if (!global.import.meta.env) {
  global.import.meta.env = {};
}
global.import.meta.env.VITE_API_BASE_URL = "http://localhost:4458";
