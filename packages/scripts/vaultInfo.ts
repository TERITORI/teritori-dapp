import { TeritoriNftVaultQueryClient } from "../contracts-clients/teritori-nft-vault/TeritoriNftVault.client";
import { mustGetNonSigningCosmWasmClient } from "../networks";
import { teritoriNetwork } from "../networks/teritori";

const main = async () => {
  const network = teritoriNetwork;
  if (!network.vaultContractAddress) {
    throw new Error("no vault contract address in network config");
  }

  console.log("contract address:", network.vaultContractAddress);

  const client = new TeritoriNftVaultQueryClient(
    await mustGetNonSigningCosmWasmClient(network.id),
    network.vaultContractAddress,
  );

  const config = await client.config();
  console.log(config);
};

main();
