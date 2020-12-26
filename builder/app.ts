import * as path from "path";
import * as fs from "fs";
import typescript from "@rollup/plugin-typescript";
import commonjs from "@rollup/plugin-commonjs";
import resolve from "@rollup/plugin-node-resolve";
import { terser } from "rollup-plugin-terser";
import replace from "rollup-plugin-replace";
import { rollup } from "rollup";
import * as crypto from "crypto";
import { createFontFace } from "../components/fontFace";
import { backgroundColor } from "../components/_theme";

const outDir = path.join(__dirname, "../build");
fs.mkdirSync(outDir, { recursive: true });

(async () => {
  // app-shell
  let appShellRevision = "";
  {
    const bundle = await rollup({
      input: path.join(__dirname, "../app-shell/app-shell.ts"),
      plugins: [
        commonjs(),
        resolve(),
        typescript(),
        ...(process.env.NODE_ENV === "production" ? [terser()] : []),
      ],
    });

    const { output } = await bundle.generate({ format: "es" });

    const html = [
      `<!DOCTYPE HTML>`,
      '<html lang="en" style="height:auto">',
      "<head>",
      '<meta charset="utf-8">',
      '<meta name="viewport" content="width=device-width, initial-scale=1">',
      "<title>ampokedex</title>",
      '<link rel="icon" type="image/png" href="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/poke-ball.png" >',
      `<style>${createFontFace(process.env.APP_BASE_URL)}</style>`,
      "</head>",
      `<body style="margin:0;height:auto;background-color:${backgroundColor};overflow:visible">`,
      '<script src="https://cdn.ampproject.org/shadow-v0.js"></script>',
      "<script>",
      ...output.map((o) => {
        if (o.type === "chunk") return o.code;
        return "";
      }),
      "</script>",
      "</body>",
      "</html>",
    ].join("");

    appShellRevision = crypto.createHash("md5").update(html).digest("base64");

    fs.writeFileSync(path.join(outDir, "app-shell.html"), html);

    await bundle.close();
  }

  // service-worker
  {
    const bundle = await rollup({
      input: path.join(__dirname, "../service/service-worker.ts"),
      plugins: [
        commonjs(),
        resolve(),
        replace({
          "process.env.NODE_ENV": JSON.stringify(process.env.NODE_ENV || ""),
          "process.env.APP_BASE_URL": JSON.stringify(
            process.env.APP_BASE_URL || ""
          ),
          "process.env.APP_SHELL_REVISION": JSON.stringify(appShellRevision),
        }),
        typescript(),
        ...(process.env.NODE_ENV === "production" ? [terser()] : []),
      ],
    });

    await bundle.write({
      file: path.join(outDir, "service-worker.js"),
      format: "es",
    });

    await bundle.close();
  }
})();
