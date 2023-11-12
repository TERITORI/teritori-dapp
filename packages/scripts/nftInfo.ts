import { program } from "commander";

import { mustGetNodeMarketplaceClient } from "./lib";
import { TeritoriBunkerMinterQueryClient } from "../contracts-clients/teritori-bunker-minter/TeritoriBunkerMinter.client";
import { TeritoriNftQueryClient } from "../contracts-clients/teritori-nft/TeritoriNft.client";
import {
  getCollectionId,
  mustGetNonSigningCosmWasmClient,
  parseNftId,
  NetworkKind,
} from "../networks";

const main = async () => {
  program.argument("<nft-id>", "ID of the nft to inspect");
  program.parse();
  // FIXME: use typesafe commander

  const [nftId] = program.args as [string];

  console.log("NFT id:", nftId);
  const [network, minterContractAddress, tokenId] = parseNftId(nftId);
  if (network?.kind !== NetworkKind.Cosmos) {
    throw new Error("unsupported network kind");
  }

  console.log("Connecting to blockchain...");
  const cosmwasmClient = await mustGetNonSigningCosmWasmClient(network.id);

  let nftContractAddress;
  if (minterContractAddress === network.nameServiceContractAddress) {
    console.log("NFT is a name service token");
    nftContractAddress = network.nameServiceContractAddress;
  } else {
    console.log("Fetching minter config...");
    const minterClient = new TeritoriBunkerMinterQueryClient(
      cosmwasmClient,
      minterContractAddress,
    );
    const config = await minterClient.config();
    nftContractAddress = config.nft_addr;
  }
  console.log("NFT contract address:", nftContractAddress);
  const nftClient = new TeritoriNftQueryClient(
    cosmwasmClient,
    nftContractAddress,
  );

  console.log("Fetching NFT info...");
  const nftInfo = await nftClient.nftInfo({ tokenId });
  console.log(`NFT info:\n${JSON.stringify(nftInfo, null, 2)}`);

  console.log("Fetching owner info...");
  const ownerInfo = await nftClient.ownerOf({ tokenId });
  console.log(`NFT owner info:\n${JSON.stringify(ownerInfo, null, 2)}`);

  console.log("Fetching owner contract info...");
  const ownerContractInfo = await cosmwasmClient.getContract(ownerInfo.owner);
  console.log(
    `Owner contract info:\n${JSON.stringify(ownerContractInfo, null, 2)}`,
  );

  console.log("Fetching backend NFT info...");
  const backendInfo = await getBackendNFTInfo(nftId);
  console.log(`Backend info:\n${JSON.stringify(backendInfo, null, 2)}`);
};

const getBackendNFTInfo = async (nftId: string) => {
  const [network, minterContractAddress] = parseNftId(nftId);
  if (!network) {
    throw new Error("nft network not found");
  }
  const backendClient = mustGetNodeMarketplaceClient(network?.id);
  let offset = 0;
  const limit = 1000;
  let targetNFT;
  while (!targetNFT) {
    const stream = backendClient.NFTs({
      offset,
      limit,
      collectionId: getCollectionId(network?.id, minterContractAddress),
    });
    let remains = false;
    await stream.forEach(({ nft }) => {
      if (!nft) {
        return;
      }
      remains = true;
      if (nft.id === nftId) {
        targetNFT = nft;
      }
    });
    if (!remains) {
      throw new Error("nft not found");
    }
    offset += limit;
  }
  return targetNFT;
};

main();
