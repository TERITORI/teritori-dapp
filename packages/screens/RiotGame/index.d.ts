/* eslint-disable @typescript-eslint/no-unused-vars */
namespace NSRiotGame {
  type RipperRarity = "Common" | "Uncommon" | "Rare" | "Epic" | "Legendary";
  type RipperTraitType =
    | "Background"
    | "Skin"
    | "Face"
    | "Clothes"
    | "Headwear"
    | "Backpack"
    | "Special Items"
    | "Eyewear"
    | "Necklace"
    | "Gen"
    | "Stamina"
    | "Luck"
    | "Protection";

  type RipperSkin =
    | "Iron"
    | "Silver"
    | "Bronze"
    | "Pure Gold"
    | "Pure Oil"
    | "Alloy"
    | "Aurora"
    | "Cosmos"
    | "Supernova"
    | "Marble"
    | "Ice"
    | "Lava"
    | "Grey Ether"
    | "Green Ether"
    | "Blue Ether"
    | "Purple Ether"
    | "Red Ether";

  type RipperAttribute = {
    trait_type: string;
    value: string;
  };

  type Ripper = {
    name: string;
    description: string;
    image: ImageSourcePropType;
    animation_url?: string | null;
    external_url?: string | null;
    attributes: RipperAttribute[];
    rarity?: RipperRarity;
    royalty_percentage: number;
    royalty_payment_address: string;
  };
}
