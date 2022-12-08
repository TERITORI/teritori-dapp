import { NftData } from "../../contracts-clients/rioter-footer-nft/RioterFooterNft.types";

export interface NFTAttribute {
  trait_type: string;
  value: string;
  display_type?: string;
}

export type nftDropedAdjustmentType = {
  x: number;
  y: number;
  width: number;
  height: number;
  borderRadius: number;
};

export type FooterNftData = NftData & {
  imageUri: string;
  borderRadius: number;
};
