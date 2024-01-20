import fs from "fs/promises";
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
    kill: killv142,
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
  await killv142();

  await replaceInFile(
    path.join(home, "config/app.toml"),
    `minimum-gas-prices = ""`,
    `minimum-gas-prices = "0stake"`,
  );

  // start next version
  const { kill: killv204 } = await startCosmosLocalnet(binaries["v2.0.4"], {
    home,
    height: upgradeHeight,
  });

  // test cosmwasm
  await deployTeritoriEcosystem(
    { binaryPath: binaries["v2.0.4"], home },
    teritoriLocalnetNetwork.id,
    "testnet-adm",
  );

  // stop
  await killv204();

  await fs.rm(home, { recursive: true, force: true });
};

main();
