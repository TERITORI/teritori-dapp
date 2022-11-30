import {
  NFTsRequest,
  Sort,
  SortDirection,
} from "../../api/marketplace/v1/marketplace";
import {
  TeritoriNftClient,
  TeritoriNftQueryClient,
} from "../../contracts-clients/teritori-nft/TeritoriNft.client";
import { useContractClients } from "../useContractClients";
import { useNFTs } from "../useNFTs";
import useSelectedWallet from "../useSelectedWallet";
import { Wallet } from "./../../context/WalletsProvider/wallet";

const THE_RIOT_COLLECTION_ADDRESS =
  process.env.THE_RIOT_COLLECTION_ADDRESS || "";

export const useRippers = () => {
  const selectedWallet = useSelectedWallet();

  const {
    client: nftClient,
    queryClient: nftQueryClient,
  }: {
    client: TeritoriNftClient;
    queryClient: TeritoriNftQueryClient;
    selectedWallet: Wallet | undefined;
  } = useContractClients(
    THE_RIOT_COLLECTION_ADDRESS,
    TeritoriNftClient,
    TeritoriNftQueryClient
  );

  const myRippersRequest: NFTsRequest = {
    collectionId: `tori-${THE_RIOT_COLLECTION_ADDRESS}`,
    ownerId: selectedWallet?.address ? `tori-${selectedWallet.address}` : "",
    limit: 1000,
    offset: 0,
    sort: Sort.SORTING_UNSPECIFIED,
    sortDirection: SortDirection.SORT_DIRECTION_UNSPECIFIED,
  };
  const { nfts } = useNFTs(myRippersRequest);
  const myRippers = nfts as NSRiotGame.RipperListItem[];

  return {
    myRippers,
    nftClient,
    nftQueryClient,
  };
};
