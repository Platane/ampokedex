import React from "react";
import { AmpImg } from "react-amphtml";
import { Link } from "../Link";
import type { Pokemon } from "../../builder/pokeapi";
import type { PokemonType } from "../../builder/pokeapi/types";

export const Page = ({
  pokemons,
  type,
}: {
  type: PokemonType;
  pokemons: Pokemon[];
}) => (
  <div>
    <h1>{type}</h1>

    {pokemons.map((pokemon) => (
      <Link key={pokemon.id} href={`/pokemon/${pokemon.id}`}>
        <AmpImg
          alt="pokemon sprite"
          specName="default"
          width={96}
          height={96}
          src={pokemon.imageUrl}
          style={{ imageRendering: "pixelated" }}
        />
        <h3>{pokemon.name}</h3>
      </Link>
    ))}
  </div>
);
