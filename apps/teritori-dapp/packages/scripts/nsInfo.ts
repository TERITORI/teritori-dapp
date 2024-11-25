import { TeritoriNameServiceQueryClient } from "../contracts-clients/teritori-name-service/TeritoriNameService.client";
import { mustGetNonSigningCosmWasmClient } from "../networks";
import { teritoriNetwork } from "../networks/teritori";

const main = async () => {
  const network = teritoriNetwork;
  if (!network.nameServiceContractAddress) {
    throw new Error("no name service contract address in network config");
  }

  console.log("contract address:", network.nameServiceContractAddress);

  const client = new TeritoriNameServiceQueryClient(
    await mustGetNonSigningCosmWasmClient(network.id),
    network.nameServiceContractAddress,
  );

  const admin = await client.adminAddress();
  console.log("admin address:", admin);

  const config = await client.contractInfo();
  console.log(config);
};

main();
