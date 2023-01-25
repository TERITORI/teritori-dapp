import fs from "fs";
//Webpack has some issue while importing nft.storage
//https://github.com/nftstorage/nft.storage/issues/876#issuecomment-985687135
import { NFTStorage, File } from "nft.storage/dist/bundle.esm.min.js";
import path from "path";

import config from "./config.json";

const assertOnlyNumbers = (str: string) => {
  if (!/^[0-9]+$/.test(str)) {
    throw new Error("string is not a number");
  }
};

const compare = (a: string, b: string) => {
  const ans = a.split(".")[0];
  assertOnlyNumbers(ans);
  const an = parseInt(ans, 10);
  const bns = b.split(".")[0];
  assertOnlyNumbers(bns);
  const bn = parseInt(bns, 10);
  return an - bn;
};

export async function nftStorageUpload(apiToken: string) {
  const client = new NFTStorage({ token: apiToken });

  console.log("🔼 Deploying files to IPFS via NFT.Storage");

  const imagesBasePath = path.join(__dirname, "images");
  const metadataBasePath = path.join(__dirname, "metadata");

  // Get list of images and metadata
  const images = fs.readdirSync(imagesBasePath);
  const metadata = fs.readdirSync(metadataBasePath);

  if (!metadata.length) {
    throw new Error("no metadata files");
  }

  if (images.length - 1 !== metadata.length) {
    throw new Error("mismatch in the number of images and metadata");
  }

  // FIXME: check that the metadata indices start at 0 and are all consecutive

  // Sort files (need to be in natural order)
  metadata.sort(compare);

  // FIXME: validate metadata

  // FIXME: check that there is an image file for every metadata file

  // TODO: sort images in virtual dir

  // Upload images folder
  const imagesVirtualDir: File[] = [];
  for (const imageFile of images) {
    const fileData = fs.readFileSync(path.join(imagesBasePath, imageFile));
    imagesVirtualDir.push(new File([fileData], imageFile));
  }
  const imagesCID = await client.storeDirectory(imagesVirtualDir);

  const metadataVirtualDir: File[] = [];

  // Update metadata with IPFS hashes
  metadata.map(async (file, index: number) => {
    // Read JSON file
    const metadata = JSON.parse(
      fs.readFileSync(`${metadataBasePath}/${file}`, "utf8")
    );

    // Set image to upload image IPFS hash
    metadata.image = `ipfs://${imagesCID}/${index}.png`;

    metadataVirtualDir.push(new File([JSON.stringify(metadata)], file));
  });

  const collectionConfig = JSON.parse(
    fs.readFileSync(path.join(__dirname, "collection.json"), "utf8")
  );
  const collectionMetadata = {
    image: `ipfs://${imagesCID}/collection.png`,
    description: collectionConfig.description,
    twitter: collectionConfig.twitter,
    discord: collectionConfig.discord,
    website: collectionConfig.website,
  };
  metadataVirtualDir.push(
    new File([JSON.stringify(collectionMetadata)], "collection.json")
  );

  // Upload tmpFolder
  const metadataCID = await client.storeDirectory(metadataVirtualDir);

  // Set base token uri
  const baseTokenUri = `ipfs://${metadataCID}`;

  console.log("✅ Done deploying files to IPFS");
  console.log("🔗 URI:", baseTokenUri);

  return {
    baseTokenUri,
    numTokens: metadata.length,
  };
}

interface NftStorageFileProps {
  file: File;
  name?: string;
  description?: string;
  nftStorageApiToken: string;
}

export const nftStorageFile = async ({
  file,
  name = "",
  description = "",
  nftStorageApiToken,
}: NftStorageFileProps) => {
  try {
    const storageClient = new NFTStorage({ token: nftStorageApiToken });
    const metadata = await storageClient.store({
      image: file,
      name,
      description,
    });

    return metadata;
  } catch (err) {
    console.log("upload err", err);
  }
};
