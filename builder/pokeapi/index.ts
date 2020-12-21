import slugify from "slugify";
import get from "./cached-fetch";
import type { PokemonVariety, PokemonSpecie } from "./types";

const getPokemonVarietyById = (id: string | number): Promise<PokemonVariety> =>
  get(`https://pokeapi.co/api/v2/pokemon/${id}`);

const getPokemonSpecieById = (id: string | number): Promise<PokemonSpecie> =>
  get(`https://pokeapi.co/api/v2/pokemon-species/${id}`);

export const getAll = () =>
  Promise.all(
    Array.from({ length: 30 }).map(async (_, id) => {
      const specie = await getPokemonSpecieById(id + 1);
      const variety = await getPokemonVarietyById(
        specie.varieties.find((v) => v.is_default)!.pokemon.name
      );

      return formatPokemon(specie, variety);
    })
  );

const formatPokemon = (specie: PokemonSpecie, variety: PokemonVariety) => ({
  id: slugify(variety.name),
  name: variety.name,
  color: specie.color.name,
  height: variety.height,
  weight: variety.weight,
  ancestorId:
    specie.evolves_from_species?.name &&
    slugify(specie.evolves_from_species?.name),
  genus: specie.genera.find((g) => g.language.name === "en")?.genus,
  flavorText: specie.flavor_text_entries
    .find((f) => f.language.name === "en")
    ?.flavor_text?.replace(/\s+/g, " "),
  imageUrl: variety.sprites.front_default,
  // imageUrl:
  //   variety.sprites.versions["generation-vii"]["ultra-sun-ultra-moon"]
  //     .front_default,
  types: variety.types.map((t) => t.type.name),
  habitat: specie.habitat.name,
});

export type Pokemon = ReturnType<typeof formatPokemon>;
