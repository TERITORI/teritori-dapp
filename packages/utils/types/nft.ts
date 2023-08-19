import { NftData } from "../../contracts-clients/rioter-footer-nft/RioterFooterNft.types";

export interface NFTAttribute {
  trait_type: string;
  value: string;
  display_type?: string;
}

export type NFTDropedAdjustmentType = {
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

export interface NFTInfo {
  name: string;
  description: string;
  attributes: NFTAttribute[];
  nftAddress: string;
  imageURL: string;
  tokenId: string;
  mintAddress: string;
  ownerAddress: string;
  isSeller: boolean;
  isListed: boolean;
  isOwner: boolean;
  canSell: boolean;
  price: string;
  priceDenom: string;
  collectionName: string;
  textInsert?: string;
  collectionImageURL: string;
  mintDenom: string;
  royalty: number;
  breedingsAvailable?: number;
  networkId: string;
  collectionId: string;
}
