import React from "react";
import { AmpImg } from "react-amphtml";
// import { styled } from "@linaria/react";
import type { Pokemon } from "../../builder/pokeapi/types";

export const Page = ({ pokemon }: { pokemon: Pokemon }) => {
  return (
    <div>
      <h1>{pokemon.name}</h1>
      <AmpImg
        alt="pokemon sprite"
        specName="default"
        width={300}
        height={300}
        src={pokemon.sprites.front_default}
        style={{ imageRendering: "pixelated" }}
      />
    </div>
  );

  //   return (
  //     <Container>
  //       <Title>{pokemon.name}</Title>
  //     </Container>
  //   );
};

// const Title = styled.h1``;
// const Container = styled.div``;
