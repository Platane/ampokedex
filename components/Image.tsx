import styled from "@emotion/styled";
import React from "react";
import { AmpImg, AmpImgProps } from "react-amphtml";
import { Link } from "react-head";
import { useImageSources } from "./imageSpec";

const Image_ = styled(AmpImg)`
  > noscript > img,
  > img {
    image-rendering: crisp-edges;
    image-rendering: pixelated;
    object-fit: contain;
    object-position: center;
    ${(p) => {
      switch (p.layout) {
        case "fixed":
          return `width:${p.width}px;height:${p.height}px;`;
        case "fixed-height":
          return `width:100%;height:${p.height}px;`;
      }
    }}
  }

  display: block;

  ${(p) => {
    switch (p.layout) {
      case "fixed":
        return `width:${p.width}px;height:${p.height}px;`;
      case "fixed-height":
        return `width:100%;height:${p.height}px;`;
    }
  }}
`;

type Props = AmpImgProps;
export const Image = ({ src, ...props }: Props) => {
  const sources = useImageSources(src);

  const webpImageUrl = sources.find((s) => s.type === "image/webp")?.src;
  const pngImageUrl = sources.find((s) => s.type === "image/png")?.src;

  return (
    <Image_ {...props} src={webpImageUrl}>
      <Image_ fallback {...props} src={pngImageUrl}>
        <noscript>
          <img src={pngImageUrl} alt={props.alt} />
        </noscript>
      </Image_>
    </Image_>
  );
};

export const Favicon = ({ src }: { src: string }) => {
  const sources = useImageSources(src);

  return (
    <>
      {sources.map(({ src, type }) => (
        <React.Fragment key={src}>
          <Link rel="icon" type={type} href={src} />
          <Link rel="apple-touch-icon" type={type} href={src} />
        </React.Fragment>
      ))}
    </>
  );
};
