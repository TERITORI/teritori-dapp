import fs from "fs";

import { mustGetNodeMarketplaceClient } from "./lib";
import { parseCollectionId } from "../networks";
import { snapshotCollectionOwnersWithIds } from "../utils/snapshots";

// TODO: merge all snapshot scripts in a single cli that uses typesafe arguments parsing (for example https://github.com/oclif/core#usage)

const collectionId =
  "tori-tori1sz52w4uk2y5datsc3jj64p0s8ya5u93n43d39hx7s4633enscmzqvaw094"; // cosmon

const main = async () => {
  const [network] = parseCollectionId(collectionId);
  if (!network) {
    throw new Error("unknown collection network");
  }
  const client = mustGetNodeMarketplaceClient(network.id);
  const listByOwner = await snapshotCollectionOwnersWithIds(
    collectionId,
    client,
  );
  fs.writeFileSync(
    "owners-details.json",
    JSON.stringify(listByOwner, null, 2),
    {
      encoding: "utf-8",
    },
  );
};

main();
