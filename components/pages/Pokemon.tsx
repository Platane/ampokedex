import React from "react";
import styled from "@emotion/styled";
import { Link } from "../Link";
import { Image } from "../Image";
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
        <Paper>
          <HeroImage
            data-layout-target={pokemon.name}
            alt={`${pokemon.name} sprite`}
            specName="default"
            width={500}
            height={340}
            src={pokemon.imageUrl}
            style={{
              backgroundColor: generateColor(pokemon.color, pokemon.id),
            }}
          />
          <Content>
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

            <ul>
              {pokemon.types.map((type) => (
                <li key={type}>
                  <Link href={`/type/${type}`}>{type}</Link>
                </li>
              ))}
            </ul>

            <Link href={`/`}>home</Link>
          </Content>
        </Paper>
      </Container>
    </>
  );
};

const HeroImage = styled(Image)`
  width: 100% !important;
`;

const Container = styled.div`
  display: flex;
`;

const Content = styled.div`
  padding: 10px 10px 80px 10px;
`;

const Paper = styled.div`
  display: block;
  margin: 0 auto;
  max-width: 720px;
  box-shadow: 2px 6px 8px 0px #46464610;
  background-color: #fff;
`;
