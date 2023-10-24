import { SigningCosmWasmClient } from "@cosmjs/cosmwasm-stargate";
import { DirectSecp256k1HdWallet } from "@cosmjs/proto-signing";
import { GasPrice } from "@cosmjs/stargate";

import { mnemonic } from "./arenaAdminMnemonic";
import { ArenaClient } from "../contracts-clients/arena/Arena.client";
import { mustGetCosmosNetwork } from "../networks";

const networkId = "teritori-testnet";
const gasPrice = GasPrice.fromString("0.025utori");

const main = async () => {
  const network = mustGetCosmosNetwork(networkId);
  if (!network.arenaContractAddress) {
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
  const arenaClient = new ArenaClient(
    cosmwasmClient,
    senderAddress,
    network.arenaContractAddress
  );
  const res = await arenaClient.createGame("auto");
  const game_id = res.events
    .find((ev) => ev.type === "wasm")
    ?.attributes.find((attr) => attr.key === "arena_game_id")?.value;
  if (game_id) {
    console.log(game_id);
  } else {
    console.log(res);
  }
};

main();
