import { Secp256k1HdWallet } from "@cosmjs/amino";
import { SigningCosmWasmClient } from "@cosmjs/cosmwasm-stargate";

import { retry } from "./lib";
import { InstantiateMsg } from "../contracts-clients/cw-address-list/CwAddressList.types";
import { cosmosNetworkGasPrice } from "../networks";
import { teritoriNetwork } from "../networks/teritori";

const codeId = 36;
const mnemo = "fill-me";
const retries = 5;

const main = async () => {
  const network = teritoriNetwork;
  const wallet = await Secp256k1HdWallet.fromMnemonic(mnemo, {
    prefix: network.addressPrefix,
  });
  const [{ address }] = await wallet.getAccounts();
  console.log("Admin:", address);
  const cosmWasmClient = await SigningCosmWasmClient.connectWithSigner(
    network.rpcEndpoint,
    wallet,
    { gasPrice: cosmosNetworkGasPrice(network, "low") },
  );
  const instantiateMsg: InstantiateMsg = {
    admin: address,
  };
  await retry(retries, async () => {
    const res = await cosmWasmClient.instantiate(
      address,
      codeId,
      instantiateMsg,
      "Collections Whitelist",
      "auto",
    );
    console.log(res);
  });
};

main();
