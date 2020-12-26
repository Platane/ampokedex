import ParkMiller from "park-miller";
import { Color, PokemonType } from "../builder/pokeapi/types";

export const typeColor: Record<PokemonType, string> = {
  normal: "#aaa",
  poison: "#aaa",
  fire: "#aaa",
  water: "#aaa",
  steel: "#aaa",
  flying: "#aaa",
  fighting: "#aaa",
  rock: "#aaa",
  ground: "#aaa",
  bug: "#aaa",
  grass: "#aaa",
  ice: "#aaa",
  electric: "#aaa",
  dragon: "#aaa",
  dark: "#aaa",
  psychic: "#aaa",
  fairy: "#aaa",
  ghost: "#aaa",
  shadow: "transparent",
  unknown: "transparent",
};

// const standardColor: Record<Color, { h: number; s: number; l: number }> = {
//   // black: "#464545",
//   // blue: "#3f9cec",
//   // gray: "#9E9E9E",
//   // green: "#4dc550",
//   // pink: "#3f9cec",
//   // purple: "#d05fbd",
//   // white: "#f3f1e9",
//   // brown: "#b16145",
//   // yellow: "#ffed52",
//   black: { h: 258, s: 4, l: 30 },
//   blue: { h: 238, s: 61, l: 58 },
//   gray: { h: 54, s: 4, l: 65 },
//   green: { h: 97, s: 57, l: 55 },
//   pink: { h: 335, s: 79, l: 81 },
//   purple: { h: 317, s: 57, l: 56 },
//   red: { h: 11, s: 68, l: 48 },
//   white: { h: 54, s: 34, l: 93 },
//   brown: { h: 36, s: 43, l: 47 },
//   yellow: { h: 54, s: 92, l: 69 },
// };
// const clamp100 = (x: number) => Math.max(0, Math.min(100, x));
// const c = standardColor[color];

// const h = c.h + pm.floatInRange(-12, 12);
// const s = clamp100(c.s + pm.floatInRange(-5, 5));
// const l = clamp100(c.l + pm.floatInRange(-6, 6));

// return `hsl(${Math.round(h)},${Math.round(s)}%,${Math.round(l)}%)`;

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
