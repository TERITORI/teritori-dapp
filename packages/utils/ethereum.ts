import detectEthereumProvider from "@metamask/detect-provider";
import { ethers, Signer } from "ethers";

import { Collection } from "../api/marketplace/v1/marketplace";
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

export const getMetaMaskEthereumSigner = async () => {
  const provider = await getMetaMaskEthereumProvider();
  if (!provider) return null;

  // Force type to be compatible with contract client generated from typechain
  // web3Provider.getSigner() returns JsonRpcSigner which  extends from Signer
  return provider.getSigner() as Signer;
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

// NOTE: cache json request to not request again the same data, cannot use react-query hook here
type MetadataCache = {
  [id: string]: {
    image: string;
  };
};
const metadataCaches: MetadataCache = {};

export const addCollectionMetadatas = async (collections: Collection[]) => {
  const collectionWithMetadatas: Collection[] = [];
  for (const collection of collections) {
    if (!collection.id.startsWith("eth-")) continue;

    let metadata;
    if (!(collection.id in metadataCaches)) {
      metadata = await getCollectionMetadata(collection.id);
      metadataCaches[collection.id] = metadata;
    }

    if (metadataCaches[collection.id]) {
      collection.imageUri = metadataCaches[collection.id].image;
    }

    collectionWithMetadatas.push(collection);
  }

  return collectionWithMetadatas;
};
