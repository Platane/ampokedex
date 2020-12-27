import React from "react";
import styled from "@emotion/styled";
import { Link } from "../Link";
import { Image } from "../Image";
import type { Pokemon } from "../../builder/pokeapi";
import { generateColor } from "../_theme";
import { Link as HeadLink, Title } from "react-head";
import { TypeIcon } from "../TypeIcon";
import { Container, Paper as Paper_ } from "../Layout/Paper";

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
            attribution="Pokémon and Pokémon character names are trademarks of Nintendo."
          />
          <Content>
            <Name>{pokemon.name}</Name>
            <Genus>{pokemon.genus}</Genus>
            <FlavorText>{pokemon.flavorText}</FlavorText>

            {ancestor && (
              <p>
                <span>evolves from </span>
                <Link href={`/pokemon/${ancestor.id}`}>{ancestor.name}</Link>
              </p>
            )}

            <p>height: {pokemon.height}</p>
            <p>weight: {pokemon.weight}</p>
            <p>
              types:
              {pokemon.types.map((type) => (
                <Link
                  key={type}
                  href={`/type/${type}`}
                  style={{ display: "flex", alignItems: "center" }}
                >
                  <TypeIcon type={type} /> <span>{type}</span>
                </Link>
              ))}
            </p>
          </Content>
        </Paper>
      </Container>
    </>
  );
};

const Name = styled.h1``;
const Genus = styled.p`
  font-style: italic;
`;
const FlavorText = styled.p``;

const HeroImage = styled(Image)`
  width: 100% !important;
`;

const Content = styled.div`
  padding: 10px 10px 80px 10px;
`;

const Paper = styled(Paper_)`
  padding: 0;
`;
