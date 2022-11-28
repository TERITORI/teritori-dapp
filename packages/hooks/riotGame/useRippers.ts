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

import nftJson from "./nft.json";

// TODO: change to real data from blockchains
const fakeRippers: NSRiotGame.Ripper[] = [
  {
    ...nftJson,
    name: "The R!ot #149",
    attributes: [{ trait_type: "Skin", value: "Iron" }, ...nftJson.attributes],
  },
  {
    ...nftJson,
    name: "The R!ot #5",
    attributes: [
      { trait_type: "Skin", value: "Pure Gold" },
      ...nftJson.attributes,
    ],
  },
  {
    ...nftJson,
    name: "The R!ot #146",
    attributes: [
      { trait_type: "Skin", value: "Aurora" },
      ...nftJson.attributes,
    ],
  },
  {
    ...nftJson,
    name: "The R!ot #17",
    attributes: [{ trait_type: "Skin", value: "Ice" }, ...nftJson.attributes],
  },
  {
    ...nftJson,
    name: "The R!ot #18",
    attributes: [
      { trait_type: "Skin", value: "Red Ether" },
      ...nftJson.attributes,
    ],
  },
  {
    ...nftJson,
    name: "The R!ot #19",
    rarity: "Uncommon",
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

  // const myRippersRequest: NFTsRequest = {
  //   collectionId: `tori-${THE_RIOT_COLLECTION_ADDRESS}`,
  //   // ownerId: selectedWallet?.address ? `tori-${selectedWallet.address}` : "",
  //   ownerId: "",
  //   limit: 20,
  //   offset: 0,
  //   sort: Sort.SORTING_UNSPECIFIED,
  //   sortDirection: SortDirection.SORT_DIRECTION_UNSPECIFIED,
  // };

  // const { nfts: myRippers, fetchMore } = useNFTs(myRippersRequest);

  return {
    // fetchMore,
    myRippers: fakeRippers,
    selectedRippers: [],
  };
};

export default useRippers;
