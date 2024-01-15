import child_process from "child_process";
import { program } from "commander";
import fs from "fs";

import {
  getCosmosNetwork,
  getNetwork,
  mustGetNonSigningCosmWasmClient,
} from "../../networks";
import { zodTryParseJSON } from "../../utils/sanitize";
import { injectRPCPort, retry, zodTxResult } from "../lib";

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

  const cmd = `teritorid tx wasm store ${contractPath} --from ${wallet} --gas auto --gas-adjustment 1.3 -y -b block --chain-id ${
    destinationNetwork.chainId
  } --node ${injectRPCPort(destinationNetwork.rpcEndpoint)} -o json${
    keyringBackend ? ` --keyring-backend ${keyringBackend}` : ""
  }`;
  console.log("> " + cmd);
  const out = child_process.execSync(cmd, {
    stdio: ["inherit", "pipe", "inherit"],
    encoding: "utf-8",
  });
  const json = out.substring(out.indexOf("{"));
  const txResult = zodTryParseJSON(zodTxResult, json);
  const codeId = txResult?.events
    .find((e) => e.type === "store_code")
    ?.attributes.find((a) => a.key === "code_id")?.value;
  if (!codeId) {
    throw new Error("Failed to parse code_id");
  }

  console.log(codeId);

  fs.unlinkSync(contractPath);
};

main();
