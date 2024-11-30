export interface NFTAttribute {
  trait_type: string;
  value: string;
  display_type?: string;
}

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
