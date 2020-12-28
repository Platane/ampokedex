import { keyframes } from "@emotion/react";
import styled from "@emotion/styled";
import React from "react";
import { Link } from "../Link";

export const Header = (props: any) => (
  <Container data-static-content data-nosnippet {...props}>
    <Link href="/">pokemons</Link>

    {"  "}

    <Link href="/type/">types</Link>

    {"  "}

    <Link href="/about">about</Link>

    <Spinner />
  </Container>
);

const Container = styled.nav`
  width: calc(100% - 20px);
  padding: 10px;
  margin-bottom: 16px;
  background-color: #fff;
  box-shadow: 0px -6px 6px 6px #46464620;
`;

const rotate = keyframes`
  0%{transform:rotate(0deg)}
  100%{transform:rotate(360deg)}
`;
const Spinner = styled.div`
  margin-left: auto;
  width: 16px;
  height: 6px;
  background-color: #aaa;
  border-radius: 0 4px 4px 0;
  border-top: solid 3px orange;
  animation: ${rotate} 2000ms linear infinite;
`;
