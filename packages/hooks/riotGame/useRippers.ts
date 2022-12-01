import { useMemo } from "react";

import {
  NFTsRequest,
  Sort,
  SortDirection,
} from "../../api/marketplace/v1/marketplace";
import {
  TeritoriNftClient,
  TeritoriNftQueryClient,
} from "../../contracts-clients/teritori-nft/TeritoriNft.client";
import { THE_RIOT_COLLECTION_ADDRESS } from "../../screens/RiotGame/settings";
import { useContractClients } from "../useContractClients";
import { useNFTs } from "../useNFTs";
import useSelectedWallet from "../useSelectedWallet";
import { Wallet } from "./../../context/WalletsProvider/wallet";

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

  const myAvailableRippers = useMemo(() => {
    return myRippers.filter((r) => !r.isListed);
  }, [myRippers]);

  return {
    myRippers,
    myAvailableRippers,
    nftClient,
    nftQueryClient,
  };
};
