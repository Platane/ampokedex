import { EventEmitter } from "events";
import get from "./cached-fetch";
import type { PokemonVariety, PokemonSpecie } from "./types";

const getPokemonVarietyById = (id: string | number): Promise<PokemonVariety> =>
  get(`https://pokeapi.co/api/v2/pokemon/${id}`);

const getPokemonSpecieById = (id: string | number): Promise<PokemonSpecie> =>
  get(`https://pokeapi.co/api/v2/pokemon-species/${id}`);

export const getAll = () => {
  const ee = new EventEmitter();

  const promise = Promise.all(
    Array.from({ length: 3 }).map(async (_, id) => {
      const specie = await getPokemonSpecieById(id + 1);
      const variety = await getPokemonVarietyById(
        specie.varieties.find((v) => v.is_default)!.pokemon.name
      );

      const pokemon = formatPokemon(specie, variety);

      ee.emit("data", pokemon);
    })
  ).then((x) => {
    ee.emit("end");
    return x;
  });

  return { promise, on: ee.on.bind(ee) };
};

const formatPokemon = (specie: PokemonSpecie, variety: PokemonVariety) => ({
  name: variety.name,
  color: specie.color.name,
  ancestor: specie.evolves_from_species?.name,
  genus: specie.genera.find((g) => g.language.name === "en")?.genus,
  flavorText: specie.flavor_text_entries
    .find((f) => f.language.name === "en")
    ?.flavor_text?.replace(/\s+/g, " "),
  imageUrl: variety.sprites.front_default,
  type: variety.types.map((t) => t.type.name),
  habitat: specie.habitat.name,
});

export type Pokemon = ReturnType<typeof formatPokemon>;
