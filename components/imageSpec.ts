import { createContext, useContext } from "react";
import { ImageSpecs } from "../builder/sprite-sheet";

const ctx = createContext({} as ImageSpecs);

export const useImageBorder = (imageUrl: string) =>
  useContext(ctx)[imageUrl].border;

export const useImageSources = (imageUrl: string) =>
  useContext(ctx)[imageUrl].sources;

export const useImageSrc = (imageUrl: string) =>
  useContext(ctx)[imageUrl]?.sources?.find?.((x) => x.type === "image/png")
    ?.src;

export const useImageSpriteSpec = (imageUrl: string) => {
  const { sources, ...x } = useContext(ctx)[imageUrl];
  return x;
};

export const { Provider } = ctx;
