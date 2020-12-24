import * as path from "path";
import * as fs from "fs";
import typescript from "@rollup/plugin-typescript";
import commonjs from "@rollup/plugin-commonjs";
import resolve from "@rollup/plugin-node-resolve";
import { terser } from "rollup-plugin-terser";
import replace from "rollup-plugin-replace";
import { rollup } from "rollup";
import * as crypto from "crypto";

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
      '<html lang="en">',
      "<head>",
      '<meta charset="utf-8">',
      '<meta name="viewport" content="width=device-width, initial-scale=1">',
      "</head>",
      '<body style="margin:0">',
      '<script src="https://cdn.ampproject.org/shadow-v0.js" ></script>',
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
