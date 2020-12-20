import { Pokemon } from "./types";
import { EventEmitter } from "events";
import get from "./cached-fetch";

const getPokemonById = (id: string | number): Promise<Pokemon> =>
  get(`https://pokeapi.co/api/v2/pokemon/${id}`);

export const getAll = () => {
  const ee = new EventEmitter();

  const promise = Promise.all(
    Array.from({ length: 20 }).map(async (_, id) => {
      const pokemon = await getPokemonById(id + 1);
      ee.emit("data", pokemon);
    })
  ).then((x) => {
    ee.emit("end");
    return x;
  });

  return { promise, on: ee.on.bind(ee) };
};
