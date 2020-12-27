import styled from "@emotion/styled";
import React from "react";

export const Footer = (props: any) => (
  <Container {...props}>
    <Legal />
  </Container>
);

const Container = styled.div`
  margin-top: auto;
  padding-top: 40px;
  font-size: 9px;
`;

const Legal = () => (
  <span>
    Pokémon and Pokémon character names are trademarks of{" "}
    <a href="https://www.pokemon.com/us/legal/">Nintendo</a>.
  </span>
);
