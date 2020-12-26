import ParkMiller from "park-miller";
import { Color } from "../builder/pokeapi/types";

export const backgroundColor = "#f5f5f5";

const standardColors = {
  blue: ["#ddf3f5", "#abc2e8", "#b0deff", "#bfcfff"],
  red: ["#e5707e", "#fa877f", "#ffa5a5"],
  green: ["#a3ddcb", "#e8e9a1", "#a0c1b8", "#cbe2b0", "#adebbe"],
  yellow: ["#f4ebc1", "#faf0af", "#fdfdc4"],

  pink: ["#f6def6", "#ffb6b9", "#f3c1c6"],
  brown: ["#c7b198", "#dfd3c3", "#daa592"],

  white: ["#f0ece3", "#f7f2e7", "#fcf5ee"],
  gray: ["#cccccc", "#eeeeee", "#dfdfdf"],
  purple: ["#c3aed6", "#be97dc", "#f8b3eb", "#d38cad"],
  black: ["#5d5b6a", "#758184", "#596e79"],
} as const;

export const generateColor = (color: Color, seed: string) => {
  const intSeed = parseInt(seed.toLowerCase().replace(/\W/g, ""), 36);
  const pm = new ParkMiller(intSeed);

  const c = standardColors[color];

  return c[pm.integerInRange(0, c.length - 1)];
};
