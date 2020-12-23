import * as path from "path";
import typescript from "@rollup/plugin-typescript";
import commonjs from "@rollup/plugin-commonjs";
import resolve from "@rollup/plugin-node-resolve";
import { terser } from "rollup-plugin-terser";
import injectProcessEnv from "rollup-plugin-inject-process-env";

export default {
  plugins: [
    //
    commonjs(),
    resolve(),
    injectProcessEnv({
      NODE_ENV: "production",
    }),
    typescript(),
    terser(),
  ],
  output: {
    dir: "build",
    format: "es",
  },
};
