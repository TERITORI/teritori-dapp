import { useQuery } from "@tanstack/react-query";

import { useBreedingConfig } from "./useBreedingConfig";
import { TeritoriBreedingQueryClient } from "../contracts-clients/teritori-breeding/TeritoriBreeding.client";
import { ConfigResponse as BreedingConfigResponse } from "../contracts-clients/teritori-breeding/TeritoriBreeding.types";
import { TeritoriBunkerMinterQueryClient } from "../contracts-clients/teritori-bunker-minter/TeritoriBunkerMinter.client";
import { TeritoriNameServiceQueryClient } from "../contracts-clients/teritori-name-service/TeritoriNameService.client";
import { TeritoriNftQueryClient } from "../contracts-clients/teritori-nft/TeritoriNft.client";
import { TeritoriNftVaultQueryClient } from "../contracts-clients/teritori-nft-vault/TeritoriNftVault.client";
import { TeritoriMinter__factory } from "../evm-contracts-clients/teritori-bunker-minter/TeritoriMinter__factory";
import { TeritoriNft__factory } from "../evm-contracts-clients/teritori-nft/TeritoriNft__factory";
import { NFTVault__factory } from "../evm-contracts-clients/teritori-nft-vault/NFTVault__factory";
import {
  CosmosNetworkInfo,
  EthereumNetworkInfo,
  getCollectionId,
  mustGetNonSigningCosmWasmClient,
  parseNftId,
  WEI_TOKEN_ADDRESS,
  NetworkKind,
  getUserId,
} from "../networks";
import { getEthereumProvider } from "../utils/ethereum";
import { ipfsURLToHTTPURL } from "../utils/ipfs";
import { nameServiceDefaultImage } from "../utils/tns";
import { NFTAttribute, NFTInfo } from "../utils/types/nft";

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
  const vaultClient = new TeritoriNftVaultQueryClient(
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

const getEthereumStandardNFTInfo = async (
  network: EthereumNetworkInfo,
  minterContractAddress: string,
  tokenId: string,
  userId: string | undefined,
) => {
  const provider = await getEthereumProvider(network);
  if (!provider) {
    throw Error("unable to get ethereum provider");
  }
  const minterClient = TeritoriMinter__factory.connect(
    minterContractAddress,
    provider,
  );

  const nftAddress = await minterClient.callStatic.nft();
  const nftClient = TeritoriNft__factory.connect(nftAddress, provider);
  const collectionName = await nftClient.callStatic.name();
  const contractURI = await nftClient.callStatic.contractURI();
  const collectionMetadata = await fetch(contractURI).then((data) =>
    data.json(),
  );
  const tokenURI = await nftClient.tokenURI(tokenId);
  const metadataURL = ipfsURLToHTTPURL(tokenURI);
  const metadata = await fetch(metadataURL).then((data) => data.json());
  const attributes: NFTAttribute[] = [];
  for (const attr of metadata.attributes) {
    attributes.push({ trait_type: attr.trait_type, value: attr.value });
  }

  const vaultClient = NFTVault__factory.connect(
    network.vaultContractAddress,
    provider,
  );

  const feeNumerator = await vaultClient.callStatic.feeNumerator();
  const feeDenominator = await vaultClient.callStatic.feeDenominator();
  const royalties = feeNumerator.toNumber() / feeDenominator.toNumber();

  const saledNft = await vaultClient.callStatic.nftSales(nftAddress, tokenId);
  let isListed = false;
  let vaultInfo: any = {}; // TODO: Get vault info

  let ownerAddress = await nftClient.callStatic.ownerOf(tokenId);

  if (+saledNft.owner !== 0) {
    isListed = true;
    vaultInfo = {
      amount: saledNft.saleOption.amount.toBigInt(),
      denom: saledNft.saleOption.token,
    };
    ownerAddress = saledNft.owner.toLowerCase();
  }

  const isOwner = userId === getUserId(network.id, ownerAddress);

  const nfo: NFTInfo = {
    name: metadata.name,
    description: metadata.description,
    attributes,
    nftAddress,
    mintAddress: minterContractAddress,
    imageURL: metadata.image,
    tokenId,
    ownerAddress,
    isSeller: isListed && isOwner,
    isListed,
    isOwner,
    canSell: isOwner && !isListed,
    price: vaultInfo?.amount || "",
    priceDenom: vaultInfo?.denom || "",
    collectionName,
    collectionImageURL: collectionMetadata.image,
    mintDenom: WEI_TOKEN_ADDRESS,
    royalty: royalties,
    breedingsAvailable: 0,
    networkId: network.id,
    collectionId: getCollectionId(network.id, minterContractAddress),
  };

  return nfo;
};

const getTeritoriBunkerNFTInfo = async (
  network: CosmosNetworkInfo,
  minterContractAddress: string,
  tokenId: string,
  userId: string | undefined,
  breedingConfig: BreedingConfigResponse | null | undefined,
) => {
  if (!network.vaultContractAddress || !network.riotContractAddressGen1) {
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

  if (breedingConfig?.parent_contract_addr === minterConfig.nft_addr) {
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

  const collectionMetadata = await (
    await fetch(ipfsURLToHTTPURL(minterConfig.nft_base_uri))
  ).json();

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
      await fetch(ipfsURLToHTTPURL(nftInfo.token_uri))
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
  const vaultClient = new TeritoriNftVaultQueryClient(
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
    await fetch(ipfsURLToHTTPURL(breedingConfig.child_base_uri))
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
      await fetch(ipfsURLToHTTPURL(nftInfo.token_uri))
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
  const vaultClient = new TeritoriNftVaultQueryClient(
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
