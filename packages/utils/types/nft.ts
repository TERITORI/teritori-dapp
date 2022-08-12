import { Network } from "../network";

export interface NFTData {
  network: Network | null;
  name: string;
  owned: boolean;
  imageURI: string;
  collectionName: string;
  isCertified: boolean;
  floorPrice: string;
  favoritesCount: number;
  id: string;
}
