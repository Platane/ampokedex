import React from "react";
import { Card } from "../Card";
import type { Pokemon } from "../../builder/pokeapi";
import type { PokemonType } from "../../builder/pokeapi/types";
import { Link as HeadLink, Title as HeadTitle } from "react-head";
import styled from "@emotion/styled";
import { FixedSizeImage } from "../Image";

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
      <HeadTitle>ampokedex | {type} pokemons</HeadTitle>
      <HeadLink rel="icon" type="image/png" href={gemImageUrl} />
      <div>
        <Title>
          <FixedSizeImage
            specName="default"
            width={60}
            height={60}
            src={gemImageUrl}
          />
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

const List = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  margin: 6px;
`;
