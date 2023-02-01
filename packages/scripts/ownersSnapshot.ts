import fs from "fs";

import { snapshotCollectionOwners } from "../utils/snapshots";
import { nodeBackendClient } from "./lib";

// TODO: merge all snapshot scripts in a single cli that uses typesafe arguments parsing (for example https://github.com/oclif/core#usage)

const collectionId =
  "tori-tori1dxxplvjx92e5gyvtzg8zz7a3n9758mxgr0ka4vym0mzz5fk3u9ask4mcdg"; // subdao

const main = async () => {
  const countByOwner = await snapshotCollectionOwners(
    collectionId,
    nodeBackendClient
  );
  fs.writeFileSync("owners.json", JSON.stringify(countByOwner, null, 2), {
    encoding: "utf-8",
  });
};

main();
