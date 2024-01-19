import fs from "fs/promises";

import { buildBinaries, startCosmosLocalnet } from "./cosmos";
import { teritoriLocalnetNetwork } from "../../networks/teritori-localnet";
import { deployTeritoriEcosystem } from "../network-setup/deployLib";

const repoURL = "https://github.com/TERITORI/teritori-chain.git";

const main = async () => {
  const binaries = await buildBinaries(repoURL, "teritorid", [
    "v2.0.4",
  ] as const);

  const {
    home,
    result: v204Result,
    process: v204Process,
  } = await startCosmosLocalnet(binaries["v2.0.4"]);

  await deployTeritoriEcosystem(
    { binaryPath: binaries["v2.0.4"], home },
    teritoriLocalnetNetwork.id,
    "testnet-adm",
  );

  // stop
  v204Process.kill();
  await v204Result;

  await fs.rm(home, { recursive: true, force: true });
};

main();
