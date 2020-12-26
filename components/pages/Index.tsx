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

const List = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  margin: 6px;
`;
