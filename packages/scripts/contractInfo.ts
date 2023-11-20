import { program } from "commander";

import {
  mustGetNonSigningCosmWasmClient,
  parseNetworkObjectId,
} from "../networks";

const main = async () => {
  const all: { [key: string]: any } = {};
  try {
    program.argument("<contract-id>");
    program.parse();
    // FIXME: use typesafe commander

    const [contractId, ...additionalQueries] = program.args;
    const [network, contractAddress] = parseNetworkObjectId(contractId);
    if (!network || !contractAddress) {
      throw new Error("Invalid contract id");
    }
    const client = await mustGetNonSigningCosmWasmClient(network?.id);

    const contract = await client.getContract(contractAddress);
    all["contract"] = contract;
    const { data, ...wasm } = await client.getCodeDetails(contract.codeId);
    all["wasm"] = wasm;
    const queries: string[] = [];
    try {
      await client.queryContractSmart(contractAddress, {
        __this_should_not_exist: {},
      });
      all["interfaceQueryError"] = new Error(
        "query should have failed",
      ).toString();
    } catch (err) {
      if (err instanceof Error) {
        const message = err.message;
        let match = message.match(/expected one of (.+?):/);
        if (match?.length !== 2) {
          match = message.match(/expected (.+?):/);
        }
        if (match?.length === 2) {
          let parts;
          if (match[1].includes(", ")) {
            parts = match[1].split(", ");
          } else if (match[1].includes(" or ")) {
            parts = match[1].split(" or ");
          }
          queries.push(...(parts || []).map((s) => s.slice(1, s.length - 1)));
        } else {
          all["interfaceQueryError"] = new Error(
            "unexpected message shape: `" + message + "`",
          ).toString();
        }
      } else {
        all["interfaceQueryError"] = `${err}`;
      }
    }
    all["queries"] = queries;
    all.results = {};
    all.queriesErrors = [];
    for (const test of [
      "admin",
      "admin_address",
      "info",
      "config",
      ...additionalQueries,
    ].filter((m) => queries.includes(m))) {
      try {
        const res = await client.queryContractSmart(contractAddress, {
          [test]: {},
        });
        all.results[test] = res;
      } catch (err) {
        all.queriesErrors.push(`${err}`);
      }
    }
  } catch (err) {
    all["error"] = `${err}`;
  }
  console.log(JSON.stringify(all, null, 4));
};

main();
