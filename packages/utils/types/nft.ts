import { NftData } from "../../contracts-clients/rioter-footer-nft/RioterFooterNft.types";
import { Network } from "../network";

export interface NFTData {
  network: Network | null;
  name: string;
  owned: boolean;
  imageURI: string;
  collectionName: string;
  collectionId: string;
  collectionDiscriminator: string;
  isCertified: boolean;
  floorPrice: string;
  favoritesCount: number;
  id: string;
}

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
