import fs from "fs/promises";
import os from "os";

import { buildBinaries, startCosmosLocalnet } from "./cosmos";
import { teritoriLocalnetNetwork } from "../../networks/teritori-localnet";
import { deployTeritoriEcosystem } from "../network-setup/deployLib";

const repoURL = "https://github.com/TERITORI/teritori-chain.git";

const main = async () => {
  const binaries = await buildBinaries(repoURL, "teritorid", [
    "v2.0.3",
  ] as const);

  const {
    home,
    result: v203Result,
    process: v203Process,
  } = await startCosmosLocalnet(binaries["v2.0.3"]);

  await deployTeritoriEcosystem(
    { binaryPath: binaries["v2.0.3"], home },
    teritoriLocalnetNetwork.id,
    "testnet-adm",
  );

  // stop
  v203Process.kill(os.constants.signals.SIGINT);
  await v203Result;

  await fs.rm(home, { recursive: true, force: true });
};

main();
