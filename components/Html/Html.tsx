import React from "react";

type Props = {
  scriptSources?: string[];
  children: any;
};
export const Html = ({ scriptSources = [], children }: Props) => (
  <html
    lang="en"
    // @ts-ignore
    amp="true"
  >
    <head>
      <script async src="https://cdn.ampproject.org/v0.js"></script>
      <meta charSet="utf-8"></meta>
    </head>

    <body>
      {children}

      {scriptSources.map((src) => (
        <script src={src} />
      ))}
    </body>
  </html>
);
