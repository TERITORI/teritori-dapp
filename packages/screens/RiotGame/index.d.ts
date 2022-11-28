/* eslint-disable @typescript-eslint/no-unused-vars */
namespace NSRiotGame {
  type Rarity = "common" | "uncommon" | "rare" | "epic" | "legendary";
  type Trait =
    | "background"
    | "skin"
    | "face"
    | "clothes"
    | "headwear"
    | "backpack"
    | "special Items"
    | "eyewear"
    | "necklace"
    | "gen"
    | "stamina"
    | "luck"
    | "protection";

  type Ripper = {
    id: number;
    name: string;
    description: string;
    image: ImageSourcePropType;
    external_url: string;
    stamina: number;
    protection: number;
    luck: number;
    rarity: Rarity;
  };
}
