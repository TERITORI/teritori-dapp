import { SigningCosmWasmClient } from "@cosmjs/cosmwasm-stargate";
import { DirectSecp256k1HdWallet } from "@cosmjs/proto-signing";
import { GasPrice } from "@cosmjs/stargate";
import * as fs from "fs";
import path from "path";

// import { MNEMONIC } from "./mnemonic";

const GAS_PRICE = GasPrice.fromString("0.025utori");

const NODE_RPC = "https://rpc.testnet.teritori.com:443";
// const CHAIN_ID = "teritori-test-7";

export const getClientInfos = async () => {
  const wallet = await DirectSecp256k1HdWallet.fromMnemonic(
    "???",
    // MNEMONIC
    {
      prefix: "tori",
    },
  );

  const client = await SigningCosmWasmClient.connectWithSigner(
    NODE_RPC,
    wallet,
    { gasPrice: GAS_PRICE },
  );

  const sender = await wallet.getAccounts().then((res) => res[0]?.address);

  console.log("Sender:", sender);

  return { wallet, client, sender };
};

const getWasmFile = (wasmFile: string) => {
  const filePath = path.join(__dirname, "../..", "artifacts", wasmFile);
  console.log("filePath:", filePath);
  return fs.readFileSync(filePath);
};

export const deploy = async (wasmFile: string) => {
  const { client, sender } = await getClientInfos();
  const uploadRes = await client.upload(sender, getWasmFile(wasmFile), "auto");

  return uploadRes.codeId;
};

export const instantiate = async (codeId: number, label: string, msg: any) => {
  const { client, sender } = await getClientInfos();

  const instantiateRes = await client.instantiate(
    sender,
    codeId,
    msg,
    `${label} - ${codeId}`,
    "auto",
  );
  return instantiateRes.contractAddress;
};
