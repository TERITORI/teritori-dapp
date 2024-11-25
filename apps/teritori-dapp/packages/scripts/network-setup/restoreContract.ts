import { program } from "commander";
import fs from "fs";
import os from "os";
import path from "path";

import { storeWASM } from "./deployLib";
import {
  getCosmosNetwork,
  getNetwork,
  mustGetNonSigningCosmWasmClient,
} from "../../networks";
import { retry } from "../lib";

const main = async () => {
  program.argument("<wallet>");
  program.argument("<contractCodeId>");
  program.argument("<sourceNetworkId>");
  program.argument("<destinationNetworkId>");
  program.option("--keyring-backend [keyring-backend]", "Keyring backend");
  program.parse();

  const [wallet, contractCodeId, sourceNetworkId, destinationNetworkId] =
    program.args;
  const { keyringBackend } = program.opts();

  const sourceNetwork = getNetwork(sourceNetworkId);
  if (!sourceNetwork) {
    throw new Error(`Invalid source network ${sourceNetworkId}`);
  }

  const destinationNetwork = getCosmosNetwork(destinationNetworkId);
  if (!destinationNetwork) {
    throw new Error(`Invalid destination network ${destinationNetworkId}`);
  }

  console.log(
    `Storing contract ${contractCodeId} from network ${sourceNetwork.displayName} in network ${destinationNetwork.displayName}`,
  );

  const sourceClient = await retry(50, () =>
    mustGetNonSigningCosmWasmClient(sourceNetwork.id),
  );
  const codeDetails = await retry(50, () =>
    sourceClient.getCodeDetails(Number(contractCodeId)),
  );
  const contractBytes = codeDetails.data;
  const contractPath = `${codeDetails.checksum}.wasm`;
  fs.writeFileSync(contractPath, contractBytes);

  const codeId = await storeWASM(
    {
      home: path.join(os.homedir(), ".teritorid"),
      binaryPath: "teritorid",
      keyringBackend,
    },
    wallet,
    destinationNetwork,
    contractPath,
  );

  console.log(codeId);

  fs.unlinkSync(contractPath);
};

main();
