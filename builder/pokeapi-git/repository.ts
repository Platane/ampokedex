// import execa from "execa";
// import * as fs from "fs";
// import * as path from "path";
// import * as https from "https";
// import fetch from "node-fetch";
// import * as csv from "fast-csv";

// const repository = "git@github.com:PokeAPI/pokeapi.git";

// const getCsv = (url: string) =>
//   new Promise((resolve, reject) => {
//     const rows: string[][] = [];
//     const req = https.get(url, (res) => {
//       res
//         .pipe(csv.parse())
//         .on("error", reject)
//         .on("data", (row) => rows.push(row))
//         .on("end", () => resolve(rows));
//     });
//     req.on("error", reject);
//     req.end();
//   });

// const baseUrl = "https://github.com/PokeAPI/pokeapi/raw/master/data/v2/csv/";

// export const create = async () => {
//   // const dir = fs.mkdtempSync("pokeapi");
//   // const dir = path.join(__dirname, "pokeapi");

//   // await execa("git", ["clone", repository, "--depth", "1", dir]);

//   const [pokemon_species, pokemon_colors, pokemon] = await Promise.all(
//     ["pokemon_species.csv", "pokemon_colors", "pokemon.csv"].map((f) =>
//       getCsv(baseUrl + f)
//     )
//   );

//   console.log(pokemon_species);
// };
