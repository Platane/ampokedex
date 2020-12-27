import * as path from "path";
import * as fs from "fs";
import typescript from "@rollup/plugin-typescript";
import commonjs from "@rollup/plugin-commonjs";
import resolve from "@rollup/plugin-node-resolve";
import { terser } from "rollup-plugin-terser";
import replace from "rollup-plugin-replace";
import { rollup } from "rollup";
import * as crypto from "crypto";
import React from "react";
import { generatePage } from "../service/generatePage/generatePage";
import { baseUrl } from "../service/package";
import { Layout } from "../components/Layout/Layout";

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

    const html = generatePage({
      baseUrl,
      body: (
        <Layout>
          <div id="root"></div>
        </Layout>
      ),
      headTags: [
        <script src="https://cdn.ampproject.org/shadow-v0.js" />,
        <script
          dangerouslySetInnerHTML={{
            __html: output
              .map((o) => {
                if (o.type === "chunk") return o.code;
                return "";
              })
              .join(""),
          }}
        />,
      ],
    });

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
