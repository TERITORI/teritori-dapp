import { useCallback, useEffect, useState } from "react";

import { TeritoriBunkerMinterQueryClient } from "../contracts-clients/teritori-bunker-minter/TeritoriBunkerMinter.client";
import { TeritoriNameServiceQueryClient } from "../contracts-clients/teritori-name-service/TeritoriNameService.client";
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
        const idParts = id.split("-");
        const minterContractAddress = idParts[1];
        const tokenId = idParts.slice(2).join("-");

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

const getStandardNFTInfo = async (
  minterContractAddress: string,
  tokenId: string,
  wallet?: string
) => {
  // We use a CosmWasm non signing Client
  const cosmwasmClient = await getNonSigningCosmWasmClient();

  // ======== Getting minter client
  const minterClient = new TeritoriBunkerMinterQueryClient(
    cosmwasmClient,
    minterContractAddress
  );
  const minterConfig = await minterClient.config();

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
  };

  return nfo;
};
