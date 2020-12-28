import React from "react";
import { logoUrl } from "../../service/package";
import { FixedSizeImage } from "../Image";
import { Container, Paper } from "../Layout/Paper";

export const Page = () => (
  <Container>
    <Paper>
      <h1 data-nosnippet>
        <FixedSizeImage
          specName="default"
          width={30}
          height={30}
          src={logoUrl}
          attribution="Pokémon and Pokémon character names are trademarks of Nintendo."
        />{" "}
        About
      </h1>
      <p>
        This app is a demonstration of how to enhance navigation experience
        across amp pages.
      </p>

      <p>
        It uses <a href="https://pokeapi.co/">pokeapi.co</a> as source of data.
        Many thanks to the team for maintaining this API.
      </p>

      <p>
        Be sure to visit{" "}
        <a
          href="https://github.com/platane/ampokedex"
          style={{ wordBreak: "break-all" }}
        >
          github.com/platane/ampokedex
        </a>{" "}
        if you are interested in the implementation.
      </p>
    </Paper>
  </Container>
);
