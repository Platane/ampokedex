import { keyframes } from "@emotion/react";
import styled from "@emotion/styled";
import React from "react";
import { Link } from "../Link";

export const Header = (props: any) => (
  <Container data-static-content {...props}>
    <Link href="/">home</Link>

    <Spinner />
  </Container>
);

const Container = styled.nav`
  width: calc(100% - 20px);
  padding: 10px;
  background-color: #fff;
`;

const rotate = keyframes`
0%{transform:rotate(0deg)}
100%{transform:rotate(360deg)}
`;
const Spinner = styled.div`
  margin-left: auto;
  width: 16px;
  height: 8px;
  background-color: #aaa;
  border-radius: 0 4px 4px 0;
  border-left: solid 5px #888;
  animation: ${rotate} 2000ms linear infinite;
`;
