import { program } from "commander";
import fs from "fs";
import path from "path";

import { readJSONSync, writeJSONSync } from "./lib";

type GenInfo = { [key: string]: { count: number } };

const main = async () => {
  program.argument("<gen-info-file>", "path to gen-info file");
  program.argument("<out-dir>", "output directory");
  program.parse();

  const [genInfoPathInput, outDirInput] = program.args as [string, string];

  const outDirPath = path.resolve(outDirInput);
  const metadataOutDirPath = path.join(outDirPath, "metadata");

  const genInfoPath = path.resolve(genInfoPathInput);
  const genInfo: GenInfo = readJSONSync(genInfoPath);
  const genInfoDirPath = path.dirname(genInfoPath);

  fs.mkdirSync(metadataOutDirPath, { recursive: true });

  const collectionInfo = readJSONSync(
    path.join(genInfoDirPath, "collection.json")
  );
  for (const filename of [
    "collection.json",
    collectionInfo.image,
    collectionInfo.banner,
  ]) {
    const filePath = path.join(genInfoDirPath, filename);
    fs.copyFileSync(filePath, path.join(outDirPath, filename));
  }

  let nextTokenId = 1;
  for (const [itemInfoFilename, itemGenInfo] of Object.entries(genInfo)) {
    const itemInfoPath = path.join(genInfoDirPath, itemInfoFilename);
    const itemInfo = readJSONSync(itemInfoPath);

    const imageFilename = itemInfo.image;
    const imageFilePath = path.join(genInfoDirPath, imageFilename);
    fs.copyFileSync(
      imageFilePath,
      path.join(metadataOutDirPath, imageFilename)
    );

    for (let i = 0; i < itemGenInfo.count; i++) {
      const outItemJSONPath = path.join(
        metadataOutDirPath,
        `${nextTokenId}.json`
      );
      writeJSONSync(outItemJSONPath, itemInfo);
      nextTokenId += 1;
    }
  }
};

main();
