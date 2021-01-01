import styled from "@emotion/styled";
import React from "react";
import { AmpImg, AmpImgProps } from "react-amphtml";
import { useImageSources, useImageSpriteSpec } from "./imageSpec";

export const Image_ = styled(AmpImg)`
  > img {
    image-rendering: crisp-edges;
    image-rendering: pixelated;
    object-fit: contain;
    object-position: center;
  }

  ${(p) =>
    p.layout === "fixed" ? `width:${p.width}px;height:${p.height}px;` : ""}
`;

type Props = AmpImgProps;
export const Image = ({ src, ...props }: Props) => {
  // const sheet = useImageSpriteSpec(src);
  const sources = useImageSources(src);

  const webpImageUrl = sources.find((s) => s.type === "image/webm")?.src;
  const pngImageUrl = sources.find((s) => s.type === "image/png")?.src;

  return (
    <Image_ {...props} src={webpImageUrl}>
      <Image_ fallback {...props} src={pngImageUrl} />
    </Image_>
  );
};
