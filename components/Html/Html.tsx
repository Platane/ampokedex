import React from "react";
import { AmpInstallServiceworker } from "react-amphtml";
import { Link, Title } from "react-head";
import { BaseUrlConsumer } from "../Link";

type Props = {
  children: any;
};
export const Html = ({ children }: Props) => (
  <>
    <Title>ampokedex</Title>
    <Link
      rel="icon"
      type="image/png"
      href="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/poke-ball.png"
    ></Link>
    <html
      lang="en"
      // @ts-ignore
      amp="true"
    >
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta charSet="utf-8" />
        <script async src="https://cdn.ampproject.org/v0.js"></script>
        <script
          key="amp-container"
          async
          custom-element="amp-install-serviceworker"
          src="https://cdn.ampproject.org/v0/amp-install-serviceworker-0.1.js"
        />
        <BaseUrlConsumer>
          {(baseUrl) => (
            <AmpInstallServiceworker
              src={baseUrl + "/service-worker.js"}
              // @ts-ignore
              layout="nodisplay"
            />
          )}
        </BaseUrlConsumer>
      </head>

      <body style={{ margin: 0 }}>{children}</body>
    </html>
  </>
);
