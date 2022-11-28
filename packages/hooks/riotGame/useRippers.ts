import { getCurrency } from "./../../networks/index";
import {
  getNonSigningCosmWasmClient,
  getSigningCosmWasmClient,
} from "./../../utils/keplr";
import { useEffect, useState } from "react";
const defaultGuardianNFTPNG = require("../../../assets/default-images/default-guardian-nft.png");
import {
  TeritoriNftClient,
  TeritoriNftQueryClient,
} from "../../contracts-clients/teritori-nft/TeritoriNft.client";
import useSelectedWallet from "../useSelectedWallet";
import { useContractClients } from "../useContractClients";
import { useNFTs } from "../useNFTs";
import {
  NFTsRequest,
  Sort,
  SortDirection,
} from "../../api/marketplace/v1/marketplace";

// TODO: change to real data from blockchains
const fakeRippers: NSRiotGame.Ripper[] = [
  {
    id: 333,
    name: "The r!ot #333",
    image: defaultGuardianNFTPNG,
    stamina: 1,
    protection: 1,
    luck: 1,
    rarity: "legendary",
  },
  {
    id: 3343,
    name: "The r!ot #3343",
    image: defaultGuardianNFTPNG,
    stamina: 32,
    protection: 15,
    luck: 54,
    rarity: "uncommon",
  },
  {
    id: 143,
    name: "The r!ot #143",
    image: defaultGuardianNFTPNG,
    stamina: 43,
    protection: 1,
    luck: 65,
    rarity: "rare",
  },
  {
    id: 1909,
    name: "The r!ot #1909",
    image: defaultGuardianNFTPNG,
    stamina: 43,
    protection: 1,
    luck: 65,
    rarity: "epic",
  },
  {
    id: 109,
    name: "The r!ot #109",
    image: defaultGuardianNFTPNG,
    stamina: 43,
    protection: 1,
    luck: 65,
    rarity: "common",
  },
  {
    id: 19,
    name: "The r!ot #19",
    image: defaultGuardianNFTPNG,
    stamina: 43,
    protection: 1,
    luck: 65,
    rarity: "common",
  },
];

const THE_RIOT_COLLECTION_ADDRESS =
  process.env.THE_RIOT_COLLECTION_ADDRESS || "";
const LIMIT = 10;

const useRippers = () => {
  const selectedWallet = useSelectedWallet();

  // const { client, queryClient, selectedWallet } = useContractClients(
  //   RIOT_CONTRACT,
  //   TeritoriNftClient,
  //   TeritoriNftQueryClient
  // );
  // const tetitoriNFTClient = client as TeritoriNftClient;
  // const tetitoriNFTQueryClient = queryClient as TeritoriNftQueryClient;

  const nftsRequest: NFTsRequest = {
    collectionId: `tori-${THE_RIOT_COLLECTION_ADDRESS}`,
    // ownerId: selectedWallet?.address ? `tori-${selectedWallet.address}` : "",
    ownerId: "",
    limit: 20,
    offset: 0,
    sort: Sort.SORTING_UNSPECIFIED,
    sortDirection: SortDirection.SORT_DIRECTION_UNSPECIFIED,
  };

  const { nfts: myRippers, fetchMore } = useNFTs(nftsRequest);

  return {
    fetchMore,
    myRippers,
    selectedRippers: [],
  };
};

export default useRippers;
