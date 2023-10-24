import { SigningCosmWasmClient } from "@cosmjs/cosmwasm-stargate";
import { DirectSecp256k1HdWallet } from "@cosmjs/proto-signing";
import { GasPrice } from "@cosmjs/stargate";
import { program } from "commander";

import { mnemonic } from "./arenaAdminMnemonic";
import { ArenaClient } from "../contracts-clients/arena/Arena.client";
import { mustGetCosmosNetwork } from "../networks";

const networkId = "teritori-testnet";
const gasPrice = GasPrice.fromString("0.025utori");

const main = async () => {
  program.argument("<game-id>");
  program.parse();
  const [gameIdInput] = program.args;
  const gameId = parseInt(gameIdInput, 10);

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
  const res = await arenaClient.startGame({ gameId }, "auto");
  console.log(res);
};

main();
