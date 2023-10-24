import { program } from "commander";
import Long from "long";

import { ArenaQueryClient } from "../contracts-clients/arena/Arena.client";
import {
  mustGetCosmosNetwork,
  mustGetNonSigningCosmWasmClient,
} from "../networks";

const networkId = "teritori-testnet";

const cosmWasmTimestampToDate = (timestamp: string) =>
  new Date(Long.fromString(timestamp).div(1000000).toNumber());

const main = async () => {
  program.argument("<game-id>");
  program.parse();
  const [gameIdInput] = program.args;
  const gameId = parseInt(gameIdInput, 10);

  const network = mustGetCosmosNetwork(networkId);
  if (!network.arenaContractAddress) {
    throw new Error("Arena contract address not found in network config");
  }

  const cosmwasmClient = await mustGetNonSigningCosmWasmClient(networkId);
  const arenaClient = new ArenaQueryClient(
    cosmwasmClient,
    network.arenaContractAddress
  );
  const res = await arenaClient.getGame({ gameId });
  const parsedRes = {
    ...res,
    creation_time: cosmWasmTimestampToDate(res.creation_time),
    start_time: res.start_time && cosmWasmTimestampToDate(res.start_time),
    end_time: res.end_time && cosmWasmTimestampToDate(res.end_time),
  };
  console.log(parsedRes);
};

main();
