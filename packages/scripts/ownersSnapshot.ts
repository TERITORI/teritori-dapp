import fs from "fs";

import { mustGetNodeMarketplaceClient } from "./lib";
import { parseCollectionId } from "../networks";
import { snapshotCollectionOwners } from "../utils/snapshots";

// TODO: merge all snapshot scripts in a single cli that uses typesafe arguments parsing (for example https://github.com/oclif/core#usage)

const collectionId =
  "tori-tori1dxxplvjx92e5gyvtzg8zz7a3n9758mxgr0ka4vym0mzz5fk3u9ask4mcdg"; // subdao

const main = async () => {
  const [network] = parseCollectionId(collectionId);
  if (!network) {
    throw new Error("unknown collection network");
  }
  const client = mustGetNodeMarketplaceClient(network.id);
  const countByOwner = await snapshotCollectionOwners(collectionId, client);
  fs.writeFileSync("owners.json", JSON.stringify(countByOwner, null, 2), {
    encoding: "utf-8",
  });
};

main();
