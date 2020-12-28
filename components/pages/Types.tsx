import styled from "@emotion/styled";
import ParkMiller from "park-miller";
import React from "react";
import type { Pokemon } from "../../builder/pokeapi";
import { PokemonType } from "../../builder/pokeapi/types";
import { Card } from "../Card";
import { Container, Paper } from "../Layout/Paper";
import { Link } from "../Link";
import { TypeIcon } from "../TypeIcon";

const n = 4;

export const Page = ({
  pokemonByType,
}: {
  pokemonByType: Record<PokemonType, Pokemon[]>;
}) => (
  <Container>
    <Paper>
      <h1>Pokemons by type</h1>

      {Object.entries(pokemonByType)
        .sort(([_1, a], [_2, b]) => b.length - a.length)
        .map(([type, pokemons]) => (
          <Section key={type}>
            <Label href={`/type/${type}`}>
              <TypeIcon type={type as any} /> <span>{type}</span>
            </Label>
            <List className="list">
              {pick(pokemons, n, type).map((pokemon) => (
                <Card key={pokemon.id} pokemon={pokemon} />
              ))}
              <Ellipsis href={`/type/${type}`}>
                {pokemons.length - n} more <br /> …
              </Ellipsis>
            </List>
          </Section>
        ))}
    </Paper>
  </Container>
);

const Label = styled(Link)`
  display: flex;
  align-items: center;
  padding: 4px 0;
`;

const Section = styled.div`
  margin: 20px 0;
`;

const Ellipsis = styled(Link)`
  width: 114px;
  height: 114px;
  margin: 6px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const List = styled.div`
  display: flex;
  flex-direction: row;

  ${Array.from({ length: n }, (_, i) => {
    const w = 126 * (i + 2) + 32;

    return `@media(max-width: ${w}px){ > *:nth-child(${i + 1}){display:none;}}`;
  }).join(";")}
`;

const pick = (arr: Pokemon[], n: number, seed: string = "") => {
  const intSeed = parseInt(seed.toLowerCase().replace(/\W/g, ""), 36);
  const pm = new ParkMiller(intSeed);

  const pool = arr.slice();

  return Array.from({ length: Math.min(pool.length, n) }, () => {
    const i = pm.integerInRange(0, pool.length - 1);
    return pool.splice(i, 1)[0];
  });
};
