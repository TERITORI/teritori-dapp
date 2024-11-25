import Long from "long";

import { mustGetNodeMarketplaceClient } from "./lib";
import { TeritoriBunkerMinterQueryClient } from "../contracts-clients/teritori-bunker-minter/TeritoriBunkerMinter.client";
import {
  mustGetNonSigningCosmWasmClient,
  parseNetworkObjectId,
} from "../networks";
import { teritoriNetwork } from "../networks/teritori";

const main = async () => {
  const backendClient = mustGetNodeMarketplaceClient(teritoriNetwork.id);
  const srv = backendClient.Collections({
    limit: 100,
    offset: 0,
    networkId: teritoriNetwork.id,
  });
  await srv.forEach(async ({ collection }) => {
    if (!collection) {
      return;
    }
    let retry = 0;
    while (retry < 5) {
      try {
        const collectionId = collection.id;
        const [network, mintAddress] = parseNetworkObjectId(collectionId);
        if (!network) {
          throw new Error("collection network not found");
        }
        const comswasmClient = await mustGetNonSigningCosmWasmClient(
          network.id,
        );
        const bunkerClient = new TeritoriBunkerMinterQueryClient(
          comswasmClient,
          mintAddress,
        );
        const requestsCount = Long.fromString(
          await bunkerClient.tokenRequestsCount(),
        );
        const minted = Long.fromString(await bunkerClient.currentSupply());
        if (minted.lessThan(requestsCount)) {
          console.log(
            "missing",
            requestsCount.sub(minted).toString(),
            "in",
            collectionId,
          );
        }
        return;
      } catch {}
      retry++;
    }
    console.error("failed to check", collection.collectionName, collection.id);
  });
};

main();
