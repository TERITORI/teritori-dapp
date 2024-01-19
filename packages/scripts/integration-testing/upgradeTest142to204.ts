import fs from "fs/promises";
import os from "os";
import path from "path";

import {
  buildBinaries,
  startCosmosLocalnet,
  upgradeCosmosLocalnet,
} from "./cosmos";
import { teritoriLocalnetNetwork } from "../../networks/teritori-localnet";
import { replaceInFile } from "../lib";
import { deployTeritoriEcosystem } from "../network-setup/deployLib";

const repoURL = "https://github.com/TERITORI/teritori-chain.git";

const main = async () => {
  const binaries = await buildBinaries(repoURL, "teritorid", [
    "v1.4.2",
    "v2.0.4",
  ] as const);

  const {
    home,
    result: v142Result,
    process: v142Process,
    validatorWalletName,
  } = await startCosmosLocalnet(binaries["v1.4.2"]);

  await deployTeritoriEcosystem(
    { binaryPath: binaries["v1.4.2"], home },
    teritoriLocalnetNetwork.id,
    "testnet-adm",
  );

  const upgradeHeight = await upgradeCosmosLocalnet(
    binaries["v1.4.2"],
    "v2.0.0",
    validatorWalletName,
    home,
  );
  v142Process.kill(os.constants.signals.SIGINT);
  await v142Result;

  await replaceInFile(
    path.join(home, "config/app.toml"),
    `minimum-gas-prices = ""`,
    `minimum-gas-prices = "0stake"`,
  );

  // start next version
  const { result, process: v204Process } = await startCosmosLocalnet(
    binaries["v2.0.4"],
    {
      home,
      height: upgradeHeight,
    },
  );

  // test cosmwasm
  await deployTeritoriEcosystem(
    { binaryPath: binaries["v2.0.4"], home },
    teritoriLocalnetNetwork.id,
    "testnet-adm",
  );

  // stop
  v204Process.kill(os.constants.signals.SIGINT);
  await result;

  await fs.rm(home, { recursive: true, force: true });
};

main();
