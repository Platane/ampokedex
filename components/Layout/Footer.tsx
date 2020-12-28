import styled from "@emotion/styled";
import React from "react";

export const Footer = (props: any) => (
  <Container data-static-content data-nosnippet {...props}>
    Pokémon and Pokémon character names are trademarks of{" "}
    <a href="https://www.pokemon.com/us/legal/">Nintendo</a>.
  </Container>
);

const Container = styled.div`
  margin-top: auto;
  padding: 40px 6px 6px 6px;
  font-size: 9px;
`;
