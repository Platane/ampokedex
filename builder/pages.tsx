import React from "react";
import { Link } from "react-head";
import { getAll, Pokemon } from "./pokeapi";
import * as path from "path";
import * as fs from "fs";
import { generatePage } from "../service/generatePage/generatePage";
// @ts-ignore
import AmpOptimizer from "@ampproject/toolbox-optimizer";
import type { Color, PokemonType } from "./pokeapi/types";
import { AmpInstallServiceworker } from "react-amphtml";
import { origin, baseUrl, logoUrl } from "../service/package";

import { Page as PagePokemon } from "../components/pages/Pokemon";
import { Page as PageIndex } from "../components/pages/Index";
import { Page as PageAbout } from "../components/pages/About";
import { Page as PageTypes } from "../components/pages/Types";
import { Page as PageType } from "../components/pages/Type";
import { Layout } from "../components/Layout/Layout";
import { generateSpriteSheet } from "./sprite-sheet";
import { getGemImageUrl } from "../components/TypeIcon";

const ampOptimizer = AmpOptimizer.create();

const outDir = path.join(__dirname, "../build");

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

  // process the images
  const imageSpecs = await generateSpriteSheet(
    [
      ...(pokemons.map((p) => p.imageUrl).filter(Boolean) as any),
      ...Object.keys(pokemonByType).map(getGemImageUrl as any),
      logoUrl,
    ],
    path.join(outDir, "images"),
    baseUrl + "/image/"
  );

  //
  const pages = [
    {
      component: PageIndex,
      props: {},
      href: "/",
    },

    {
      component: PageAbout,
      props: {},
      href: "/about",
    },

    {
      component: PageTypes,
      props: {},
      href: "/type/",
    },

    ...Object.entries(pokemonByType).map(([type, pokemons]) => ({
      component: PageType,
      props: { type, pokemons },
      href: `/type/${type}`,
    })),

    ...pokemons.map((pokemon) => ({
      component: PagePokemon,
      props: { pokemon },
      href: `/pokemon/${pokemon.id}`,
    })),
  ];

  for (const { href, props, component } of pages) {
    const canonical = origin + baseUrl + href;
    const element = (
      <>
        <Link rel="canonical" href={canonical} />
        <Layout>
          {React.createElement(component as any, {
            imageSpecs,
            pokemonById,
            pokemonByColor,
            pokemonByType,
            pokemons,
            ...props,
          })}
        </Layout>
        <AmpInstallServiceworker
          src={baseUrl + "/service-worker.js"}
          // @ts-ignore
          layout="nodisplay"
        />
      </>
    );

    const headTags = [
      <script async src="https://cdn.ampproject.org/v0.js" />,
      <script
        async
        custom-element="amp-install-serviceworker"
        src="https://cdn.ampproject.org/v0/amp-install-serviceworker-0.1.js"
      />,
    ];

    let content = generatePage({ amp: true, body: element, headTags, baseUrl });

    if (false)
      content = await ampOptimizer.transformHtml(content, { canonical });

    const filename = path.join(
      outDir,
      href.slice(1) + (href[href.length - 1] === "/" ? "index" : "") + ".html"
    );
    fs.mkdirSync(path.dirname(filename), { recursive: true });
    fs.writeFileSync(filename, content);
  }
})().catch(console.error);
