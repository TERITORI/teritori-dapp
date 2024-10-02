import child_process from "child_process";
import { program } from "commander";

import sqh from "../sqh";

import { getGnoNetwork } from "@/networks";

const DEFAULT_NETWORK_ID = "gnodev";

const main = async () => {
  program.argument("sender", "sender address");
  program.argument("username", "username to register");
  program.argument("network-id", "remote endpoint", DEFAULT_NETWORK_ID);
  program.parse();
  const [sender, username, networkId] = program.args as [
    string,
    string,
    string,
  ];

  const network = getGnoNetwork(networkId);
  if (!network) {
    console.error(`Network "${networkId}" not found`);
    return;
  }

  if (!sender) {
    console.log("missing sender argument");
  }

  if (!username) {
    console.log("missing username argument");
  }

  const cmd = [
    "gnokey maketx call",
    '-pkgpath "gno.land/r/demo/users"',
    '-func "Register"',
    "-gas-fee 1000000ugnot",
    "-gas-wanted 2000000",
    '-send "20000000ugnot"',
    '-broadcast -chainid "dev"',
    '-args ""',
    `-args "${username}"`,
    '-args ""',
    `-remote ${sqh(network.endpoint)}`,
    sender,
  ];
  console.log("> " + cmd.join(" "));
  child_process.execSync(cmd.join(" "), { stdio: "inherit" });
};

main();
