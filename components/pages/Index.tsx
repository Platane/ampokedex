import React from "react";
import { AmpImg } from "react-amphtml";
import type { Pokemon } from "../../builder/pokeapi";
import { Link } from "../Link";

export const Page = ({ pokemons }: { pokemons: Pokemon[] }) => (
  <ul
    style={{
      display: "flex",
      flexDirection: "row",
      flexWrap: "wrap",
      margin: "4px",
      listStyleType: "none",
    }}
  >
    {pokemons.map((pokemon) => (
      <li
        key={pokemon.id}
        style={{
          backgroundColor: "#fafafa",
          margin: "4px",
          boxShadow: "0 0 0 1px #e8e8e8",
        }}
      >
        <Link
          href={`/pokemon/${pokemon.id}`}
          key={pokemon.id}
          style={{
            width: "100px",
            height: "120px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignContent: "center",
          }}
        >
          <AmpImg
            alt="pokemon sprite"
            specName="default"
            width={96}
            height={96}
            src={pokemon.imageUrl}
            style={{ imageRendering: "pixelated" }}
          />
          <div>{pokemon.name}</div>
        </Link>
      </li>
    ))}
  </ul>
);
