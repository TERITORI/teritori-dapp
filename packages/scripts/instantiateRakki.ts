import child_process from "child_process";
import { program } from "commander";
import Long from "long";
import { z } from "zod";

import sqh from "./sqh";
import { InstantiateMsg } from "../contracts-clients/rakki/Rakki.types";
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
  program.argument("<code-id>", "code id");
  program.option("-k, --keyring-backend <name>", "keyring-backend");
  program.parse(process.argv);
  const [networkId, wallet, codeId] = program.args;
  const { keyringBackend } = program.opts() as { keyringBackend?: string };

  const network = getCosmosNetwork(networkId);
  if (!network) {
    console.error(`Network ${networkId} does not exist`);
    process.exit(1);
  }

  let rpc = network.rpcEndpoint;
  const rpcURL = new URL(rpc);
  if (rpcURL.port === "" && rpcURL.protocol === "https:") {
    rpcURL.protocol = "ftp:";
    rpcURL.port = "443";
    rpc = "https" + rpcURL.toString().substring("ftp".length);
  }

  const addressCommand = `teritorid keys show ${wallet} -a ${
    keyringBackend ? `--keyring-backend ${keyringBackend}` : ""
  }`.replace(/\s+/g, " ");
  console.log("> " + addressCommand);
  const address = child_process
    .execSync(addressCommand, {
      encoding: "utf-8",
    })
    .trim();

  const targetReward = "5000000";
  const ticketPrice = "1000";
  const feePer10k = 500;
  const l10k = Long.fromNumber(10_000);
  const feeAmount = Long.fromString(targetReward)
    .mul(feePer10k)
    .div(l10k.sub(feePer10k));
  const maxTickets = feeAmount
    .add(Long.fromString(targetReward))
    .div(ticketPrice)
    .add(1)
    .toNumber();
  // const totalReward = Long.fromNumber(maxTickets).mul(ticketPrice);
  // const totalFee = totalReward.mul(feePer10k).div(l10k);
  // const finalReward = totalReward.sub(totalFee);

  const payload: InstantiateMsg = {
    fee_per10k: feePer10k,
    owner: address,
    max_tickets: maxTickets,
    ticket_price: { amount: ticketPrice, denom: "utori" },
  };

  const instantiateCommand = `teritorid tx wasm instantiate ${codeId} \
    ${sqh(JSON.stringify(payload))} \
    --from ${wallet} \
    --gas auto \
    --gas-adjustment 1.3 \
    --label "Rakki" \
    --admin ${address} \
    --broadcast-mode block \
    ${keyringBackend ? `--keyring-backend ${keyringBackend}` : ""} \
    --chain-id ${network.chainId} \
    --node ${rpc} \
    -o json \
    --yes`;
  console.log("> " + instantiateCommand);
  try {
    const output = child_process.execSync(instantiateCommand, {
      encoding: "utf-8",
    });
    try {
      const result = zodStoreResult.parse(safeParseJSON(output));
      const event = result.events.find((ev) => ev.type === "instantiate");
      if (!event) {
        console.error("Missing instantiate event in result");
        process.exit(1);
      }
      const contractAddress = event.attributes.find(
        (attr) => attr.key === "_contract_address",
      );
      if (!contractAddress) {
        console.error(
          "Missing _contract_address attribute in instantiate event",
          JSON.stringify(result),
        );
        process.exit(1);
      }
      console.log(
        JSON.stringify(
          {
            contractAddress: contractAddress.value,
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
