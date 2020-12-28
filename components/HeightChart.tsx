import styled from "@emotion/styled";
import React from "react";
import { Pokemon } from "../builder/pokeapi";
import { baseUrl } from "../service/package";
import { BaseUrlConsumer } from "./Link";

export const HeightChart = ({ pokemon }: { pokemon: Pokemon }) => {
  const manHeight = 170;
  const pokemonHeight = pokemon.height;

  const h = Math.max(manHeight, pokemonHeight);

  return (
    <Container viewBox={`0 0 ${h} ${h}`} xmlns="http://www.w3.org/2000/svg">
      <filter id="black">
        <feColorMatrix
          type="matrix"
          values="0 0 0 0 0
              0 0 0 0 0
              0 0 0 0 0
              0 0 0 1 0 "
        />
      </filter>

      <SvgImage
        href={pokemon.imageUrl!}
        height="100"
        width="100"
        x={100}
        filter="url(#black)"
      />
      <BaseUrlConsumer>
        {(baseUrl) => (
          <SvgImage
            href={baseUrl + "/red.png"}
            height="100"
            width="100"
            filter="url(#black)"
          />
        )}
      </BaseUrlConsumer>
    </Container>
  );
};

const SvgImage = styled.image`
  image-rendering: crisp-edges;
  image-rendering: pixelated;
`;

const Container = styled.svg`
  height: 200px;
  width: 200px;
`;
