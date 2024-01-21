import { program } from "commander";
import fs from "fs/promises";
import path from "path";

import {
  buildBinaries,
  buildCosmos,
  startCosmosLocalnet,
  upgradeCosmosLocalnet,
} from "./cosmos";
import { teritoriLocalnetNetwork } from "../../networks/teritori-localnet";
import { replaceInFile } from "../lib";
import { deployTeritoriEcosystem } from "../network-setup/deployLib";

const repoURL = "https://github.com/TERITORI/teritori-chain.git";

const main = async () => {
  program.argument(
    "<repo-path>",
    "Path to the repo to build latest binary from",
  );
  program.parse();
  const [repoPath] = program.args;

  const binaries = await buildBinaries(repoURL, "teritorid", [
    "v1.2.0",
    "v1.3.0",
    "v1.3.1",
    "v1.4.2",
  ] as const);

  const v204Binary = await buildCosmos(repoPath, "teritorid");

  const {
    home,
    validatorWalletName,
    kill: killv120,
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
  await killv120();

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

  const { kill: killv204 } = await startCosmosLocalnet(v204Binary, {
    home,
    height: upgradeHeight,
  });

  // test cosmwasm
  await deployTeritoriEcosystem(
    { binaryPath: v204Binary, home },
    teritoriLocalnetNetwork.id,
    "testnet-adm",
  );

  await killv204();

  await fs.rm(home, { recursive: true, force: true });
};

const runUpgrade = async (
  binaryPath: string,
  home: string,
  height: bigint,
  version: string,
  validatorWalletName: string,
) => {
  const { kill } = await startCosmosLocalnet(binaryPath, {
    home,
    height,
  });
  const upgradeHeight = await upgradeCosmosLocalnet(
    binaryPath,
    version,
    validatorWalletName,
    home,
  );
  await kill();
  return upgradeHeight;
};

main();
