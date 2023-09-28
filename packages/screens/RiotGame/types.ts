import { ImageSourcePropType } from "react-native";
import { SvgProps } from "react-native-svg";

type BlankType = {
  id: number;
  type: "BLANK";
  data?: undefined;
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

export type RipperLightInfo = {
  name: string;
  imageUri: string;
};
