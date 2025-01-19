import { program } from "commander";
import os from "os";
import path from "path";

import { deployDA0DA0 } from "./deployDA0DA0";

const main = async () => {
  program.argument("<network-id>", "Network id to deploy to");
  program.argument("<wallet>", "Wallet to deploy from");
  program.option("--keyring-backend [keyring-backend]", "Keyring backend");
  program.parse();
  const [networkId, wallet] = program.args;
  const { keyringBackend } = program.opts();

  await deployDA0DA0({
    opts: {
      home: path.join(os.homedir(), ".teritorid"),
      binaryPath: "teritorid",
      keyringBackend,
      signer: undefined,
    },
    networkId,
    wallet,
  });
};
main();
