import React from "react";
import { AmpInstallServiceworker } from "react-amphtml";
import { BaseUrlConsumer } from "../Link";

type Props = {
  children: any;
};
export const Html = ({ children }: Props) => (
  <html
    lang="en"
    // @ts-ignore
    amp={"true"}
  >
    <head>
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta charSet="utf-8" />
      <script async src="https://cdn.ampproject.org/v0.js"></script>
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

    <body>
      {children}

      <script
        key="amp-container"
        async
        custom-element="amp-install-serviceworker"
        src="https://cdn.ampproject.org/v0/amp-install-serviceworker-0.1.js"
      />
    </body>
  </html>
);
