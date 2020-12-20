import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { getAll } from "./pokeapi";
import * as path from "path";
import * as fs from "fs";
import slugify from "slugify";
import { Page } from "../components/pages/Pokemon";
import { Html } from "../components/Html/Html";
import { Provider as LinkProvider } from "../components/Link";

// @ts-ignore
import AmpOptimizer from "@ampproject/toolbox-optimizer";

const ampOptimizer = AmpOptimizer.create();

const originalHtml = `
<!doctype html>
<html ⚡>
  ...
</html>`;

(async () => {
  const outDir = path.join(__dirname, "../build");

  const r = getAll();

  const pokemons = await r.promise;

  for (const pokemon of pokemons) {
    const filename = path.join(
      outDir,
      "pokemon",
      slugify(pokemon.name) + ".html"
    );

    fs.mkdirSync(path.dirname(filename), { recursive: true });

    const element = (
      <LinkProvider baseUrl={"file://" + outDir}>
        <Html>
          <Page pokemon={pokemon} />
        </Html>
      </LinkProvider>
    );

    const content = "<!DOCTYPE HTML>" + renderToStaticMarkup(element);
    ampOptimizer.transformHtml(content).then((optimizedHtml: any) => {
      fs.writeFileSync(filename, optimizedHtml);
    });
  }
})().catch(console.error);
