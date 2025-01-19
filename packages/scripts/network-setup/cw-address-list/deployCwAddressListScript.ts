import { program } from "commander";
import os from "os";
import path from "path";

import { deployCwAddressList } from "./deployCwAddressList";

const main = async () => {
  program.argument("<network-id>", "Network id to deploy to");
  program.argument("<wallet>", "Wallet to deploy from");
  program.option("--keyring-backend [keyring-backend]", "Keyring backend");
  program.parse();
  const [networkId, wallet] = program.args;
  const { keyringBackend } = program.opts();

  await deployCwAddressList({
    opts: {
      home: path.join(os.homedir(), ".teritorid"),
      binaryPath: "teritorid",
      keyringBackend,
    },
    networkId,
    wallet,
  });
};
main();
