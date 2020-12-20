import React from "react";
import { renderToStaticNodeStream } from "react-dom/server";
import { getAll } from "./pokeapi";
import * as path from "path";
import * as fs from "fs";
import slugify from "slugify";
import { Page } from "../components/pages/Pokemon";
import { Html } from "../components/Html/Html";

(async () => {
  const outDir = path.join(__dirname, "../build");

  const r = getAll();

  r.on("data", (pokemon) => {
    const filename = path.join(
      outDir,
      "pokemon",
      slugify(pokemon.name) + ".html"
    );

    fs.mkdirSync(path.dirname(filename), { recursive: true });

    const element = React.createElement(
      Html,
      {} as any,
      React.createElement(Page, { pokemon }, null)
    );

    const w = fs.createWriteStream(filename);
    w.write("<!DOCTYPE HTML>");

    renderToStaticNodeStream(element).pipe(w);
  });

  return r.promise;
})().catch(console.error);
