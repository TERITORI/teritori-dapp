import child_process from "child_process";
import { program } from "commander";
import fs from "fs";
import path from "path";
import { z } from "zod";

import { getCosmosNetwork } from "../networks";
import { safeParseJSON } from "../utils/sanitize";

const zodStoreResult = z.object({
  height: z.string(),
  txhash: z.string(),
  events: z.array(
    z.object({
      type: z.string(),
      attributes: z.array(
        z.object({
          key: z.string().transform((v) => Buffer.from(v, "base64").toString()),
          value: z
            .string()
            .transform((v) => Buffer.from(v, "base64").toString()),
        }),
      ),
    }),
  ),
});

const main = async () => {
  program.argument("<network-id>", "network id");
  program.argument("<wallet>", "wallet name");
  program.argument("<contract>", "contract name");
  program.option("-k, --keyring-backend <name>", "keyring-backend");
  program.parse(process.argv);
  const [networkId, wallet, contractName] = program.args;
  const { keyringBackend } = program.opts() as { keyringBackend?: string };

  const contractDir = path.join(
    __dirname,
    "..",
    "..",
    "cosmwasm",
    contractName,
  );
  if (!fs.existsSync(contractDir)) {
    console.error(
      `Contract ${contractName} does not exist (at ${contractDir})`,
    );
    process.exit(1);
  }
  const artifact = path.join(contractDir, "artifacts", `${contractName}.wasm`);

  const network = getCosmosNetwork(networkId);
  if (!network) {
    console.error(`Network ${networkId} does not exist`);
    process.exit(1);
  }

  const buildCommand = `docker run \
    --rm -v "${contractDir}":/code \
    --mount type=volume,source=${contractName}_cache,target=/target \
    --mount type=volume,source=registry_cache,target=/usr/local/cargo/registry \
    cosmwasm/rust-optimizer:0.15.0`.replace(/\s+/g, " ");
  console.log("> " + buildCommand);
  try {
    child_process.execSync(buildCommand, { stdio: "inherit" });
  } catch {
    console.error("Error building contract");
    process.exit(1);
  }

  let rpc = network.rpcEndpoint;
  const rpcURL = new URL(rpc);
  if (rpcURL.port === "" && rpcURL.protocol === "https:") {
    rpcURL.protocol = "ftp:";
    rpcURL.port = "443";
    rpc = "https" + rpcURL.toString().substring("ftp".length);
  }

  const storeCommand = `teritorid tx wasm store ${artifact} \
    --from ${wallet} \
    --gas auto \
    --gas-adjustment 1.3 \
    --broadcast-mode block \
    ${keyringBackend ? `--keyring-backend ${keyringBackend} ` : ""} \
    --chain-id ${network.chainId} \
    --node ${rpc} \
    -o json \
    --yes`.replace(/\s+/g, " ");
  console.log("> " + storeCommand);
  try {
    const output = child_process.execSync(storeCommand, {
      encoding: "utf-8",
    });
    try {
      const result = zodStoreResult.parse(safeParseJSON(output));
      const event = result.events.find((ev) => ev.type === "store_code");
      if (!event) {
        console.error("Missing store_code event in result");
        process.exit(1);
      }
      const codeId = event.attributes.find((attr) => attr.key === "code_id");
      if (!codeId) {
        console.error(
          "Missing code_id attribute in store_code event",
          JSON.stringify(result),
        );
        process.exit(1);
      }
      console.log(
        JSON.stringify(
          {
            codeId: parseInt(codeId.value, 10),
            txHash: result.txhash,
            height: result.height,
          },
          null,
          2,
        ),
      );
    } catch (e) {
      console.error("Error parsing store result:", e);
      process.exit(1);
    }
  } catch {
    console.error("Error storing contract");
    process.exit(1);
  }
};

main();
