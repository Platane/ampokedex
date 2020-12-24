import typescript from "@rollup/plugin-typescript";
import commonjs from "@rollup/plugin-commonjs";
import resolve from "@rollup/plugin-node-resolve";
import { terser } from "rollup-plugin-terser";
import replace from "rollup-plugin-replace";

export default {
  plugins: [
    //
    commonjs(),
    resolve(),
    replace({
      "process.env.NODE_ENV": JSON.stringify("production"),
    }),
    typescript(),
    // terser(),
  ],
  output: {
    dir: "build",
    format: "es",
  },
};
