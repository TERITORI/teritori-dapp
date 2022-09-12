import anklesSVG from "../../assets/icons/nft-attributes/ankles.svg";
import backgroundSVG from "../../assets/icons/nft-attributes/background.svg";
import lacesSVG from "../../assets/icons/nft-attributes/laces.svg";
import skinSVG from "../../assets/icons/nft-attributes/skin.svg";
import socksSVG from "../../assets/icons/nft-attributes/socks.svg";
import solesSVG from "../../assets/icons/nft-attributes/soles.svg";
import textureSVG from "../../assets/icons/nft-attributes/texture.svg";
import toesSVG from "../../assets/icons/nft-attributes/toes.svg";
import { NFTAttribute } from "./types/nft";

const capitalizeFirstLetter = (string) =>
  string.charAt(0).toUpperCase() + string.slice(1);

export const nftAttributeSVGSource = (attribute: NFTAttribute) => {
  if (attribute.traitType.includes("texture")) return textureSVG;
  switch (attribute.traitType) {
    case "background":
      return backgroundSVG;
    case "ankles":
      return anklesSVG;
    case "laces":
      return lacesSVG;
    case "soles":
      return solesSVG;
    case "socks":
      return socksSVG;
    case "skin":
      return skinSVG;
    case "toes":
      return toesSVG;
  }
};

export const nftAttributeDisplayType = (attribute: NFTAttribute) => {
  if (attribute.displayType)
    return capitalizeFirstLetter(attribute.displayType);

  switch (attribute.traitType) {
    // case traitType.contains("texture"): return textureSVG
    case "background":
      return backgroundSVG;
    case "ankles":
      return anklesSVG;
    case "laces":
      return lacesSVG;
    case "soles":
      return solesSVG;
    case "socks":
      return socksSVG;
    case "skin":
      return skinSVG;
    case "toes":
      return toesSVG;
  }
};
