import { useCallback, useEffect, useState } from "react";

import { TeritoriBreedingQueryClient } from "../contracts-clients/teritori-breeding/TeritoriBreeding.client";
import { ConfigResponse as BreedingConfigResponse } from "../contracts-clients/teritori-breeding/TeritoriBreeding.types";
import { TeritoriBunkerMinterQueryClient } from "../contracts-clients/teritori-bunker-minter/TeritoriBunkerMinter.client";
import { TeritoriNameServiceQueryClient } from "../contracts-clients/teritori-name-service/TeritoriNameService.client";
import { TeritoriNftVaultQueryClient } from "../contracts-clients/teritori-nft-vault/TeritoriNftVault.client";
import { TeritoriNftQueryClient } from "../contracts-clients/teritori-nft/TeritoriNft.client";
import { TeritoriMinter__factory } from "../evm-contracts-clients/teritori-bunker-minter/TeritoriMinter__factory";
import { NFTVault__factory } from "../evm-contracts-clients/teritori-nft-vault/NFTVault__factory";
import { WEI_TOKEN_ADDRESS } from "../networks";
import { NFTInfo } from "../screens/Marketplace/NFTDetailScreen";
import { getEthereumProvider } from "../utils/ethereum";
import { ipfsURLToHTTPURL } from "../utils/ipfs";
import { getNonSigningCosmWasmClient } from "../utils/keplr";
import { Network } from "../utils/network";
import { vaultContractAddress } from "../utils/teritori";
import { TeritoriNft__factory } from "./../evm-contracts-clients/teritori-nft/TeritoriNft__factory";
import { NFTAttribute } from "./../utils/types/nft";
import { useBreedingConfig } from "./useBreedingConfig";
import { useSelectedNetwork } from "./useSelectedNetwork";

export const useNFTInfo = (id: string, wallet: string | undefined) => {
  const [info, setInfo] = useState<NFTInfo>();
  const [refreshIndex, setRefreshIndex] = useState(0);
  const [notFound, setNotFound] = useState(false);
  const [loading, setLoading] = useState(false);
  const selectedNetwork = useSelectedNetwork();

  const breedingConfig = useBreedingConfig();

  const refresh = useCallback(() => {
    setRefreshIndex((i) => i + 1);
  }, []);

  useEffect(() => {
    const effect = async () => {
      setLoading(true);
      try {
        const idParts = id.split("-");
        const minterContractAddress = idParts[1];
        const tokenId = idParts.slice(2).join("-");

        let nfo: NFTInfo;
        switch (minterContractAddress) {
          case process.env.TERITORI_NAME_SERVICE_CONTRACT_ADDRESS:
            nfo = await getTNSNFTInfo(minterContractAddress, tokenId, wallet);
            break;
          case process.env.THE_RIOT_BREEDING_CONTRACT_ADDRESS:
            nfo = await getRiotBreedingNFTInfo(
              minterContractAddress,
              tokenId,
              wallet
            );
            break;
          default:
            if (selectedNetwork === Network.Ethereum) {
              nfo = await getEthereumStandardNFTInfo(
                minterContractAddress,
                tokenId,
                wallet
              );
            } else {
              nfo = await getStandardNFTInfo(
                minterContractAddress,
                tokenId,
                wallet,
                breedingConfig
              );
            }
        }

        setInfo(nfo);
        setNotFound(false);
        setLoading(false);
      } catch (err) {
        setNotFound(true);
        setLoading(false);
        console.error(err);
      }
    };
    effect();
  }, [id, wallet, refreshIndex, breedingConfig]);

  return { info, refresh, notFound, loading };
};

const getTNSNFTInfo = async (
  contractAddress: string,
  tokenId: string,
  wallet?: string
) => {
  // We use a CosmWasm non signing Client
  const cosmwasmClient = await getNonSigningCosmWasmClient();

  const tnsClient = new TeritoriNameServiceQueryClient(
    cosmwasmClient,
    contractAddress
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
    vaultContractAddress
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
    !!wallet &&
    ((!!owner && owner === wallet) ||
      (!!vaultOwnerAddress && vaultOwnerAddress === wallet));

  // NFT base info
  const nfo: NFTInfo = {
    name: tokenId,
    description: "An username registered on Teritori Name Service",
    attributes: [],
    nftAddress: contractAddress,
    mintAddress: contractAddress,
    imageURL: ipfsURLToHTTPURL(
      nftInfo.extension.image
        ? nftInfo.extension.image
        : process.env.TERITORI_NAME_SERVICE_DEFAULT_IMAGE_URL || ""
    ),
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
    collectionImageURL: ipfsURLToHTTPURL(
      process.env.TERITORI_NAME_SERVICE_DEFAULT_IMAGE_URL || ""
    ),
    mintDenom: contractInfo.native_denom,
    royalty: 0,
  };

  return nfo;
};

const getEthereumStandardNFTInfo = async (
  minterContractAddress: string,
  tokenId: string,
  wallet: string | undefined
) => {
  const provider = await getEthereumProvider();
  if (!provider) {
    throw Error("unable to get ethereum provider");
  }
  const minterClient = await TeritoriMinter__factory.connect(
    minterContractAddress,
    provider
  );

  const nftAddress = await minterClient.callStatic.nft();
  const nftClient = await TeritoriNft__factory.connect(nftAddress, provider);
  const collectionName = await nftClient.callStatic.name();
  const contractURI = await nftClient.callStatic.contractURI();
  const collectionMetadata = await fetch(contractURI).then((data) =>
    data.json()
  );
  const metadata = await nftClient.nftInfo(tokenId);

  const attributes: NFTAttribute[] = [];
  for (const attr of metadata.attributes) {
    attributes.push({ trait_type: attr.trait_type, value: attr.value });
  }

  const vaultClient = await NFTVault__factory.connect(
    process.env.ETHEREUM_VAULT_ADDRESS || "",
    provider
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

  const isOwner = wallet?.toLowerCase() === ownerAddress.toLowerCase();

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
  };

  return nfo;
};

const getStandardNFTInfo = async (
  minterContractAddress: string,
  tokenId: string,
  wallet: string | undefined,
  breedingConfig: BreedingConfigResponse | undefined
) => {
  // We use a CosmWasm non signing Client
  const cosmwasmClient = await getNonSigningCosmWasmClient();

  // ======== Getting minter client
  const minterClient = new TeritoriBunkerMinterQueryClient(
    cosmwasmClient,
    minterContractAddress
  );
  const minterConfig = await minterClient.config();

  let breedingsAvailable;

  if (breedingConfig?.parent_contract_addr === minterConfig.nft_addr) {
    const breedingClient = new TeritoriBreedingQueryClient(
      cosmwasmClient,
      process.env.THE_RIOT_BREEDING_CONTRACT_ADDRESS || ""
    );

    const breededCount = await breedingClient.breededCount({
      parentNftTokenId: tokenId,
    });

    breedingsAvailable = Math.max(
      (breedingConfig?.breed_count_limit || 0) - breededCount,
      0
    );
  }

  const collectionMetadata = await (
    await fetch(ipfsURLToHTTPURL(minterConfig.nft_base_uri))
  ).json();

  // ======== Getting NFT client
  const nftClient = new TeritoriNftQueryClient(
    cosmwasmClient,
    minterConfig.nft_addr
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
    name = (nftInfo.extension?.name as any) || "";
    image = (nftInfo.extension?.image as any) || "";
    description = (nftInfo.extension?.description as any) || "";
    attributes = (nftInfo.extension?.attributes as any) || [];
    royalties = ((nftInfo.extension?.royalty_percentage as number) || 0) / 100;
  }
  // ======== Getting NFT owner
  const { owner } = await nftClient.ownerOf({ tokenId });
  // ======== Getting NFT metadata

  // ======== Getting vault stuff (For selling)
  const vaultClient = new TeritoriNftVaultQueryClient(
    cosmwasmClient,
    vaultContractAddress
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
    !!wallet &&
    ((!!owner && owner === wallet) ||
      (!!vaultOwnerAddress && vaultOwnerAddress === wallet));

  // NFT base info
  const nfo: NFTInfo = {
    name,
    description,
    attributes,
    nftAddress: minterConfig.nft_addr,
    mintAddress: minterContractAddress,
    imageURL: ipfsURLToHTTPURL(image),
    tokenId,
    ownerAddress: vaultOwnerAddress || owner,
    isSeller: isListed && isOwner,
    isListed,
    isOwner,
    canSell: isOwner && !isListed,
    price: vaultInfo?.amount || "",
    priceDenom: vaultInfo?.denom || "",
    collectionName: contractInfo.name,
    collectionImageURL: ipfsURLToHTTPURL(collectionMetadata.image),
    mintDenom: minterConfig.price_denom,
    royalty: royalties,
    breedingsAvailable,
  };

  return nfo;
};

const getRiotBreedingNFTInfo = async (
  minterContractAddress: string,
  tokenId: string,
  wallet: string | undefined
) => {
  // We use a CosmWasm non signing Client
  const cosmwasmClient = await getNonSigningCosmWasmClient();

  // ======== Getting breeding client
  const breedingClient = new TeritoriBreedingQueryClient(
    cosmwasmClient,
    minterContractAddress
  );
  const breedingConfig = await breedingClient.config();

  const collectionMetadata = await (
    await fetch(ipfsURLToHTTPURL(breedingConfig.child_base_uri))
  ).json();

  // ======== Getting NFT client
  const nftClient = new TeritoriNftQueryClient(
    cosmwasmClient,
    breedingConfig.child_contract_addr
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
    name = (nftInfo.extension?.name as any) || "";
    image = (nftInfo.extension?.image as any) || "";
    description = (nftInfo.extension?.description as any) || "";
    attributes = (nftInfo.extension?.attributes as any) || [];
    royalties = ((nftInfo.extension?.royalty_percentage as number) || 0) / 100;
  }
  // ======== Getting NFT owner
  const { owner } = await nftClient.ownerOf({ tokenId });
  // ======== Getting NFT metadata

  // ======== Getting vault stuff (For selling)
  const vaultClient = new TeritoriNftVaultQueryClient(
    cosmwasmClient,
    vaultContractAddress
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
    !!wallet &&
    ((!!owner && owner === wallet) ||
      (!!vaultOwnerAddress && vaultOwnerAddress === wallet));

  // NFT base info
  const nfo: NFTInfo = {
    name,
    description,
    attributes,
    nftAddress: breedingConfig.child_contract_addr,
    mintAddress: minterContractAddress,
    imageURL: ipfsURLToHTTPURL(image),
    tokenId,
    ownerAddress: vaultOwnerAddress || owner,
    isSeller: isListed && isOwner,
    isListed,
    isOwner,
    canSell: isOwner && !isListed,
    price: vaultInfo?.amount || "",
    priceDenom: vaultInfo?.denom || "",
    collectionName: contractInfo.name,
    collectionImageURL: ipfsURLToHTTPURL(collectionMetadata.image),
    mintDenom: "utori",
    royalty: royalties,
  };

  return nfo;
};
