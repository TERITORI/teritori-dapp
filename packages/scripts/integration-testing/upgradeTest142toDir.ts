import { program } from "commander";
import fs from "fs/promises";
import os from "os";
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
  try {
    program.argument(
      "<repo-path>",
      "Path to the repo to build latest binary from",
    );
    program.parse();
    const [repoPath] = program.args;

    const binaries = await buildBinaries(repoURL, "teritorid", [
      "v1.4.2",
    ] as const);
    const latestBinaryPath = await buildCosmos(repoPath, "teritorid");

    const {
      home,
      result: v142Result,
      process: v142Process,
      validatorWalletName,
    } = await startCosmosLocalnet(binaries["v1.4.2"]);

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
    const { result, process: v203Process } = await startCosmosLocalnet(
      latestBinaryPath,
      {
        home,
        height: upgradeHeight,
      },
    );

    // test cosmwasm
    await deployTeritoriEcosystem(
      { binaryPath: latestBinaryPath, home },
      teritoriLocalnetNetwork.id,
      "testnet-adm",
    );

    // stop
    v203Process.kill(os.constants.signals.SIGINT);
    await result;

    await fs.rm(home, { recursive: true, force: true });
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
};

main();
