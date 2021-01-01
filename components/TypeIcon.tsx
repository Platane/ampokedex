import React from "react";
import { PokemonType } from "../builder/pokeapi/types";
import { Image } from "./Image";

export const getGemImageUrl = (type: PokemonType) =>
  `https://github.com/PokeAPI/sprites/raw/master/sprites/items/${type}-gem.png`;

export const TypeIcon = ({
  size = 30,
  type,
  ...props
}: {
  type: PokemonType;
  size?: 30 | 60 | 90;
}) => (
  <Image
    {...props}
    specName="default"
    width={size}
    height={size}
    src={getGemImageUrl(type)}
    attribution="Pokémon and Pokémon character names are trademarks of Nintendo."
    alt={`${type} gem icon`}
  />
);
