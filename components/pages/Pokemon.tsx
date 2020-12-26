import React from "react";
import { AmpImg } from "react-amphtml";
import styled from "@emotion/styled";
import { Link } from "../Link";
import type { Pokemon } from "../../builder/pokeapi";
import { generateColor } from "../_theme";
import { Link as HeadLink, Title } from "react-head";

export const Page = ({
  pokemon,
  pokemonById,
}: {
  pokemon: Pokemon;
  pokemonById: Record<string, Pokemon>;
}) => {
  const ancestor = pokemonById[pokemon.ancestorId];

  return (
    <>
      <Title>ampokedex | {pokemon.name}</Title>
      <HeadLink rel="icon" type="image/png" href={pokemon.imageUrl!} />
      <Container>
        <Image
          alt={`${pokemon.name} sprite`}
          specName="default"
          width={500}
          height={340}
          sizes="(min-width: 500px) 500px, 100vw"
          src={pokemon.imageUrl}
          style={{ backgroundColor: generateColor(pokemon.color, pokemon.id) }}
        />
        <h1>{pokemon.name}</h1>
        <h3>{pokemon.genus}</h3>
        <p>{pokemon.flavorText}</p>
        <p>height: {pokemon.height}</p>
        <p>weight: {pokemon.weight}</p>

        {ancestor && (
          <p>
            <span>evolves from </span>
            <Link href={`/pokemon/${ancestor.id}`}>{ancestor.name}</Link>
          </p>
        )}

        <Link href={`/color/${pokemon.color}`}>
          <div
            style={{
              width: "50px",
              height: "50px",
              borderRadius: "25px",
              backgroundColor: pokemon.color,
            }}
          />
        </Link>

        <ul>
          {pokemon.types.map((type) => (
            <li key={type}>
              <Link href={`/type/${type}`}>{type}</Link>
            </li>
          ))}
        </ul>

        <Link href={`/`}>home</Link>
      </Container>
    </>
  );
};

const Image = styled(AmpImg)`
  > img {
    image-rendering: pixelated;
    object-fit: contain;
    object-position: center;
  }
`;

const Container = styled.div`
  display: block;
`;
