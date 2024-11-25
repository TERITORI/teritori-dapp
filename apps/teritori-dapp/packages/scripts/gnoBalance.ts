import { GnoJSONRPCProvider } from "@gnolang/gno-js-client";
import { program } from "commander";

import { NetworkKind, parseUserId } from "../networks";

const main = async () => {
  program.argument("user-id", "user id");
  program.parse();
  const [userId] = program.args as [string, string];

  const [network, userAddress] = parseUserId(userId);
  if (network?.kind !== NetworkKind.Gno) {
    console.error("network not supported");
    return;
  }
  const provider = new GnoJSONRPCProvider(network.endpoint);
  try {
    const rawRes = await provider.getBalance(userAddress);
    console.log(rawRes);
  } catch (e) {
    console.error(JSON.stringify(e));
  }
};

main();
