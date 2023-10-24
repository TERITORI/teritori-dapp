import { SigningCosmWasmClient } from "@cosmjs/cosmwasm-stargate";
import { DirectSecp256k1HdWallet } from "@cosmjs/proto-signing";
import { GasPrice } from "@cosmjs/stargate";

import { mnemonic } from "./arenaAdminMnemonic";
import { InstantiateMsg } from "../contracts-clients/arena/Arena.types";
import { mustGetCosmosNetwork } from "../networks";

const codeId = 173;
const networkId = "teritori-testnet";
const itemsCollectionAddress =
  "tori1p6yrgrgz44nv4fsyunx40zg5rsxey9rgq6ev7dq5slsu2yd3wkuss3ymnc";
const gasPrice = GasPrice.fromString("0.025utori");

// arena contract address: tori1twz5she587qrqral8mkgwxzr6nsgfduc5gzrr9zgd5n2yryxxd5sa6cqxk
// tx hash: 5E1F5355E8CD83871DBA38110F82A1E1EABE032F5C4F4B49910D67C7C90298D0

const main = async () => {
  const network = mustGetCosmosNetwork(networkId);
  const signer = await DirectSecp256k1HdWallet.fromMnemonic(mnemonic, {
    prefix: network.addressPrefix,
  });
  const senderAddress = (await signer.getAccounts())[0].address;
  const cosmwasmClient = await SigningCosmWasmClient.connectWithSigner(
    network.rpcEndpoint,
    signer,
    { gasPrice }
  );
  const msg: InstantiateMsg = {
    admin: senderAddress,
    allowed_authorities: [senderAddress],
    allowed_collections: [itemsCollectionAddress],
  };
  const res = await cosmwasmClient.instantiate(
    senderAddress,
    codeId,
    msg,
    "Arena",
    "auto"
  );
  console.log(res);
};

main();
