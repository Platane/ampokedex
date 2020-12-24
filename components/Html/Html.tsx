import React from "react";
import { AmpInstallServiceworker } from "react-amphtml";
import { BaseUrlConsumer } from "../Link";

type Props = {
  scriptSources?: string[];
  children: any;
  amp?: boolean;
};
export const Html = ({ scriptSources = [], amp, children }: Props) => (
  <html
    lang="en"
    // @ts-ignore
    amp={amp && "true"}
  >
    <head>
      {amp && <script async src="https://cdn.ampproject.org/v0.js"></script>}
      <meta charSet="utf-8"></meta>
    </head>

    <body>
      {children}

      {scriptSources.map((src) => (
        <script key={src} src={src} />
      ))}

      {amp && (
        <>
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
        </>
      )}
    </body>
  </html>
);
