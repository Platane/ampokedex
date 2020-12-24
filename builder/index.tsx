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
import { Color, PokemonType } from "./pokeapi/types";

const ampOptimizer = AmpOptimizer.create();

const outDir = path.join(__dirname, "../build");

const baseUrl = "";

const generatePage = async (
  Page: any,
  { amp, scriptSources, ...props }: any,
  pageName: string
) => {
  const filename = path.join(outDir, pageName + ".html");

  fs.mkdirSync(path.dirname(filename), { recursive: true });

  const element = (
    <LinkProvider baseUrl={baseUrl}>
      <Html amp={amp} scriptSources={scriptSources}>
        <Page {...props} />
      </Html>
    </LinkProvider>
  );

  let content = "<!DOCTYPE HTML>" + renderToStaticMarkup(element);

  if (amp)
    content = await ampOptimizer.transformHtml(content, {
      canonical: "https://a",
    });

  fs.writeFileSync(filename, content);
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
  generatePage(
    () => null,
    { scriptSources: [baseUrl + "/app-shell.js"] },
    `app-shell`
  );

  generatePage(
    PageIndex,
    { amp: true, pokemons, pokemonByColor, pokemonByType },
    `index`
  );

  for (const pokemon of pokemons)
    generatePage(
      PagePokemon,
      { amp: true, pokemon, pokemonById, pokemonByColor, pokemonByType },
      `pokemon/${pokemon.id}`
    );

  for (const [color, pokemons] of Object.entries(pokemonByColor))
    generatePage(PageColor, { amp: true, color, pokemons }, `color/${color}`);

  for (const [type, pokemons] of Object.entries(pokemonByType))
    generatePage(PageType, { amp: true, type, pokemons }, `type/${type}`);
})().catch(console.error);
