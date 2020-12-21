import React from "react";
import { AmpImg } from "react-amphtml";
import { Link } from "../Link";
import type { Pokemon } from "../../builder/pokeapi";
import type { Color } from "../../builder/pokeapi/types";

export const Page = ({
  pokemons,
  color,
}: {
  color: Color;
  pokemons: Pokemon[];
}) => (
  <div>
    <h1>{color}</h1>

    <div
      style={{
        width: "50px",
        height: "50px",
        borderRadius: "25px",
        backgroundColor: color,
      }}
    />

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
