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
  traitType: string;
  value: string;
  displayType?: string;
}
