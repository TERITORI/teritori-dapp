import detectEthereumProvider from "@metamask/detect-provider";
import { ethers, Signer } from "ethers";

import { Attribute, Collection, NFT } from "../api/marketplace/v1/marketplace";
import { TeritoriMinter__factory } from "./../evm-contracts-clients/teritori-bunker-minter/TeritoriMinter__factory";
import { TeritoriNft__factory } from "./../evm-contracts-clients/teritori-nft/TeritoriNft__factory";

export const getMetaMaskEthereumProvider = async () => {
  const provider = await detectEthereumProvider();
  if (!provider) return null;

  return new ethers.providers.Web3Provider(provider);
};

// TODO: use chain provider in case we have not metamask installed
export const getEthereumProvider = async () => {
  return getMetaMaskEthereumProvider();
};

export const getMetaMaskEthereumSigner = async (address?: string) => {
  const provider = await getMetaMaskEthereumProvider();
  if (!provider) return null;

  // Force type to be compatible with contract client generated from typechain
  // web3Provider.getSigner() returns JsonRpcSigner which  extends from Signer
  return provider.getSigner(address) as Signer;
};

export const addCollectionMetadatas = async (collections: Collection[]) => {
  const collectionWithMetadatas: Collection[] = [];
  for (const collection of collections) {
    if (!collection.id.startsWith("eth-")) continue;

    const metadata = await getCollectionMetadata(collection.id);
    collection.imageUri = metadata.image;
    collectionWithMetadatas.push(collection);
  }

  return collectionWithMetadatas;
};

export const addNftMetadatas = async (nfts: NFT[]) => {
  const nftWithMetadatas: NFT[] = [];
  const provider = await getEthereumProvider();
  if (!provider) return nfts;

  for (const nft of nfts) {
    if (!nft.id.startsWith("eth-")) continue;

    try {
      const nftClient = await TeritoriNft__factory.connect(
        nft.nftContractAddress,
        provider
      );

      const nftTokenId = nft.id.split("-")[2];
      const info = await nftClient.callStatic.nftInfo(nftTokenId);

      if (info) {
        const attributes: Attribute[] = [];
        for (const attr of info.attributes) {
          attributes.push({ traitType: attr.trait_type, value: attr.value });
        }

        nft.attributes = attributes;
        nft.name = info.name;
        nft.imageUri = info.image;
      }
    } catch (e) {
      console.error(e);
    }

    nftWithMetadatas.push(nft);
  }

  return nftWithMetadatas;
};

export const getCollectionMetadata = async (collectionId: string) => {
  const minter = collectionId.replace("eth-", "");
  const provider = await getEthereumProvider();
  if (!provider) return;

  try {
    const minterClient = await TeritoriMinter__factory.connect(
      minter,
      provider
    );
    const nftAddress = await minterClient.callStatic.nft();
    const nftClient = await TeritoriNft__factory.connect(nftAddress, provider);
    const contractURI = await nftClient.callStatic.contractURI();
    return await fetch(contractURI).then((res) => res.json());
  } catch (e) {
    console.warn(e);
  }
};
