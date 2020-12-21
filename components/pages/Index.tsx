import styled from "@emotion/styled";
import React from "react";
import { AmpImg } from "react-amphtml";
import type { Pokemon } from "../../builder/pokeapi";
import { Link } from "../Link";

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
  margin: 4px;
`;

const Card = ({ pokemon }: { pokemon: Pokemon }) => (
  <CardContainer href={`/pokemon/${pokemon.id}`}>
    <CardImage
      alt="pokemon sprite"
      specName="default"
      width={96}
      height={96}
      src={pokemon.imageUrl}
    />
    <CardTitle>{pokemon.name}</CardTitle>
  </CardContainer>
);

const CardContainer = styled(Link)`
  width: 100px;
  height: 120px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-content: enter;

  background-color: #fafafa;
  margin: 4px;
  box-shadow: 0 0 0 1px #e8e8e8;
`;

const CardImage = styled(AmpImg)`
  image-rendering: pixelated;
`;

const CardTitle = styled.div`
  text-align: center;
`;

// const BackgroundType = ({ types, ...props }) => (
//   <svg {...props} viewBox="0 0 100 100">
//     {types.map((type, i, { length }) => {
//       const a = (i / length) * Math.PI * 2 + 12;
//       const b = ((i + 1) / length) * Math.PI * 2 + 12;

//       return <path d="0"
//     })}
//   </svg>
// );
