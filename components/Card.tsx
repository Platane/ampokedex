import styled from "@emotion/styled";
import React from "react";
import { AmpImg } from "react-amphtml";
import type { Pokemon } from "../builder/pokeapi";
import { Link } from "./Link";
import { generateColor } from "./_theme";

export const Card = ({ pokemon }: { pokemon: Pokemon }) => {
  const color = generateColor(pokemon.color, pokemon.id);
  return (
    <Container
      href={`/pokemon/${pokemon.id}`}
      style={{ backgroundColor: color }}
    >
      <Image
        data-layout-source={pokemon.name}
        alt={`${pokemon.name} sprite`}
        specName="default"
        width={96 + 18}
        height={96}
        src={pokemon.imageUrl}
        style={{ backgroundColor: color }}
      />
      <Title light={pokemon.color === "black"}>{pokemon.name}</Title>
    </Container>
  );
};

const Container = styled(Link)`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-content: enter;

  margin: 6px;
  box-shadow: 2px 6px 8px -4px #4646462e;
  border-radius: 2px;
  overflow: hidden;

  text-decoration: none;
`;

const Image = styled(AmpImg)`
  > img {
    image-rendering: crisp-edges;
    image-rendering: pixelated;
    object-fit: contain;
    object-position: center;
  }

  width: ${({ width }) => width + "px"};
  height: ${({ height }) => height + "px"};
`;

const Title = styled.div<{ light: boolean }>`
  text-align: center;
  color: ${({ light }) => (light ? "#eee" : "#333")};
  font-size: 9px;
  margin-bottom: 4px;
  text-transform: capitalize;
`;