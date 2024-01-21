import { program } from "commander";
import fs from "fs/promises";

import { buildCosmos, startCosmosLocalnet } from "./cosmos";
import { teritoriLocalnetNetwork } from "../../networks/teritori-localnet";
import { deployTeritoriEcosystem } from "../network-setup/deployLib";

const main = async () => {
  program.argument(
    "<repo-path>",
    "Path to the repo to build latest binary from",
  );
  program.parse();
  const [repoPath] = program.args;

  const binary = await buildCosmos(repoPath, "teritorid");

  const { home, kill } = await startCosmosLocalnet(binary);

  await deployTeritoriEcosystem(
    { binaryPath: binary, home },
    teritoriLocalnetNetwork.id,
    "testnet-adm",
  );

  // stop
  await kill();

  await fs.rm(home, { recursive: true, force: true });
};

main();
