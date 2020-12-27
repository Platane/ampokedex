import styled from "@emotion/styled";
import React from "react";
import type { Pokemon } from "../../builder/pokeapi";
import { Card } from "../Card";

export const Page = ({ pokemons }: { pokemons: Pokemon[] }) => (
  <List>
    {pokemons.map((pokemon) => (
      <Card key={pokemon.id} pokemon={pokemon} />
    ))}
  </List>
);

export const List = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  margin: 6px auto;

  ${Array.from({ length: 16 }, (_, i) => {
    const w = 126 * (i + 1) + 12;
    return `@media(min-width: ${w}px){width:${w}px}`;
  }).join(";")}
`;
