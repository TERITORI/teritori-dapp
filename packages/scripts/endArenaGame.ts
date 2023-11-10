import { SigningCosmWasmClient } from "@cosmjs/cosmwasm-stargate";
import { DirectSecp256k1HdWallet } from "@cosmjs/proto-signing";
import { GasPrice } from "@cosmjs/stargate";
import cliSelect from "cli-select";
import { program } from "commander";
import { cloneDeep } from "lodash";

import { mnemonic } from "./arenaAdminMnemonic";
import { ArenaClient } from "../contracts-clients/arena/Arena.client";
import { Redistribution } from "../contracts-clients/arena/Arena.types";
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
  const players = await arenaClient.getGamePlayers({ gameId });
  const playersItems = await Promise.all(
    players.map(async (player) => {
      const items = await arenaClient.getPlayerItems({
        playerAddr: player,
      });
      return items;
    })
  );
  const itemsByPlayer: { [key: string]: [string, string][] } = {};
  for (let i = 0; i < players.length; i++) {
    itemsByPlayer[players[i]] = playersItems[i];
  }
  console.log("Select winner:");
  let { value } = await cliSelect({ values: ["random", ...players] });
  if (value === "random") {
    const randomIndex = Math.floor(Math.random() * players.length);
    value = players[randomIndex];
  }
  console.log("Winner:", value);

  const otherPlayersItems = cloneDeep(itemsByPlayer);
  delete otherPlayersItems[value];
  const redistributions: Redistribution[] = [];

  for (const [player, items] of Object.entries(otherPlayersItems)) {
    for (const item of items) {
      redistributions.push({
        from_addr: player,
        to_addr: value,
        nft_contract_addr: item[0],
        nft_token_id: item[1],
      });
    }
  }
  console.log("Redistributions:");
  console.log(redistributions);
  console.log("Confirm:");
  const { value: confirm } = await cliSelect({ values: ["yes", "no"] });
  if (confirm !== "yes") {
    console.log("Aborted");
    return;
  }
  console.log("Confirmed!");

  const res = await arenaClient.endGame({ gameId, redistributions }, "auto");
  console.log(res);
};

main();
