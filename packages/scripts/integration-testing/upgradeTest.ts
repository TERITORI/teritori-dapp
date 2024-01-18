import child_process from "child_process";
import fs from "fs/promises";
import { Listr } from "listr2";

import {
  startCosmosLocalnet,
  upgradeCosmosLocalnet,
  waitForHeight,
} from "./cosmos";
import { cloneRepo } from "./git";
import { teritoriLocalnetNetwork } from "../../networks/teritori-localnet";
import { deployTeritoriEcosystem } from "../network-setup/deployLib";

const repoURL = "https://github.com/TERITORI/teritori-chain.git";

export const main = async () => {
  let v142BinaryPath, v203BinaryPath;
  const tasks = new Listr(
    [
      {
        title: "build v1.4.2",
        task: async () => {
          const v142RepoPath = await cloneRepo(repoURL, "v1.4.2");
          v142BinaryPath = await buildTeritori(v142RepoPath);
        },
      },
      {
        title: "build v2.0.3",
        task: async () => {
          const v203RepoPath = await cloneRepo(repoURL, "v2.0.3");
          v203BinaryPath = await buildTeritori(v203RepoPath);
        },
      },
    ],
    {
      concurrent: true,
      exitOnError: false,
    },
  );
  await tasks.run();
  if (tasks.tasks.some((t) => t.state === "FAILED")) {
    console.error("Failed");
    process.exit(1);
  }
  if (!v142BinaryPath || !v203BinaryPath) {
    console.error("Unexpected");
    process.exit(1);
  }

  const {
    home,
    result: v142Result,
    process: v142Process,
    validatorWalletName,
  } = await startCosmosLocalnet(v142BinaryPath);

  await deployTeritoriEcosystem(
    { binaryPath: v142BinaryPath, home },
    teritoriLocalnetNetwork.id,
    "testnet-adm",
  );

  const upgradeHeight = await upgradeCosmosLocalnet(
    v142BinaryPath,
    "v2.0.3",
    validatorWalletName,
    home,
  );

  await waitForHeight(26657, upgradeHeight);
  v142Process.kill();
  await v142Result;

  // upgrade config
  const appTomlPath = `${home}/config/app.toml`;
  const appToml = await fs.readFile(appTomlPath, { encoding: "utf-8" });
  const newAppToml = appToml.replace(
    `minimum-gas-prices = ""`,
    `minimum-gas-prices = "0stake"`,
  );
  await fs.writeFile(appTomlPath, newAppToml);

  // start next version
  const {} = await startCosmosLocalnet(v203BinaryPath, {
    home,
    height: upgradeHeight,
  });
};

const buildTeritori = async (repoPath: string): Promise<string> => {
  const cmd = `cd ${repoPath} && make build`;
  // console.log("> " + cmd);
  await new Promise((resolve, reject) => {
    child_process.exec(cmd, (err, stdout, stderr) => {
      if (err) {
        reject(new Error(stdout + stderr));
      } else {
        resolve(undefined);
      }
    });
  });
  return `${repoPath}/build/teritorid`;
};

main();
