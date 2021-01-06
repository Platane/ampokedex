import styled from "@emotion/styled";
import React from "react";
import type { Pokemon } from "../builder/pokeapi";
import { capitalize } from "../service/format";
import { Image } from "./Image";
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
        data-nosnippet
        specName="default"
        width={96 + 18}
        height={96}
        src={pokemon.imageUrl}
        style={{ backgroundColor: color }}
        attribution="Pokémon and Pokémon character names are trademarks of Nintendo."
        layout="fixed"
      />
      <Title light={pokemon.color === "black"}>
        {capitalize(pokemon.name)}
      </Title>
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

const Title = styled.div<{ light: boolean }>`
  text-align: center;
  color: ${({ light }) => (light ? "#fff" : "#000")};
  font-size: 10px;
  margin-bottom: 4px;
`;
