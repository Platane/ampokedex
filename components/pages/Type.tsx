import React from "react";
import { Card } from "../Card";
import type { Pokemon } from "../../builder/pokeapi";
import type { PokemonType } from "../../builder/pokeapi/types";
import { Link as HeadLink, Title as HeadTitle } from "react-head";
import styled from "@emotion/styled";
import { TypeIcon } from "../TypeIcon";
import { List } from "./Index";
import { useImageSrc } from "../imageSpec";

export const Page = ({
  pokemons,
  type,
}: {
  type: PokemonType;
  pokemons: Pokemon[];
}) => {
  const gemImageUrl = `https://github.com/PokeAPI/sprites/raw/master/sprites/items/${type}-gem.png`;
  return (
    <>
      <HeadTitle>{type} pokemons | ampokedex</HeadTitle>
      <HeadLink rel="icon" type="image/png" href={useImageSrc(gemImageUrl)} />
      <div>
        <Title>
          <TypeIcon type={type} size={60} />
          {type}
        </Title>

        <List>
          {pokemons.map((pokemon) => (
            <Card key={pokemon.id} pokemon={pokemon} />
          ))}
        </List>
      </div>
    </>
  );
};

const Title = styled.h1`
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0;
  padding: 20px 0;
`;
