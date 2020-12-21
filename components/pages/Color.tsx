import React from "react";
import { AmpImg } from "react-amphtml";
import { Link } from "../Link";
import styled from "@emotion/styled";
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

    <Dot style={{ backgroundColor: color }} />

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

const Dot = styled.div`
  width: 50px;
  height: 50px;
  border-radius: 25px;
`;
