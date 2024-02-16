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
import {
  deployTeritoriEcosystem,
  testTeritoriEcosystem,
} from "../network-setup/deployLib";

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

  const latestBinary = await buildCosmos(repoPath, "teritorid");

  const {
    home,
    validatorWalletName,
    kill: killv120,
    admSigner,
  } = await startCosmosLocalnet(binaries["v1.2.0"]);
  if (!admSigner) {
    throw new Error("adm signer is undefined");
  }

  const initialEcosystem = await deployTeritoriEcosystem(
    { binaryPath: binaries["v1.2.0"], home, signer: admSigner },
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
    `minimum-gas-prices = "0utori"`,
  );

  const { kill: killLatest } = await startCosmosLocalnet(latestBinary, {
    home,
    height: upgradeHeight,
  });

  // test cosmwasm

  await testTeritoriEcosystem(initialEcosystem);

  await deployTeritoriEcosystem(
    { binaryPath: latestBinary, home, signer: admSigner },
    teritoriLocalnetNetwork.id,
    "testnet-adm",
  );

  // clean

  await killLatest();

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
