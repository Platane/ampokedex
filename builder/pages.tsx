import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { HeadProvider, Link } from "react-head";
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

const ampBoilerPlater =
  "<style amp-boilerplate>body{-webkit-animation:-amp-start 8s steps(1,end) 0s 1 normal both;-moz-animation:-amp-start 8s steps(1,end) 0s 1 normal both;-ms-animation:-amp-start 8s steps(1,end) 0s 1 normal both;animation:-amp-start 8s steps(1,end) 0s 1 normal both}@-webkit-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@-moz-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@-ms-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@-o-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}</style><noscript><style amp-boilerplate>body{-webkit-animation:none;-moz-animation:none;-ms-animation:none;animation:none}</style></noscript>";

const generatePage = async (Page: any, props: any, pageName: string) => {
  const filename = path.join(outDir, (pageName || "index") + ".html");

  fs.mkdirSync(path.dirname(filename), { recursive: true });

  const headTags: any[] = [];
  const element = (
    <LinkProvider baseUrl={baseUrl}>
      <HeadProvider headTags={headTags}>
        <Link rel="canonical" href={origin + baseUrl + "/" + pageName} />
        <Html>
          <Page {...props} />
        </Html>
      </HeadProvider>
    </LinkProvider>
  );

  let content = "<!DOCTYPE HTML>" + renderToStaticMarkup(element);

  content = extractStyle(content);

  content = content.replace(
    "<head>",
    (h) => h + renderToStaticMarkup(formatHeadTags(headTags)) + ampBoilerPlater
  );

  if (false)
    content = await ampOptimizer.transformHtml(content, {
      canonical: origin + baseUrl + pageName,
    });

  fs.writeFileSync(filename, content);
};

const formatHeadTags = (headTags: any[]): any => {
  const key = (t: any) => [t.type, t.props.rel, t.props.name].join(":");

  return headTags
    .reverse()
    .filter((t, i, arr) => i === arr.findIndex((t2) => key(t) === key(t2)))
    .map((t) => {
      const { "data-rh": _, ...props } = t.props || {};
      return { ...t, props };
    });
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
    "<head>",
    (h) => h + `<style amp-custom>${css.join("")}</style>`
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

  generatePage(PageIndex, { pokemons, pokemonByColor, pokemonByType }, "");

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
