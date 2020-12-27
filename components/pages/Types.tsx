import React from "react";
import type { Pokemon } from "../../builder/pokeapi";
import { PokemonType } from "../../builder/pokeapi/types";
import { Container, Paper } from "../Layout/Paper";
import { Link } from "../Link";
import { TypeIcon } from "../TypeIcon";

export const Page = ({
  pokemonByType,
}: {
  pokemonByType: Record<PokemonType, Pokemon[]>;
}) => (
  <Container>
    <Paper>
      {Object.keys(pokemonByType).map((type: any) => (
        <Link
          key={type}
          href={`/type/${type}`}
          style={{ display: "flex", alignItems: "center" }}
        >
          <TypeIcon type={type} /> <span>{type}</span>
        </Link>
      ))}
    </Paper>
  </Container>
);
