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
  0%{transform: translateX(10px) rotate(0deg) }
  50%{transform: translateX(-30px) rotate(180deg) }
  100%{transform: translateX(10px) rotate(360deg) }
`;
const Spinner = styled.div`
  margin-left: auto;
  width: 20px;
  height: 4px;
  background-color: #777;
  border-radius: 50%;
  border-top: solid 10px #de5a3a;
  border-bottom: solid 6px #e1daec;
  animation: ${rotate} 2800ms linear infinite;
  position: relative;

  &:after {
    content: "";
    border: solid 3px #777;
    background-color: #eef;
    width: 3px;
    height: 3px;
    left: 3px;
    top: -2px;
    border-radius: 50%;
    position: absolute;
  }
`;
