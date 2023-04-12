import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

import { TeritoriBreedingQueryClient } from "../contracts-clients/teritori-breeding/TeritoriBreeding.client";
import { TeritoriBunkerMinterQueryClient } from "../contracts-clients/teritori-bunker-minter/TeritoriBunkerMinter.client";
import { TeritoriNftQueryClient } from "../contracts-clients/teritori-nft/TeritoriNft.client";
import {
  CosmosNetworkInfo,
  mustGetNonSigningCosmWasmClient,
  parseNetworkObjectId,
  NetworkKind,
} from "../networks";
import { ipfsURLToHTTPURL } from "../utils/ipfs";
import {
  CollectionInfoHeader,
  CollectionInfoThumb,
} from "../utils/types/collections";

export type MintState = "not-started" | "whitelist" | "public-sale" | "ended";

const getTeritoriBreedingCollectionInfo = async (
  network: CosmosNetworkInfo,
  mintAddress: string
) => {
  const cosmwasm = await mustGetNonSigningCosmWasmClient(network.id);

  const breedingClient = new TeritoriBreedingQueryClient(cosmwasm, mintAddress);
  const conf = await breedingClient.config();
  const nftClient = new TeritoriNftQueryClient(
    cosmwasm,
    conf.child_contract_addr
  );
  const nftInfo = await nftClient.contractInfo();
  const metadataURL = ipfsURLToHTTPURL(conf.child_base_uri);
  const metadataReply = await fetch(metadataURL);
  const metadata = await metadataReply.json();

  const info: CollectionInfoHeader = {
    name: nftInfo.name,
    image: ipfsURLToHTTPURL(metadata.image || ""),
    discord: metadata.discord,
    twitter: metadata.twitter,
    website: metadata.website,
    bannerImage: ipfsURLToHTTPURL(metadata.banner),
  };
  return info;
};

const getCosmosBunkerCollectionInfo = async (
  network: CosmosNetworkInfo,
  mintAddress: string
) => {
  const cosmwasm = await mustGetNonSigningCosmWasmClient(network.id);
  const minterClient = new TeritoriBunkerMinterQueryClient(
    cosmwasm,
    mintAddress
  );
  const conf = await minterClient.config();
  const nftClient = new TeritoriNftQueryClient(cosmwasm, conf.nft_addr);
  const nftInfo = await nftClient.contractInfo();
  const metadataURL = ipfsURLToHTTPURL(conf.nft_base_uri);
  const metadataReply = await fetch(metadataURL);
  const metadata = await metadataReply.json();

  const info: CollectionInfoHeader = {
    name: nftInfo.name,
    image: ipfsURLToHTTPURL(metadata.image || ""),
    discord: metadata.discord,
    twitter: metadata.twitter,
    website: metadata.website,
    bannerImage: ipfsURLToHTTPURL(metadata.banner),
  };
  return info;
};

// NOTE: consider using the indexer for this
export const useCollectionInfoHeader = (id: string) => {
  const [network, mintAddress] = parseNetworkObjectId(id);
  const [thumb, setThumb] = useState<CollectionInfoThumb>();

  const { data, error, refetch } = useQuery(
    ["collectionInfoHeader", id],
    async (): Promise<CollectionInfoHeader> => {
      let info: CollectionInfoHeader = {};
      try {
        if (!network || network.kind !== NetworkKind.Cosmos) {
          return info;
        }
        switch (mintAddress) {
          case network.riotContractAddressGen1:
            info = await getTeritoriBreedingCollectionInfo(
              network,
              mintAddress
            );
            break;
          default:
            info = await getCosmosBunkerCollectionInfo(network, mintAddress);
            break;
        }
        setThumb({
          name: info.name,
          image: info.image,
        });
      } catch (e) {
        console.error(e);
      }

      return info;
    },
    { refetchInterval: Infinity, staleTime: Infinity }
  );

  return {
    info: data,
    notFound: !!error,
    refetchCollectionInfo: refetch,
    thumb,
  };
};
