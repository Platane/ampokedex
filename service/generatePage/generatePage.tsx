import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { HeadProvider } from "react-head";
import { Provider as LinkProvider } from "../../components/Link";
import { ampBoilerPlate } from "./ampBoilerPlate";
import { sortHeadTags, formatHeadTags } from "./headTagsUtils";
import { CacheProvider } from "@emotion/react";
import createEmotionServer from "@emotion/server/create-instance";
import createCache from "@emotion/cache";
import { createFontFace } from "../../components/fontFace";
import { themeColor } from "../../components/_theme";
import { logoUrl } from "../package";

export const generatePage = ({
  body,
  headTags: additionalHeadTags = [],
  amp,
  baseUrl,
}: {
  body: React.ReactElement;
  headTags?: React.ReactElement[];
  amp?: boolean;
  baseUrl: string;
}) => {
  const extractedHeadTags: React.ReactElement[] = [];

  const key = "c";
  const cache = createCache({ key });
  const server = createEmotionServer(cache);

  const app = (
    <CacheProvider value={cache}>
      <LinkProvider baseUrl={baseUrl}>
        <HeadProvider headTags={extractedHeadTags}>{body}</HeadProvider>
      </LinkProvider>
    </CacheProvider>
  );

  const { html, css } = server.extractCritical(renderToStaticMarkup(app));

  const headTags = sortHeadTags([
    ...formatHeadTags(extractedHeadTags),
    ...additionalHeadTags,
    ...(amp ? ampBoilerPlate : []),
    <style
      amp-custom={amp && "true"}
      dangerouslySetInnerHTML={{ __html: createFontFace(baseUrl) + css }}
    />,
    <meta charSet="utf-8" />,
    <meta name="viewport" content="width=device-width, initial-scale=1" />,
    <link rel="manifest" href={baseUrl + "/manifest.webmanifest"} />,
    <link rel="apple-touch-icon" href={logoUrl} />,
    <meta name="theme-color" content={themeColor} />,
  ]);

  return (
    "<!DOCTYPE HTML>" +
    renderToStaticMarkup(
      <Html html={html} head={headTags} amp={amp} />
    ).replace(/="true"/g, "")
  );
};

type Props = {
  amp?: boolean;
  head?: React.ReactElement | React.ReactElement[] | null;
  html: string;
};
const Html = ({ html, amp, head }: Props) => (
  <html
    lang="en"
    // @ts-ignore
    amp={amp && "true"}
  >
    <head>{head}</head>

    <body dangerouslySetInnerHTML={{ __html: html }}></body>
  </html>
);
