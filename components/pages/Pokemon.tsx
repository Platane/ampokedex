import React from "react";
import { AmpImg } from "react-amphtml";
// import { styled } from "@linaria/react";
import type { Pokemon } from "../../builder/pokeapi";
import { Link } from "../Link";

export const Page = ({ pokemon }: { pokemon: Pokemon }) => {
  return (
    <div>
      <h1>{pokemon.name}</h1>
      <AmpImg
        alt="pokemon sprite"
        specName="default"
        width={300}
        height={300}
        src={pokemon.imageUrl}
        style={{ imageRendering: "pixelated" }}
      />
      <h3>{pokemon.genus}</h3>
      <p>{pokemon.flavorText}</p>

      {pokemon.ancestor && (
        <p>
          <span>evolves from </span>
          <Link href={`/pokemon/${pokemon.ancestor}`}>{pokemon.ancestor}</Link>
        </p>
      )}

      <div
        style={{
          width: "50px",
          height: "50px",
          borderRadius: "25px",
          backgroundColor: pokemon.color,
        }}
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
