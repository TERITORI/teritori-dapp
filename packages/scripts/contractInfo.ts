import { program } from "commander";

import {
  NetworkKind,
  mustGetNonSigningCosmWasmClient,
  parseNetworkObjectId,
} from "../networks";

const main = async () => {
  program.argument("<contract-id>", "ID of the contract to inspect");
  program.parse();
  // FIXME: use typesafe commander

  const [contractId] = program.args as [string];
  const [network, contractAddress] = parseNetworkObjectId(contractId);

  if (network?.kind !== NetworkKind.Cosmos) {
    throw new Error("network not supported");
  }

  const client = await mustGetNonSigningCosmWasmClient(network.id);
  const contract = await client.getContract(contractAddress);
  console.log(contract);
  try {
    const { info } = await client.queryContractSmart(contractAddress, {
      info: {},
    });
    console.log(info);
  } catch {}
};

main();
