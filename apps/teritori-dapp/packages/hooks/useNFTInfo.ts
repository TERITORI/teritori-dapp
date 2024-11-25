import { useQuery } from "@tanstack/react-query";
import { z } from "zod";

import { useBreedingConfig } from "./useBreedingConfig";
import { ConfigResponse as BreedingConfigResponse } from "../contracts-clients/teritori-breeding/TeritoriBreeding.types";

import { Metadata as Cw721MembershipMetadata } from "@/contracts-clients/cw721-membership";
import { NftMarketplaceQueryClient } from "@/contracts-clients/nft-marketplace/NftMarketplace.client";
import { TeritoriBreedingQueryClient } from "@/contracts-clients/teritori-breeding/TeritoriBreeding.client";
import { TeritoriBunkerMinterQueryClient } from "@/contracts-clients/teritori-bunker-minter/TeritoriBunkerMinter.client";
import { TeritoriNameServiceQueryClient } from "@/contracts-clients/teritori-name-service/TeritoriNameService.client";
import { TeritoriNftQueryClient } from "@/contracts-clients/teritori-nft/TeritoriNft.client";
import {
  CosmosNetworkInfo,
  getCollectionId,
  mustGetNonSigningCosmWasmClient,
  parseNftId,
  NetworkKind,
  getUserId,
  getNetworkFeature,
  NetworkFeature,
  parseUserId,
} from "@/networks";
import { web3ToWeb2URI } from "@/utils/ipfs";
import { getEthereumStandardNFTInfo } from "@/utils/nft";
import { nameServiceDefaultImage } from "@/utils/tns";
import { NFTAttribute, NFTInfo } from "@/utils/types/nft";

export const useNFTInfo = (nftId: string, userId?: string | undefined) => {
  const [network, minterContractAddress, tokenId] = parseNftId(nftId);

  const { breedingConfig } = useBreedingConfig(network?.id);

  const {
    data: info,
    isInitialLoading,
    refetch,
  } = useQuery(
    ["nftInfo", nftId, userId],
    async () => {
      if (!network) {
        return null;
      }
      switch (network?.kind) {
        case NetworkKind.Ethereum: {
          return await getEthereumStandardNFTInfo(
            network,
            minterContractAddress,
            tokenId,
            userId,
          );
        }
        case NetworkKind.Cosmos: {
          const pmFeature = getNetworkFeature(
            network.id,
            NetworkFeature.CosmWasmPremiumFeed,
          );
          switch (minterContractAddress) {
            case network.nameServiceContractAddress: {
              return await getTNSNFTInfo(
                network,
                minterContractAddress,
                tokenId,
                userId,
              );
            }
            case network.riotContractAddressGen1: {
              return await getTeritoriRiotBreedingNFTInfo(
                network,
                minterContractAddress,
                tokenId,
                userId,
              );
            }
            case pmFeature?.membershipContractAddress: {
              return await getPremiumFeedNFTInfo(network, tokenId, userId);
            }
            default: {
              return await getTeritoriBunkerNFTInfo(
                network,
                minterContractAddress,
                tokenId,
                userId,
                breedingConfig,
              );
            }
          }
        }
        default: {
          return null;
        }
      }
    },
    { enabled: breedingConfig !== undefined },
  );

  return {
    info,
    refresh: refetch,
    notFound: info === null,
    loading: isInitialLoading,
  };
};

const getTNSNFTInfo = async (
  network: CosmosNetworkInfo,
  contractAddress: string,
  tokenId: string,
  userId: string | undefined,
) => {
  if (!network.vaultContractAddress) {
    throw new Error("network not supported");
  }

  // We use a CosmWasm non signing Client
  const cosmwasmClient = await mustGetNonSigningCosmWasmClient(network.id);

  const tnsClient = new TeritoriNameServiceQueryClient(
    cosmwasmClient,
    contractAddress,
  );
  // ======== Getting contract info (For collection name)
  const contractInfo = await tnsClient.contractInfo();
  // ======== Getting NFT info
  const nftInfo = await tnsClient.nftInfo({ tokenId });
  // ======== Getting NFT owner
  const { owner } = await tnsClient.ownerOf({ tokenId });
  // ======== Getting vault stuff (For selling)
  const vaultClient = new NftMarketplaceQueryClient(
    cosmwasmClient,
    network.vaultContractAddress,
  );
  let vaultOwnerAddress;
  let vaultInfo;
  let isListed = false;

  try {
    vaultInfo = await vaultClient.nftInfo({
      nftContractAddr: contractAddress,
      nftTokenId: tokenId,
    });
    vaultOwnerAddress = vaultInfo.owner;
    isListed = true;
  } catch {
    // ======== The NFT is not on sale
  }
  const isOwner =
    !!userId &&
    ((!!owner && getUserId(network.id, owner) === userId) ||
      (!!vaultOwnerAddress &&
        getUserId(network.id, vaultOwnerAddress) === userId));

  // NFT base info
  const nfo: NFTInfo = {
    name: tokenId,
    description: "An username registered on Teritori Name Service",
    attributes: [],
    nftAddress: contractAddress,
    mintAddress: contractAddress,
    imageURL:
      nftInfo.extension.image || nameServiceDefaultImage(false, network) || "",
    tokenId,
    ownerAddress: vaultOwnerAddress || owner,
    isSeller: isListed && isOwner,
    isListed,
    isOwner,
    canSell: isOwner && !isListed,
    price: vaultInfo?.amount || "",
    priceDenom: vaultInfo?.denom || "",
    collectionName: contractInfo.name,
    textInsert: tokenId,
    collectionImageURL: nameServiceDefaultImage(false, network) || "",
    mintDenom: contractInfo.native_denom,
    networkId: network.id,
    royalty: 0,
    collectionId: getCollectionId(network.id, contractAddress),
  };

  return nfo;
};

const zodMinimalCollectionMetadata = z.object({
  image: z.string(),
});

type MinimalColectionMetadata = z.infer<typeof zodMinimalCollectionMetadata>;

const getTeritoriBunkerNFTInfo = async (
  network: CosmosNetworkInfo,
  minterContractAddress: string,
  tokenId: string,
  userId: string | undefined,
  breedingConfig: BreedingConfigResponse | null | undefined,
) => {
  if (!network.vaultContractAddress) {
    throw new Error("network not supported");
  }

  // We use a CosmWasm non signing Client
  const cosmwasmClient = await mustGetNonSigningCosmWasmClient(network.id);

  // ======== Getting minter client
  const minterClient = new TeritoriBunkerMinterQueryClient(
    cosmwasmClient,
    minterContractAddress,
  );
  const minterConfig = await minterClient.config();

  let breedingsAvailable;

  if (
    network.riotContractAddressGen1 &&
    breedingConfig?.parent_contract_addr === minterConfig.nft_addr
  ) {
    const breedingClient = new TeritoriBreedingQueryClient(
      cosmwasmClient,
      network.riotContractAddressGen1,
    );

    const breededCount = await breedingClient.breededCount({
      parentNftTokenId: tokenId,
    });

    breedingsAvailable = Math.max(
      (breedingConfig.breed_count_limit || 0) - breededCount,
      0,
    );
  }

  const collectionMetadataURI = web3ToWeb2URI(minterConfig.nft_base_uri);
  let collectionMetadata: MinimalColectionMetadata;
  try {
    collectionMetadata = zodMinimalCollectionMetadata.parse(
      await (await fetch(collectionMetadataURI)).json(),
    );
  } catch (e) {
    console.warn(
      "failed to get minimal collection metadata:",
      collectionMetadataURI,
      e,
    );
    collectionMetadata = { image: "" };
  }

  // ======== Getting NFT client
  const nftClient = new TeritoriNftQueryClient(
    cosmwasmClient,
    minterConfig.nft_addr,
  );
  // ======== Getting contract info (For collection name)
  const contractInfo = await nftClient.contractInfo();
  // ======== Getting NFT info
  const nftInfo = await nftClient.nftInfo({ tokenId });
  let name = "";
  let description = "";
  let image = "";
  let attributes = [];
  let royalties = 0;
  if (nftInfo.token_uri) {
    const nftMetadata = await (
      await fetch(web3ToWeb2URI(nftInfo.token_uri))
    ).json();
    name = nftMetadata.name;
    image = nftMetadata.image;
    description = nftMetadata.description;
    attributes = nftMetadata.attributes;
  } else if (nftInfo.extension?.image) {
    name = (nftInfo.extension.name as any) || "";
    image = (nftInfo.extension.image as any) || "";
    description = (nftInfo.extension.description as any) || "";
    attributes = (nftInfo.extension.attributes as any) || [];
    royalties = ((nftInfo.extension.royalty_percentage as number) || 0) / 100;
  }
  // ======== Getting NFT owner
  const { owner } = await nftClient.ownerOf({ tokenId });
  // ======== Getting NFT metadata

  // ======== Getting vault stuff (For selling)
  const vaultClient = new NftMarketplaceQueryClient(
    cosmwasmClient,
    network.vaultContractAddress,
  );
  let vaultOwnerAddress;
  let vaultInfo;
  let isListed = false;

  try {
    vaultInfo = await vaultClient.nftInfo({
      nftContractAddr: minterConfig.nft_addr,
      nftTokenId: tokenId,
    });
    vaultOwnerAddress = vaultInfo.owner;
    isListed = true;
  } catch {
    // ======== The NFT is not on sale
  }
  const isOwner =
    !!userId &&
    ((!!owner && getUserId(network.id, owner) === userId) ||
      (!!vaultOwnerAddress &&
        getUserId(network.id, vaultOwnerAddress) === userId));

  // NFT base info
  const nfo: NFTInfo = {
    name,
    description,
    attributes,
    nftAddress: minterConfig.nft_addr,
    mintAddress: minterContractAddress,
    imageURL: image,
    tokenId,
    ownerAddress: vaultOwnerAddress || owner,
    isSeller: isListed && isOwner,
    isListed,
    isOwner,
    canSell: isOwner && !isListed,
    price: vaultInfo?.amount || "",
    priceDenom: vaultInfo?.denom || "",
    collectionName: contractInfo.name,
    collectionImageURL: collectionMetadata.image,
    mintDenom: minterConfig.price_denom,
    royalty: royalties,
    breedingsAvailable,
    networkId: network.id,
    collectionId: getCollectionId(network.id, minterContractAddress),
  };

  return nfo;
};

const getTeritoriRiotBreedingNFTInfo = async (
  network: CosmosNetworkInfo,
  minterContractAddress: string,
  tokenId: string,
  userId: string | undefined,
) => {
  if (!network.vaultContractAddress) {
    throw new Error("network not supported");
  }

  // We use a CosmWasm non signing Client
  const cosmwasmClient = await mustGetNonSigningCosmWasmClient(network.id);

  // ======== Getting breeding client
  const breedingClient = new TeritoriBreedingQueryClient(
    cosmwasmClient,
    minterContractAddress,
  );
  const breedingConfig = await breedingClient.config();

  const collectionMetadata = await (
    await fetch(web3ToWeb2URI(breedingConfig.child_base_uri))
  ).json();

  // ======== Getting NFT client
  const nftClient = new TeritoriNftQueryClient(
    cosmwasmClient,
    breedingConfig.child_contract_addr,
  );
  // ======== Getting contract info (For collection name)
  const contractInfo = await nftClient.contractInfo();
  // ======== Getting NFT info
  const nftInfo = await nftClient.nftInfo({ tokenId });
  let name = "";
  let description = "";
  let image = "";
  let attributes = [];
  let royalties = 0;
  if (nftInfo.token_uri) {
    const nftMetadata = await (
      await fetch(web3ToWeb2URI(nftInfo.token_uri))
    ).json();
    name = nftMetadata.name;
    image = nftMetadata.image;
    description = nftMetadata.description;
    attributes = nftMetadata.attributes;
  } else if (nftInfo.extension?.image) {
    name = (nftInfo.extension.name as any) || "";
    image = (nftInfo.extension.image as any) || "";
    description = (nftInfo.extension.description as any) || "";
    attributes = (nftInfo.extension.attributes as any) || [];
    royalties = ((nftInfo.extension.royalty_percentage as number) || 0) / 100;
  }
  // ======== Getting NFT owner
  const { owner } = await nftClient.ownerOf({ tokenId });
  // ======== Getting NFT metadata

  // ======== Getting vault stuff (For selling)
  const vaultClient = new NftMarketplaceQueryClient(
    cosmwasmClient,
    network.vaultContractAddress,
  );
  let vaultOwnerAddress;
  let vaultInfo;
  let isListed = false;

  try {
    vaultInfo = await vaultClient.nftInfo({
      nftContractAddr: breedingConfig.child_contract_addr,
      nftTokenId: tokenId,
    });
    vaultOwnerAddress = vaultInfo.owner;
    isListed = true;
  } catch {
    // ======== The NFT is not on sale
  }
  const isOwner =
    !!userId &&
    ((!!owner && getUserId(network.id, owner) === userId) ||
      (!!vaultOwnerAddress &&
        getUserId(network.id, vaultOwnerAddress) === userId));

  // NFT base info
  const nfo: NFTInfo = {
    name,
    description,
    attributes,
    nftAddress: breedingConfig.child_contract_addr,
    mintAddress: minterContractAddress,
    imageURL: image,
    tokenId,
    ownerAddress: vaultOwnerAddress || owner,
    isSeller: isListed && isOwner,
    isListed,
    isOwner,
    canSell: isOwner && !isListed,
    price: vaultInfo?.amount || "",
    priceDenom: vaultInfo?.denom || "",
    collectionName: contractInfo.name,
    collectionImageURL: collectionMetadata.image,
    mintDenom: "utori",
    royalty: royalties,
    networkId: network.id,
    collectionId: getCollectionId(network.id, minterContractAddress),
  };

  return nfo;
};

const getPremiumFeedNFTInfo = async (
  network: CosmosNetworkInfo,
  tokenId: string,
  userId: string | undefined,
) => {
  const pmFeature = getNetworkFeature(
    network.id,
    NetworkFeature.CosmWasmPremiumFeed,
  );
  if (!pmFeature) {
    throw new Error("This network does not support premium feed");
  }
  const cosmwasmClient = await mustGetNonSigningCosmWasmClient(network.id);
  const nftClient = new TeritoriNftQueryClient(
    cosmwasmClient,
    pmFeature.membershipContractAddress,
  );
  const { info: nftInfo, access } = await nftClient.allNftInfo({ tokenId });
  const metadata = nftInfo.extension as Cw721MembershipMetadata;

  const vaultInfo = await getNFTVaultInfo(
    network,
    pmFeature.membershipContractAddress,
    tokenId,
  );

  const [, userAddr] = parseUserId(userId);
  const owner =
    (!!vaultInfo.vaultOwnerAddress && vaultInfo.vaultOwnerAddress) ||
    access.owner;
  const isOwner = !!userAddr && owner === userAddr;

  const nfo: NFTInfo = {
    name: metadata.name || "",
    description: metadata.description || "",
    nftAddress: pmFeature.membershipContractAddress,
    imageURL: metadata.image || "",
    tokenId,
    isOwner,
    isSeller: vaultInfo.isListed && isOwner,
    isListed: vaultInfo.isListed,
    collectionName: "Premium Memberships", // FIXME: get from collection config
    collectionImageURL:
      "ipfs://bafybeiaznarsgwk7stav6qrzjnwqw4j7eu7drm3xx4p3fokgsnrouelse4", // FIXME: get from collection config
    mintDenom: pmFeature.mintDenom,
    royalty: 0,
    networkId: network.id,
    collectionId: getCollectionId(
      network.id,
      pmFeature.membershipContractAddress,
    ),
    canSell: isOwner && !vaultInfo.isListed,
    price: vaultInfo.vaultInfo?.amount || "0",
    priceDenom: vaultInfo.vaultInfo?.denom || "",
    mintAddress: pmFeature.membershipContractAddress,
    ownerAddress: owner,
    attributes: (metadata.attributes || []).map((attr) => {
      const frontAttr: NFTAttribute = {
        trait_type: attr.trait_type,
        value: attr.value,
        display_type: attr.display_type || undefined,
      };
      return frontAttr;
    }),
  };
  return nfo;
};

const getNFTVaultInfo = async (
  network: CosmosNetworkInfo,
  nftContractAddr: string,
  tokenId: string,
) => {
  if (!network.vaultContractAddress) {
    throw new Error("network not supported");
  }
  const cosmwasmClient = await mustGetNonSigningCosmWasmClient(network.id);
  const vaultClient = new NftMarketplaceQueryClient(
    cosmwasmClient,
    network.vaultContractAddress,
  );
  let vaultOwnerAddress;
  let vaultInfo;
  let isListed = false;

  try {
    vaultInfo = await vaultClient.nftInfo({
      nftContractAddr,
      nftTokenId: tokenId,
    });
    vaultOwnerAddress = vaultInfo.owner;
    isListed = true;
  } catch {
    // ======== The NFT is not on sale
  }

  return {
    vaultOwnerAddress,
    vaultInfo,
    isListed,
  };
};
