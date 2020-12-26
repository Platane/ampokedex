import styled from "@emotion/styled";
import React from "react";
import { AmpImg } from "react-amphtml";
import type { Pokemon } from "../../builder/pokeapi";
import { Link } from "../Link";
import { generateColor } from "../_theme";

export const Page = ({ pokemons }: { pokemons: Pokemon[] }) => (
  <Container>
    {pokemons.map((pokemon) => (
      <Card key={pokemon.id} pokemon={pokemon} />
    ))}
  </Container>
);

const Container = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  margin: 6px;
`;

const Card = ({ pokemon }: { pokemon: Pokemon }) => {
  const color = generateColor(pokemon.color, pokemon.id);
  return (
    <CardContainer
      href={`/pokemon/${pokemon.id}`}
      style={{ backgroundColor: color }}
    >
      <CardImage
        alt="pokemon sprite"
        specName="default"
        width={96 + 18}
        height={96}
        src={pokemon.imageUrl}
        color={color}
      />
      <CardTitle>{pokemon.name}</CardTitle>
    </CardContainer>
  );
};

const CardContainer = styled(Link)`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-content: enter;

  background-color: #fafafa;
  margin: 6px;
  box-shadow: 0 0 0 1px #e8e8e8;
  border-radius: 4px;

  text-decoration: none;

  transition: transform 180ms;
  &:hover {
    transition: transform 80ms;
    transform: scale(0.96);
  }
  &:active {
    transition: transform 80ms;
    transform: scale(0.92);
  }
`;

const CardImage = styled(AmpImg)`
  > img {
    image-rendering: pixelated;
    object-fit: contain;
    object-position: center;
    border-radius: 0 0 4px 4px;
  }

  background-color: ${({ color }) => color};
  width: ${({ width }) => width + "px"};
  height: ${({ height }) => height + "px"};
`;

const CardTitle = styled.div`
  text-align: center;
  color: #333;
  text-transform: capitalize;
`;
