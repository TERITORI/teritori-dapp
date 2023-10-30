import { SigningCosmWasmClient } from "@cosmjs/cosmwasm-stargate";
import { DirectSecp256k1HdWallet } from "@cosmjs/proto-signing";
import { GasPrice } from "@cosmjs/stargate";
import { program } from "commander";
import fs from "fs";
import readline from "readline";

import { TeritoriSocialFeedClient } from "../contracts-clients/teritori-social-feed/TeritoriSocialFeed.client";
import { mustGetCosmosNetwork } from "../networks";

const main = async () => {
  program.argument("<fees-json-path>");
  program.parse();

  const [feesJSONPath] = program.args as [string];

  const feesJSON = fs.readFileSync(feesJSONPath, "utf8");
  const feesByCategory: { [key: number]: string } = JSON.parse(feesJSON);

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  rl.question("Mnemonic: ", async (mnemonic) => {
    const networkId = "teritori-testnet";
    const gasPrice = GasPrice.fromString("0.025utori");

    const network = mustGetCosmosNetwork(networkId);
    if (!network.socialFeedContractAddress) {
      throw new Error("Arena contract address not found in network config");
    }
    const signer = await DirectSecp256k1HdWallet.fromMnemonic(mnemonic, {
      prefix: network.addressPrefix,
    });
    const senderAddress = (await signer.getAccounts())[0].address;
    const cosmwasmClient = await SigningCosmWasmClient.connectWithSigner(
      network.rpcEndpoint,
      signer,
      { gasPrice }
    );
    const client = new TeritoriSocialFeedClient(
      cosmwasmClient,
      senderAddress,
      network.socialFeedContractAddress
    );
    for (const [category, fee] of Object.entries(feesByCategory)) {
      await client.updateFeeByCategory({
        category: +category,
        fee,
      });
      console.log("done for category", category, "with fee", fee);
    }
  });
};

main();
