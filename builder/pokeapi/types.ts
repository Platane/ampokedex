export type PokemonType =
  | "normal"
  | "fighting"
  | "flying"
  | "poison"
  | "ground"
  | "rock"
  | "bug"
  | "ghost"
  | "steel"
  | "fire"
  | "water"
  | "grass"
  | "electric"
  | "psychic"
  | "ice"
  | "dragon"
  | "dark"
  | "fairy"
  | "unknown"
  | "shadow";

export type Color =
  | "black"
  | "blue"
  | "brown"
  | "gray"
  | "green"
  | "pink"
  | "purple"
  | "red"
  | "white"
  | "yellow";

export type PokemonVariety = {
  id: number;

  name: string;

  // The base experience gained for defeating this Pokémon.
  base_experience: number;

  // The height of this Pokémon in decimetres.
  height: number;

  // Set for exactly one Pokémon used as the default for each species.
  is_default: boolean;

  // Order for sorting. Almost national order, except families are grouped together.
  order: number;

  // The weight of this Pokémon in hectograms.
  weight: number;

  // A list of abilities this Pokémon could potentially have.
  abilities: any[];

  // A list of forms this Pokémon can take on.
  forms: any[];

  // A list of game indices relevent to Pokémon item by generation.
  game_indices: any[];

  // A list of items this Pokémon may be holding when encountered.
  held_items: any[];

  // A link to a list of location areas, as well as encounter details pertaining to specific versions.
  location_area_encounters: string;

  // A list of moves along with learn methods and level details pertaining to specific version groups.
  moves: any[];

  // A set of sprites used to depict this Pokémon in the game. A visual representation of the various sprites can be found at PokeAPI/sprites
  sprites: {
    back_default: string | null;
    back_female: string | null;
    back_shiny: string | null;
    back_shiny_female: string | null;
    front_default: string | null;
    front_female: string | null;
    front_shiny: string | null;
    front_shiny_female: string | null;
    versions: Record<
      | "generation-i"
      | "generation-ii"
      | "generation-iii"
      | "generation-iv"
      | "generation-v"
      | "generation-vi"
      | "generation-vii"
      | "generation-viii",
      Record<string, string>
    >;
  };

  // The species this Pokémon belongs to.
  species: any[];

  // A list of base stat values for this Pokémon.
  stats: {
    base_stat: number;
    effort: number;
    stat: { name: string; url: string }[];
  }[];

  // A list of details showing types this Pokémon has.
  types: {
    slot: number;
    type: { name: PokemonType; url: string };
  }[];
};

export type PokemonSpecie = {
  color: {
    name: Color;
    url: string;
  };
  evolves_from_species: { name: string; url: string };
  flavor_text_entries: {
    flavor_text: string;
    language: Language;
    version: {
      name: any;
      url: string;
    };
  }[];
  genera: {
    genus: string;
    language: Language;
  }[];
  habitat: {
    name: string;
    url: string;
  };
  name: string;
  names: {
    language: Language;
    name: string;
  };
  varieties: [
    {
      is_default: boolean;
      pokemon: {
        name: string;
        url: string;
      };
    }
  ];
};

type Language = {
  name: "en" | string;
  url: string;
};
