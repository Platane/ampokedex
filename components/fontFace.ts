export const createFontFace = (baseUrl: string = "") =>
  `@font-face {
  font-family: "pokemon-font";
  src: url("${baseUrl}/pokemon-font.eot");
  src: url("${baseUrl}/pokemon-font.eot?#iefix") format("embedded-opentype"),
       url("${baseUrl}/pokemon-font.woff2") format("woff2"),
       url("${baseUrl}/pokemon-font.woff") format("woff"),
       url("${baseUrl}/pokemon-font.ttf") format("truetype");
}`.replace(/\s+/g, " ");
