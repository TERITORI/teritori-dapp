import { useCallback, useEffect, useState } from "react";

import { TeritoriNameServiceQueryClient } from "../contracts-clients/teritori-name-service/TeritoriNameService.client";
import { TeritoriNftMinterQueryClient } from "../contracts-clients/teritori-nft-minter/TeritoriNftMinter.client";
import { TeritoriNftVaultQueryClient } from "../contracts-clients/teritori-nft-vault/TeritoriNftVault.client";
import { TeritoriNftQueryClient } from "../contracts-clients/teritori-nft/TeritoriNft.client";
import { NFTInfo } from "../screens/Marketplace/NFTDetailScreen";
import { ipfsURLToHTTPURL } from "../utils/ipfs";
import { getNonSigningCosmWasmClient } from "../utils/keplr";
import { vaultContractAddress } from "../utils/teritori";

export const useNFTInfo = (id: string, wallet: string | undefined) => {
  const [info, setInfo] = useState<NFTInfo>();
  const [refreshIndex, setRefreshIndex] = useState(0);
  const [notFound, setNotFound] = useState(false);
  const [loading, setLoading] = useState(false);

  const refresh = useCallback(() => {
    setRefreshIndex((i) => i + 1);
  }, []);

  useEffect(() => {
    const effect = async () => {
      setLoading(true);
      try {
        const idParts = id.substring(5).split("-");
        const minterContractAddress = idParts[0];
        const tokenId = idParts[1];

        let nfo;
        if (
          minterContractAddress ===
          process.env.TERITORI_NAME_SERVICE_CONTRACT_ADDRESS
        ) {
          nfo = await getTNSNFTInfo(minterContractAddress, tokenId, wallet);
        } else {
          nfo = await getStandardNFTInfo(
            minterContractAddress,
            tokenId,
            wallet
          );
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
  }, [id, wallet, refreshIndex]);

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

  console.log("nftInfo", nftInfo);

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
    vaultOwnerAddress = await vaultClient.nftOwnerInfo({
      nftContractAddr: contractAddress,
      nftTokenId: tokenId,
    });
    vaultInfo = await vaultClient.nftInfo({
      nftContractAddr: contractAddress,
      nftTokenId: tokenId,
      wallet: vaultOwnerAddress,
    });
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
  };

  return nfo;
};

const getStandardNFTInfo = async (
  minterContractAddress: string,
  tokenId: string,
  wallet?: string
) => {
  // We use a CosmWasm non signing Client
  const cosmwasmClient = await getNonSigningCosmWasmClient();

  // ======== Getting minter client
  const minterClient = new TeritoriNftMinterQueryClient(
    cosmwasmClient,
    minterContractAddress
  );
  const minterConfig = await minterClient.config();
  // ======== Getting NFT client
  const nftClient = new TeritoriNftQueryClient(
    cosmwasmClient,
    minterConfig.nft_addr
  );
  // ======== Getting contract info (For collection name)
  const contractInfo = await nftClient.contractInfo();
  // ======== Getting NFT info
  const nftInfo = await nftClient.nftInfo({ tokenId });
  if (!nftInfo.token_uri) {
    throw new Error("no token uri");
  }
  // ======== Getting NFT owner
  const { owner } = await nftClient.ownerOf({ tokenId });
  // ======== Getting NFT metadata
  const nftMetadata = await (
    await fetch(ipfsURLToHTTPURL(nftInfo.token_uri))
  ).json();
  // ======== Getting vault stuff (For selling)
  const vaultClient = new TeritoriNftVaultQueryClient(
    cosmwasmClient,
    vaultContractAddress
  );
  let vaultOwnerAddress;
  let vaultInfo;
  let isListed = false;

  try {
    vaultOwnerAddress = await vaultClient.nftOwnerInfo({
      nftContractAddr: minterConfig.nft_addr,
      nftTokenId: tokenId,
    });
    vaultInfo = await vaultClient.nftInfo({
      nftContractAddr: minterConfig.nft_addr,
      nftTokenId: tokenId,
      wallet: vaultOwnerAddress,
    });
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
    name: nftMetadata.name,
    description: nftMetadata.description,
    attributes: nftMetadata.attributes,
    nftAddress: minterConfig.nft_addr,
    mintAddress: minterContractAddress,
    imageURL: ipfsURLToHTTPURL(nftMetadata.image),
    tokenId,
    ownerAddress: vaultOwnerAddress || owner,
    isSeller: isListed && isOwner,
    isListed,
    isOwner,
    canSell: isOwner && !isListed,
    price: vaultInfo?.amount || "",
    priceDenom: vaultInfo?.denom || "",
    collectionName: contractInfo.name,
  };

  return nfo;
};
