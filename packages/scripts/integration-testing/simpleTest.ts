import { program } from "commander";
import fs from "fs/promises";

import { buildCosmos, startCosmosLocalnet } from "./cosmos";
import { teritoriLocalnetNetwork } from "../../networks/teritori-localnet";
import { deployTeritoriEcosystem } from "../network-setup/deployLib";

const main = async () => {
  console.log("AAAAAAAAAAAAAAA");

  program.argument(
    "<repo-path>",
    "Path to the repo to build latest binary from",
  );
  // program.argument("<launchpad-admin-dao>", "The DAO wallet adress to make admin things");
  program.parse();
  const [
    repoPath,
    // , launchpadAdminDAO
  ] = program.args;

  console.log("?????");
  console.log("repoPath", repoPath);
  // console.log('launchpadAdminDAO', launchpadAdminDAO)

  const binary = await buildCosmos(repoPath, "teritorid");

  console.log("0000");

  const { home, kill, admSigner } = await startCosmosLocalnet(binary);
  if (!admSigner) {
    throw new Error("adm signer is undefined");
  }

  // test cosmwasm

  console.log("111111");

  //========  FIXME: ==> error: missing required argument 'network-id'

  await deployTeritoriEcosystem(
    { binaryPath: binary, home, signer: admSigner },
    teritoriLocalnetNetwork.id,
    "testnet-adm",
    // launchpadAdminDAO
  );
  //===================

  // clean

  await kill();

  await fs.rm(home, { recursive: true, force: true });
};

main();
