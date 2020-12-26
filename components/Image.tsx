import styled from "@emotion/styled";
import { AmpImg } from "react-amphtml";

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
