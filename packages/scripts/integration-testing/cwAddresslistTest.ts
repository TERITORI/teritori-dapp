import { program } from "commander";
import fs from "fs/promises";

import { deployCwAddressList } from "./../network-setup/deployCwAddressList";
import { buildCosmos, startCosmosLocalnet } from "./cosmos";
import { teritoriLocalnetNetwork } from "../../networks/teritori-localnet";

const main = async () => {
  program.argument(
    "<repo-path>",
    "Path to the repo to build latest binary from",
  );
  program.parse();
  const [repoPath] = program.args;

  const binary = await buildCosmos(repoPath, "teritorid");

  const { home, kill, admSigner } = await startCosmosLocalnet(binary);
  if (!admSigner) {
    throw new Error("adm signer is undefined");
  }

  await deployCwAddressList({
    opts: { binaryPath: binary, home },
    networkId: teritoriLocalnetNetwork.id,
    wallet: "testnet-adm",
  });

  await kill();
  await fs.rm(home, { recursive: true, force: true });
};

main();
