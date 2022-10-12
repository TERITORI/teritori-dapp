import { NftData as Nft } from "../../contracts-clients/rioter-footer-nft/RioterFooterNft.types";
export type nftDropedAdjustmentType = {
  x: number;
  y: number;
  width: number;
  height: number;
  borderRadius: number;
};

export type NftData = Nft & {
  imageUri: string;
  borderRadius: number;
};
