import { ImageSourcePropType } from "react-native";
import { SvgProps } from "react-native-svg";

import { NFT } from "../../api/marketplace/v1/marketplace";
import { NFTInfo } from "../Marketplace/NFTDetailScreen";

type BlankType = {
  id: number;
  type: "BLANK";
};

type PointsType = {
  id: number;
  type: "POINTS";
  data: {
    label: string;
    value: string;
  };
};

type ImageType = {
  id: number;
  type: "IMAGE";
  data: {
    source: ImageSourcePropType;
  };
};

type IconType = {
  id: number;
  type: "ICON";
  data: {
    source: React.FC<SvgProps>;
  };
};

export type GameBgCardItem = BlankType | PointsType | ImageType | IconType;

export type RipperRarity =
  | "Common"
  | "Uncommon"
  | "Rare"
  | "Epic"
  | "Legendary";
export type RipperTraitType =
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

export type RipperSkin =
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

export type RipperAttribute = {
  trait_type: string;
  value: string;
};

export type RipperDetail = NFTInfo;
export type RipperListItem = NFT;
