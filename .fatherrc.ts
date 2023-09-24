import { defineConfig } from 'father';

export default defineConfig({
  esm: {},
  umd: {
    output: {
      filename: 'index.min.js'
    },
    externals: {
      react: "react"
    }
  },
});
