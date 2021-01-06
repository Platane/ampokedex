import React from "react";
import styled from "@emotion/styled";
import { Link } from "../Link";
import { Favicon, Image } from "../Image";
import type { Pokemon } from "../../builder/pokeapi";
import { generateColor } from "../_theme";
import { Title } from "react-head";
import { TypeIcon } from "../TypeIcon";
import { Container, Paper as Paper_ } from "../Layout/Paper";
import { capitalize } from "../../service/format";

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
      <Title>{capitalize(pokemon.name)} | ampokedex</Title>
      <Favicon src={pokemon.imageUrl!} />

      <Container>
        <Paper>
          <HeroImage
            data-layout-target={pokemon.name}
            layout="fixed-height"
            alt={`${capitalize(pokemon.name)} sprite`}
            specName="default"
            // width={500}
            height={340}
            src={pokemon.imageUrl}
            style={{
              backgroundColor: generateColor(pokemon.color, pokemon.id),
            }}
            attribution="Pokémon and Pokémon character names are trademarks of Nintendo."
          />
          <Content>
            <Name>{capitalize(pokemon.name)}</Name>
            <Genus>{pokemon.genus}</Genus>
            <FlavorText>{pokemon.flavorText}</FlavorText>

            {ancestor && (
              <p>
                Evolves from{" "}
                <Link href={`/pokemon/${ancestor.id}`}>{ancestor.name}</Link>
              </p>
            )}

            <p data-nosnippet>height: {pokemon.height}</p>
            <p data-nosnippet>weight: {pokemon.weight}</p>
            <p data-nosnippet>
              types:
              {pokemon.types.map((type) => (
                <TypeItem key={type} href={`/type/${type}`}>
                  <TypeIcon type={type} /> <span>{type}</span>
                </TypeItem>
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

const HeroImage = styled(Image)``;

const TypeItem = styled(Link)`
  display: flex;
  align-items: center;
  padding: 4px 0;
`;

const Content = styled.div`
  padding: 10px 10px 80px 10px;
`;

const Paper = styled(Paper_)`
  padding: 0;
`;
