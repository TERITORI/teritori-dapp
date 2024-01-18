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
    "v1.2.0",
    "v1.3.0",
    "v1.3.1",
    "v1.4.2",
    "v2.0.3",
  ] as const);

  const {
    home,
    result: v120Result,
    process: v120Process,
    validatorWalletName,
  } = await startCosmosLocalnet(binaries["v1.2.0"]);

  await deployTeritoriEcosystem(
    { binaryPath: binaries["v1.2.0"], home },
    teritoriLocalnetNetwork.id,
    "testnet-adm",
  );

  let upgradeHeight = await upgradeCosmosLocalnet(
    binaries["v1.2.0"],
    "v1.3.0",
    validatorWalletName,
    home,
  );
  v120Process.kill(os.constants.signals.SIGINT);
  await v120Result;

  upgradeHeight = await runUpgrade(
    binaries["v1.3.0"],
    home,
    upgradeHeight,
    "v1.3.1",
    validatorWalletName,
  );

  upgradeHeight = await runUpgrade(
    binaries["v1.3.1"],
    home,
    upgradeHeight,
    "v1.4.0",
    validatorWalletName,
  );

  upgradeHeight = await runUpgrade(
    binaries["v1.4.2"],
    home,
    upgradeHeight,
    "v2.0.0",
    validatorWalletName,
  );

  await replaceInFile(
    path.join(home, "config/app.toml"),
    `minimum-gas-prices = ""`,
    `minimum-gas-prices = "0stake"`,
  );

  const { process: v203Process, result: v203Result } =
    await startCosmosLocalnet(binaries["v2.0.3"], {
      home,
      height: upgradeHeight,
    });

  // test cosmwasm
  await deployTeritoriEcosystem(
    { binaryPath: binaries["v2.0.3"], home },
    teritoriLocalnetNetwork.id,
    "testnet-adm",
  );

  v203Process.kill(os.constants.signals.SIGINT);
  await v203Result;

  await fs.rm(home, { recursive: true, force: true });
};

const runUpgrade = async (
  binaryPath: string,
  home: string,
  height: bigint,
  version: string,
  validatorWalletName: string,
) => {
  const { result, process } = await startCosmosLocalnet(binaryPath, {
    home,
    height,
  });
  const upgradeHeight = await upgradeCosmosLocalnet(
    binaryPath,
    version,
    validatorWalletName,
    home,
  );
  process.kill(os.constants.signals.SIGINT);
  await result;
  return upgradeHeight;
};

main();
