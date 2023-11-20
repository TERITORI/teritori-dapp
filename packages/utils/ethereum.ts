import detectEthereumProvider from "@metamask/detect-provider";
import { ethers } from "ethers";

import { TeritoriMinter__factory } from "./../evm-contracts-clients/teritori-bunker-minter/TeritoriMinter__factory";
import { TeritoriNft__factory } from "./../evm-contracts-clients/teritori-nft/TeritoriNft__factory";
import { ipfsURLToHTTPURL } from "./ipfs";
import { Attribute, Collection, NFT } from "../api/marketplace/v1/marketplace";
import {
  EthereumNetworkInfo,
  parseNetworkObjectId,
  parseNftId,
  NetworkKind,
} from "../networks";

// this is used to block all calls to the provider getter while we wait for network switch auth
const proms: {
  [key: string]: Promise<ethers.providers.Web3Provider | null> | undefined;
} = {};

const getMetaMaskEthereumProvider = async (
  network: ethers.providers.Networkish,
) => {
  let provider;
  try {
    provider = await detectEthereumProvider({ silent: true });
  } catch (err) {
    console.warn("failed to detect ethereum provider:", err);
    return null;
  }

  // will fall in this condition if a wallet is not installed
  if (!provider) return null;

  const ethereum = (window as any).ethereum;
  if (!ethereum) {
    return null;
  }

  const netstr = network.toString();
  if (!proms[netstr]) {
    proms[netstr] = (async () => {
      try {
        await ethereum.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: "0x" + network.toString(16) }],
        });
      } catch (err) {
        console.warn("failed to switch to correct chain:", err);
        return null;
      }

      const p = new ethers.providers.Web3Provider(provider, network);

      try {
        // check that we can use the resulting provider
        const test = await p.getNetwork();
        if (test.chainId !== network) {
          throw new Error(
            `wrong network, expected '${network}' got '${test.chainId}'`,
          );
        }
      } catch (err) {
        console.warn("failed to probe ethereum provider:", err);
        return null;
      }

      delete proms[netstr];

      return p;
    })();
  }
  return proms[netstr];
};

const alchemyProviders: { [key: string]: ethers.providers.AlchemyProvider } =
  {};

export const getEthereumProvider = async (network: EthereumNetworkInfo) => {
  try {
    const metamaskProvider = await getMetaMaskEthereumProvider(network.chainId);
    if (metamaskProvider) {
      return metamaskProvider;
    }
  } catch (err) {
    console.warn("failed to get metamask ethereum provider:", err);
  }

  const cacheKey = `${network.chainId}-${network.alchemyApiKey}`;
  if (!alchemyProviders[cacheKey]) {
    console.log("falling back to alchemy as ethereum provider");
    alchemyProviders[cacheKey] = new ethers.providers.AlchemyProvider(
      network.chainId,
      network.alchemyApiKey,
    );
  }
  return alchemyProviders[cacheKey];
};

export const getMetaMaskEthereumSigner = async (
  network: EthereumNetworkInfo | undefined,
  address: string | undefined,
) => {
  if (!network?.chainId) {
    return null;
  }

  const provider = await getMetaMaskEthereumProvider(network.chainId);
  if (!provider) return null;

  return provider.getSigner(address);
};

export const addCollectionMetadata = async (collection: Collection) => {
  const metadata = await getCollectionMetadata(collection.id);
  return {
    ...collection,
    imageUri: metadata.image,
  };
};

const addNftMetadata = async (nft: NFT) => {
  const [network, , nftTokenId] = parseNftId(nft.id);
  if (network?.kind !== NetworkKind.Ethereum) {
    return nft;
  }

  const provider = await getEthereumProvider(network);

  const nftClient = TeritoriNft__factory.connect(
    nft.nftContractAddress,
    provider,
  );

  const tokenURI = await nftClient.callStatic.tokenURI(nftTokenId);
  const metadataURL = ipfsURLToHTTPURL(tokenURI);
  const infoReply = await fetch(metadataURL);
  const info = await infoReply.json();

  if (info) {
    const attributes: Attribute[] = [];
    for (const attr of info.attributes) {
      attributes.push({ traitType: attr.trait_type, value: attr.value });
    }

    nft.attributes = attributes;
    nft.name = info.name;
    nft.imageUri = info.image;
  }
  return nft;
};

export const addNftListMetadata = async (nfts: NFT[]) => {
  const queries = [];
  for (const nft of nfts) {
    const updatedNftQuery = addNftMetadata(nft);
    queries.push(updatedNftQuery);
  }

  return await Promise.all(queries);
};

const getCollectionMetadata = async (collectionId: string) => {
  const [network, minter] = parseNetworkObjectId(collectionId);
  if (network?.kind !== NetworkKind.Ethereum) {
    return;
  }

  const provider = await getEthereumProvider(network);
  if (!provider) return;

  const minterClient = TeritoriMinter__factory.connect(minter, provider);
  const nftAddress = await minterClient.callStatic.nft();
  const nftClient = TeritoriNft__factory.connect(nftAddress, provider);
  const contractURI = await nftClient.callStatic.contractURI();
  const reply = await fetch(contractURI);
  return reply.json();
};
