import { TeritoriSocialFeedQueryClient } from "../contracts-clients/teritori-social-feed/TeritoriSocialFeed.client";
import { mustGetNonSigningCosmWasmClient } from "../networks";
import { teritoriNetwork } from "../networks/teritori";

const main = async () => {
  const network = teritoriNetwork;
  if (!network.socialFeedContractAddress) {
    throw new Error("no social feed contract address in network config");
  }

  console.log("contract address:", network.socialFeedContractAddress);

  const client = new TeritoriSocialFeedQueryClient(
    await mustGetNonSigningCosmWasmClient(network.id),
    network.socialFeedContractAddress,
  );

  const config = await client.config();
  console.log(config);
};

main();
