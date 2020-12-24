import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { getAll, Pokemon } from "./pokeapi";
import * as path from "path";
import * as fs from "fs";
import { Html } from "../components/Html/Html";
import { Provider as LinkProvider } from "../components/Link";
import { Page as PagePokemon } from "../components/pages/Pokemon";
import { Page as PageIndex } from "../components/pages/Index";
import { Page as PageColor } from "../components/pages/Color";
import { Page as PageType } from "../components/pages/Type";

// @ts-ignore
import AmpOptimizer from "@ampproject/toolbox-optimizer";
import type { Color, PokemonType } from "./pokeapi/types";

const ampOptimizer = AmpOptimizer.create();

const outDir = path.join(__dirname, "../build");

const baseUrl = process.env.APP_BASE_URL || "";
const origin = "https://platane.github.io";

const generatePage = async (Page: any, props: any, pageName: string) => {
  const filename = path.join(outDir, pageName + ".html");

  fs.mkdirSync(path.dirname(filename), { recursive: true });

  const element = (
    <LinkProvider baseUrl={baseUrl}>
      <Html>
        <Page {...props} />
      </Html>
    </LinkProvider>
  );

  let content = "<!DOCTYPE HTML>" + renderToStaticMarkup(element);

  content = extractStyle(content);

  if (false)
    content = await ampOptimizer.transformHtml(content, {
      canonical: origin + baseUrl + pageName,
    });

  fs.writeFileSync(filename, content);
};

const extractStyle = (html: string) => {
  const css: string[] = [];

  const h = html.replace(
    /<\s*style[^>]*>(((?!<\/style).)*)<\/style\s*>/g,
    (_, inside) => {
      css.push(inside);
      return "";
    }
  );

  return h.replace(
    "</head>",
    (h) => `<style amp-custom>${css.join("")}</style>` + h
  );
};

(async () => {
  const pokemons = await getAll();

  const pokemonByHabitat: Record<string, Pokemon[]> = {} as any;
  const pokemonByColor: Record<Color, Pokemon[]> = {} as any;
  const pokemonByType: Record<PokemonType, Pokemon[]> = {} as any;
  const pokemonById: Record<string, Pokemon> = {} as any;

  for (const pokemon of pokemons) {
    pokemonById[pokemon.id] = pokemon;

    (pokemonByColor[pokemon.color] = pokemonByColor[pokemon.color] || []).push(
      pokemon
    );

    (pokemonByHabitat[pokemon.habitat] =
      pokemonByHabitat[pokemon.habitat] || []).push(pokemon);

    for (const type of pokemon.types)
      (pokemonByType[type] = pokemonByType[type] || []).push(pokemon);
  }

  //

  generatePage(PageIndex, { pokemons, pokemonByColor, pokemonByType }, `index`);

  for (const pokemon of pokemons)
    generatePage(
      PagePokemon,
      { pokemon, pokemonById, pokemonByColor, pokemonByType },
      `pokemon/${pokemon.id}`
    );

  for (const [color, pokemons] of Object.entries(pokemonByColor))
    generatePage(PageColor, { color, pokemons }, `color/${color}`);

  for (const [type, pokemons] of Object.entries(pokemonByType))
    generatePage(PageType, { type, pokemons }, `type/${type}`);
})().catch(console.error);
