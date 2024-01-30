import { defineConfig } from "father";

export default defineConfig({
  esm: {},
  umd: {
    output: {
      filename: "index.js",
    },
    externals: {
      react: {
        commonjs: "react",
        commonjs2: "react",
        amd: "react",
        root: "React",
      },
    },
  },
});
