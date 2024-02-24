import { NftMarketplaceQueryClient } from "../contracts-clients/nft-marketplace/NftMarketplace.client";
import { mustGetNonSigningCosmWasmClient } from "../networks";
import { teritoriNetwork } from "../networks/teritori";

const main = async () => {
  const network = teritoriNetwork;
  if (!network.vaultContractAddress) {
    throw new Error("no vault contract address in network config");
  }

  console.log("contract address:", network.vaultContractAddress);

  const client = new NftMarketplaceQueryClient(
    await mustGetNonSigningCosmWasmClient(network.id),
    network.vaultContractAddress,
  );

  const config = await client.config();
  console.log(config);
};

main();
