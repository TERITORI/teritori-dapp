import fs from "fs";

import { mustGetNodeMarketplaceClient } from "./lib";
import { parseCollectionId } from "../networks";
import { snapshotCollectionOGs } from "../utils/snapshots";

// TODO: merge all snapshot scripts in a single cli that uses typesafe arguments parsing (for example https://github.com/oclif/core#usage)

const collectionId =
  "tori-tori1plr28ztj64a47a32lw7tdae8vluzm2lm7nqk364r4ws50rgwyzgsapzezt"; // punks

const main = async () => {
  const [network] = parseCollectionId(collectionId);
  if (!network) {
    throw new Error("unknown collection network");
  }
  const client = mustGetNodeMarketplaceClient(network.id);
  const hodlers = await snapshotCollectionOGs(collectionId, client);
  fs.writeFileSync("hodlers.json", JSON.stringify(hodlers, null, 2), {
    encoding: "utf-8",
  });
};

main();
