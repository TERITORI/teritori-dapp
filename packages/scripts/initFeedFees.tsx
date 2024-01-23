import { Secp256k1HdWallet } from "@cosmjs/amino";
import {
  MsgExecuteContractEncodeObject,
  SigningCosmWasmClient,
} from "@cosmjs/cosmwasm-stargate";
import { toUtf8 } from "@cosmjs/encoding";
import { program } from "commander";
import { createInterface } from "readline";

import { PostCategory } from "../components/socialFeed/NewsFeed/NewsFeed.type";
import { ExecuteMsg } from "../contracts-clients/teritori-social-feed/TeritoriSocialFeed.types";
import { cosmosNetworkGasPrice, mustGetCosmosNetwork } from "../networks";

const main = async () => {
  program.argument("<networkId>");
  program.argument("<fee>");
  program.parse();

  const [networkId, fee] = program.args;
  const network = mustGetCosmosNetwork(networkId);

  const rl = createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  const question = (q: string) =>
    new Promise<string>((resolve) => rl.question(q, resolve));
  const mnemonic = await question("Enter your mnemonic: ");
  rl.close();
  const signer = await Secp256k1HdWallet.fromMnemonic(mnemonic, {
    prefix: network.addressPrefix,
  });
  const userAddress = (await signer.getAccounts())[0].address;

  const msgs = Object.values(PostCategory)
    .filter((c): c is number => typeof c === "number")
    .map((category) => {
      const payload: ExecuteMsg = {
        update_fee_by_category: {
          category,
          fee,
        },
      };
      const msg: MsgExecuteContractEncodeObject = {
        typeUrl: "/cosmwasm.wasm.v1.MsgExecuteContract",
        value: {
          sender: userAddress,
          contract: network.socialFeedContractAddress,
          msg: toUtf8(JSON.stringify(payload)),
          funds: [],
        },
      };
      return msg;
    });
  const cosmWasmClient = await SigningCosmWasmClient.connectWithSigner(
    network.rpcEndpoint,
    signer,
    { gasPrice: cosmosNetworkGasPrice(network, "average") },
  );
  cosmWasmClient.signAndBroadcast(userAddress, msgs, "auto");
};
main();
