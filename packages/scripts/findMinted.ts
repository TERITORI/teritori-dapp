import { TeritoriBunkerMinterQueryClient } from "../contracts-clients/teritori-bunker-minter/TeritoriBunkerMinter.client";
import {
  mustGetNonSigningCosmWasmClient,
  parseNetworkObjectId,
} from "../networks";

import { TeritoriNftQueryClient } from "@/contracts-clients/teritori-nft/TeritoriNft.client";

const collectionId =
  "tori-tori167xst2jy9n6u92t3n8hf762adtpe3cs6acsgn0w5n2xlz9hv3xgs4ksc6t";

const main = async () => {
  const [network, mintAddress] = parseNetworkObjectId(collectionId);
  if (!network) {
    throw new Error("collection network not found");
  }
  const comswasmClient = await mustGetNonSigningCosmWasmClient(network.id);
  const bunkerClient = new TeritoriBunkerMinterQueryClient(
    comswasmClient,
    mintAddress,
  );
  const conf = await bunkerClient.config();

  const nftClient = new TeritoriNftQueryClient(comswasmClient, conf.nft_addr);

  const minted = [];
  for (let i = 0; i <= parseInt(conf.nft_max_supply, 10); i++) {
    try {
      await nftClient.nftInfo({ tokenId: i.toString() });
      minted.push(i.toString());
      console.error(i, "minted");
    } catch {
      console.error(i, "not");
    }
  }
  console.log(JSON.stringify(minted));
};

main();
