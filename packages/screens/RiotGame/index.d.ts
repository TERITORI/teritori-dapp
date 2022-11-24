/* eslint-disable @typescript-eslint/no-unused-vars */
namespace NSRiotGame {
  type Rarity = "common" | "uncommon" | "rare" | "epic" | "legendary";

  type Ripper = {
    id: number;
    name: string;
    image: ImageSourcePropType;
    stamina: number;
    protection: number;
    luck: number;
    rarity: Rarity;
  };
}
