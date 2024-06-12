import { program } from "commander";
import fs from "fs/promises";

import { buildCosmos, startCosmosLocalnet } from "./cosmos";
import { teritoriLocalnetNetwork } from "../../networks/teritori-localnet";

import deployDaoStuff from "@/scripts/network-setup/deployDaoStuff";

const main = async () => {
  program.argument(
    "<repo-path>",
    "Path to the repo to build latest binary from",
  );
  program.parse();
  const [repoPath] = program.args;

  const binary = await buildCosmos(repoPath, "teritorid");

  const { home, kill, admSigner } = await startCosmosLocalnet(binary);
  if (!admSigner) {
    throw new Error("adm signer is undefined");
  }

  // test cosmwasm

  await deployDaoStuff(
    { binaryPath: binary, home, signer: admSigner },
    teritoriLocalnetNetwork.id,
    "testnet-adm",
  );

  // clean

  await kill();

  await fs.rm(home, { recursive: true, force: true });
};

main();
