import axios from "axios";
import { program } from "commander";
import fs from "fs";
import path from "path";

import { retry } from "./lib";
import { TeritoriBunkerMinterQueryClient } from "../contracts-clients/teritori-bunker-minter/TeritoriBunkerMinter.client";
import { TeritoriNftQueryClient } from "../contracts-clients/teritori-nft/TeritoriNft.client";
import {
  mustGetNonSigningCosmWasmClient,
  parseCollectionId,
} from "../networks";

const main = async () => {
  program.argument("<collection-id>");
  program.parse();
  const [collectionId] = program.args as [string];
  const [network, mintContractAddress] = parseCollectionId(collectionId);
  if (!network || !mintContractAddress) {
    throw new Error(`Invalid collection ID: ${collectionId}`);
  }
  const cosmWasmClient = await retry(15, () =>
    mustGetNonSigningCosmWasmClient(network.id),
  );
  const bunkerClient = new TeritoriBunkerMinterQueryClient(
    cosmWasmClient,
    mintContractAddress,
  );
  const bunkerConfig = await retry(15, () => bunkerClient.config());
  const nftContractAddress = bunkerConfig.nft_addr;
  const nftClient = new TeritoriNftQueryClient(
    cosmWasmClient,
    nftContractAddress,
  );
  const nftContractInfo = await retry(15, () => nftClient.contractInfo());
  const collectionMetadataURI = bunkerConfig.nft_base_uri;

  const dir = collectionId + ".d";
  fs.mkdirSync(dir, { recursive: true });
  const [finalCIDString, ...pathRest] = collectionMetadataURI
    .substring("ipfs://".length)
    .split("/");
  const web2URI = `https://${finalCIDString}.ipfs.cf-ipfs.com/${pathRest.join(
    "/",
  )}`;
  const data = {
    ...nftContractInfo,
    ...bunkerConfig,
    ...(await axios.get(web2URI)).data,
  };
  fs.writeFileSync(
    path.join(dir, "collection.json"),
    JSON.stringify(data, null, 2),
  );

  const minterContract = await retry(10, () =>
    cosmWasmClient.getContract(mintContractAddress),
  );
  const nftContract = await retry(10, () =>
    cosmWasmClient.getContract(nftContractAddress),
  );

  fs.writeFileSync(
    path.join(dir, "constants.json"),
    JSON.stringify(
      {
        minterCodeId: minterContract.codeId,
        nftCodeId: nftContract.codeId,
      },
      null,
      2,
    ),
  );

  const tokens: string[] = [];
  let cursor: string | undefined = undefined;
  while (true) {
    console.log("cursor", cursor);
    const tokensRes = await retry(50, () =>
      nftClient.allTokens({
        limit: 200,
        startAfter: cursor,
      }),
    );
    if (tokensRes.tokens.length === 0) {
      break;
    }
    tokens.push(...tokensRes.tokens);
    console.log("len", tokens.length);
    cursor = tokens[tokens.length - 1];
  }
  console.log("len", tokens.length);
  console.log(tokens.sort((a, b) => +a - +b));
  const metadataDir = path.join(dir, "metadata");
  fs.mkdirSync(metadataDir, { recursive: true });
  for (const token of tokens) {
    const tokenFilePath = path.join(metadataDir, `${token}.json`);
    if (fs.existsSync(tokenFilePath)) {
      continue;
    }
    const tokenInfo = await retry(50, () =>
      nftClient.nftInfo({ tokenId: token }),
    );
    console.log(tokenInfo);
    fs.writeFileSync(
      tokenFilePath,
      JSON.stringify(tokenInfo.extension, null, 2),
    );
  }

  fs.writeFileSync(
    path.join(dir, "tokens.json"),
    JSON.stringify(tokens, null, 2),
  );
};

main();
