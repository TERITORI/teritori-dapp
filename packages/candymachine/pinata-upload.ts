import pinataSDK from "@pinata/sdk";
import fs from "fs";
import os from "os";
import path from "path";

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

export async function pinataUpload(apiKey: string, secretKey: string) {
  const pinata = pinataSDK(apiKey, secretKey);

  console.log("🔼 Deploying files to IPFS via Pinata");

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

  // Upload images folder
  const imagesBaseUri = await pinata.pinFromFS(imagesBasePath);

  // Create temp upload folder for metadata
  const tmpFolder = fs.mkdtempSync(
    path.join(os.tmpdir(), "teritori-candymachine-")
  );
  console.log("🏠 Using temporary directory at", tmpFolder);

  // Update metadata with IPFS hashes
  metadata.map(async (file, index: number) => {
    // Read JSON file
    const metadata = JSON.parse(
      fs.readFileSync(`${metadataBasePath}/${file}`, "utf8")
    );

    // Set image to upload image IPFS hash
    metadata.image = `ipfs://${imagesBaseUri.IpfsHash}/${index}.png`;

    // Write updated metadata to tmp folder
    fs.writeFileSync(`${tmpFolder}/${index}.json`, JSON.stringify(metadata));
  });

  const collectionConfig = JSON.parse(
    fs.readFileSync(path.join(__dirname, "collection.json"), "utf8")
  );
  const collectionMetadata = {
    image: `ipfs://${imagesBaseUri.IpfsHash}/collection.png`,
    description: collectionConfig.description,
    twitter: collectionConfig.twitter,
    discord: collectionConfig.discord,
    website: collectionConfig.website,
  };
  fs.writeFileSync(
    `${tmpFolder}/collection.json`,
    JSON.stringify(collectionMetadata)
  );

  // Upload tmpFolder
  const result = await pinata.pinFromFS(tmpFolder);

  // Set base token uri
  const baseTokenUri = `ipfs://${result.IpfsHash}`;

  console.log("✅ Done uploading files to IPFS");
  console.log("🔗 URI:", baseTokenUri);

  return {
    baseTokenUri,
    numTokens: metadata.length,
  };
}
