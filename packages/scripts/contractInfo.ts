import { program } from "commander";

import { mustGetNonSigningCosmWasmClient } from "../networks";

const main = async () => {
  program
    .option("-n, --network <string>", "teritori")
    .option("-c, --contract <string>");
  program.parse();
  // FIXME: use typesafe commander

  console.log(program.opts());

  const options = program.opts();
  const client = await mustGetNonSigningCosmWasmClient(options.network);
  const contract = await client.getContract(options.contract);
  console.log(contract);
  try {
    const { info } = await client.queryContractSmart(options.contract, {
      info: {},
    });
    console.log(info);
  } catch {}
};

main();
