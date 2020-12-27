const pkg = require("../package.json");

export const { name, description, author, homepage } = pkg;

export const logoUrl =
  "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/poke-ball.png";

export const baseUrl = process.env.APP_BASE_URL || "";
export const origin = "https://platane.github.io";
