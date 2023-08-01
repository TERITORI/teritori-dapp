import { program } from "commander";

import { mustGetNonSigningCosmWasmClient } from "../networks";

const main = async () => {
  program
    .option("-n, --network <string>", "teritori")
    .option("-c, --contract <string>");
  program.parse();
  // FIXME: use typesafe commander

  console.log("args:", program.opts());

  const options = program.opts();
  const client = await mustGetNonSigningCosmWasmClient(options.network);
  const contract = await client.getContract(options.contract);
  console.log("contract:", contract);
  const { data, ...wasm } = await client.getCodeDetails(contract.codeId);
  console.log("wasm:", wasm);
  const queries: string[] = [];
  try {
    await client.queryContractSmart(options.contract, {
      __this_should_not_exist: {},
    });
    console.log("Failed to query contract interface");
  } catch (err) {
    if (err instanceof Error) {
      const message = err.message;
      const match = message.match(/expected one of (.+?):/);
      if (match?.length === 2) {
        queries.push(
          ...match[1].split(", ").map((s) => s.slice(1, s.length - 1))
        );
      } else if (!message.includes("no variants")) {
        console.log(err);
      }
    } else {
      console.log(err);
    }
  }
  console.log("queries:", queries);
  for (const test of [
    "admin",
    "info",
    "config",
    "hooks",
    "proposal_modules",
    "voting_module",
    "group_contract",
    "proposal_creation_policy",
  ].filter((m) => queries.includes(m))) {
    try {
      const res = await client.queryContractSmart(options.contract, {
        [test]: {},
      });
      console.log(test + ":", res);
    } catch (err) {
      console.log(err);
    }
  }
};

main();
