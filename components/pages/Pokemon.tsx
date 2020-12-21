import React from "react";
import { AmpImg } from "react-amphtml";
import { Link } from "../Link";
import type { Pokemon } from "../../builder/pokeapi";

export const Page = ({
  pokemon,
  pokemonById,
}: {
  pokemon: Pokemon;
  pokemonById: Record<string, Pokemon>;
}) => {
  const ancestor = pokemonById[pokemon.ancestorId];

  return (
    <div>
      <h1>{pokemon.name}</h1>
      <AmpImg
        alt="pokemon sprite"
        specName="default"
        width={300}
        height={300}
        src={pokemon.imageUrl}
        style={{ imageRendering: "pixelated" }}
      />
      <h3>{pokemon.genus}</h3>
      <p>{pokemon.flavorText}</p>
      <p>height: {pokemon.height}</p>
      <p>weight: {pokemon.weight}</p>

      {ancestor && (
        <p>
          <span>evolves from </span>
          <Link href={`/pokemon/${ancestor.id}`}>{ancestor.name}</Link>
        </p>
      )}

      <Link href={`/color/${pokemon.color}`}>
        <div
          style={{
            width: "50px",
            height: "50px",
            borderRadius: "25px",
            backgroundColor: pokemon.color,
          }}
        />
      </Link>

      <ul>
        {pokemon.types.map((type) => (
          <li key={type}>
            <Link href={`/type/${type}`}>{type}</Link>
          </li>
        ))}
      </ul>

      <Link href={`/`}>home</Link>
    </div>
  );
};
