import child_process from "child_process";
import { program } from "commander";

import sqh from "./sqh";

import { getGnoNetwork } from "@/networks";

const main = async () => {
  program.argument("network-id", "network id");
  program.argument("realm", "realm pkg path");
  program.argument("query", "eval query");
  program.parse();
  const [networkId, realm, query] = program.args as [string, string, string];

  const network = getGnoNetwork(networkId);
  if (!network) {
    console.error(`Network "${networkId}" not found`);
    return;
  }

  if (!realm) {
    console.log("missing realm argument");
  }

  if (!query) {
    console.log("missing query argument");
  }

  const cmd = `gnokey query vm/qeval -remote ${sqh(network.endpoint)} -data ${sqh(`${realm}.${query}`)}`;
  console.log("> " + cmd);
  child_process.execSync(cmd, { stdio: "inherit" });
};

main();
