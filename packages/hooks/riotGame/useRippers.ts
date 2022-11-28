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

const RIOT_CONTRACT = process.env.THE_RIOT_COLLECTION_ADDRESS || "";
const LIMIT = 10;

const useRippers = () => {
  const { client, queryClient, selectedWallet } = useContractClients(
    RIOT_CONTRACT,
    TeritoriNftClient,
    TeritoriNftQueryClient
  );
  const tetitoriNFTClient = client as TeritoriNftClient;
  const tetitoriNFTQueryClient = queryClient as TeritoriNftQueryClient;

  const myRioters = async () => {
    if (!tetitoriNFTQueryClient) return [];

    const owner = selectedWallet?.address;
    if (!owner) return [];

    const NFTs = await tetitoriNFTQueryClient.tokens({
      limit: LIMIT,
      owner,
    });
    console.log(NFTs, "================");
  };

  useEffect(() => {
    myRioters();
  }, [tetitoriNFTQueryClient]);

  return {
    myRippers: fakeRippers,
    selectedRippers: [],
  };
};

export default useRippers;
