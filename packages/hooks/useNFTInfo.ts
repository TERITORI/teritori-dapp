import { useCallback, useEffect, useState } from "react";

import { TeritoriNftMinterQueryClient } from "../contracts-clients/teritori-nft-minter/TeritoriNftMinter.client";
import { TeritoriNftVaultQueryClient } from "../contracts-clients/teritori-nft-vault/TeritoriNftVault.client";
import { TeritoriNftQueryClient } from "../contracts-clients/teritori-nft/TeritoriNft.client";
import { NFTInfo } from "../screens/Marketplace/NFTDetailScreen";
import { ipfsURLToHTTPURL } from "../utils/ipfs";
import { getNonSigningCosmWasmClient } from "../utils/keplr";

export const vaultContractAddress =
  "tori17ww32dvhrxa9ga57vk65dzu8746nm0cqlqxq06zfrkd0wffpkleslfmjtq";

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
        // Getting the correct contract address by removing the prefix
        const idParts = id.substring(5).split("-");
        const minterContractAddress = idParts[0];
        // Getting the token ID (suffix)
        const tokenId = idParts[1];
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
          return;
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
          ownerAddress: owner,
          isSeller: isListed && isOwner,
          isListed,
          isOwner,
          canSell: isOwner && !isListed,
          price: vaultInfo?.amount || "",
          priceDenom: vaultInfo?.denom || "",
          collectionName: contractInfo.name,
        };
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
