import fs from "fs";

import { snapshotCollectionOGs } from "../utils/snapshots";
import { nodeBackendClient } from "./lib";

// TODO: merge all snapshot scripts in a single cli that uses typesafe arguments parsing (for example https://github.com/oclif/core#usage)

const collectionId =
  "tori-tori1plr28ztj64a47a32lw7tdae8vluzm2lm7nqk364r4ws50rgwyzgsapzezt"; // punks

const main = async () => {
  const hodlers = await snapshotCollectionOGs(collectionId, nodeBackendClient);
  fs.writeFileSync("hodlers.json", JSON.stringify(hodlers, null, 2), {
    encoding: "utf-8",
  });
};

main();
