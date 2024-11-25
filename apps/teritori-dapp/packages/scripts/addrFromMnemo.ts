import { GnoWallet } from "@gnolang/gno-js-client";
import { program } from "commander";

import { NetworkKind, getNetwork } from "@/networks";

const main = async () => {
  program.option("-n, --network <network>", "network");
  program.option("-m, --mnemonic <mnemonic>", "mnemonic");
  program.parse();
  const { network: networkId, mnemonic } = program.opts() as {
    network: string;
    mnemonic: string;
  };
  const network = getNetwork(networkId);
  if (!network) {
    console.error(`Network "${networkId}" not found`);
    return;
  }
  if (network.kind !== NetworkKind.Gno) {
    console.error(`Only Gno networks are supported for now`);
  }
  const wallet = await GnoWallet.fromMnemonic(mnemonic);
  const address = await wallet.getAddress();
  console.log(address);
};

main();
