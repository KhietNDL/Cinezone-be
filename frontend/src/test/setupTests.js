/* eslint-disable no-undef */
import "@testing-library/jest-dom";
import "whatwg-fetch"; // <-- thêm dòng này

if (typeof global.TextEncoder === "undefined") {
  const { TextEncoder, TextDecoder } = require("util");
  global.TextEncoder = TextEncoder;
  global.TextDecoder = TextDecoder;
}
