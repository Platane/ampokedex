import styled from "@emotion/styled";
import React from "react";
import { AmpImg, AmpImgProps } from "react-amphtml";
import { useImageSources, useImageSpriteSpec } from "./imageSpec";

export const Image = styled(AmpImg)`
  > img {
    image-rendering: crisp-edges;
    image-rendering: pixelated;
    object-fit: contain;
    object-position: center;
  }
`;

export const FixedSizeImage = styled(Image)`
  width: ${({ width }) => width + "px"};
  height: ${({ height }) => height + "px"};
`;

type Props = AmpImgProps;
export const Sprite = ({ src, ...props }: Props) => {
  const sheet = useImageSpriteSpec(src);
  const sources = useImageSources(src);

  return <Image {...props} src={sources[0].src} />;
};
