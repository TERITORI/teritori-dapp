import { faker } from "@faker-js/faker";
import { exec } from "child_process";
import moment from "moment";

// Function to generate a random metadata object
function randomMetadata() {
  // const fileNames = ["calanques.jpg", "paris.jpg", "london.jpg", "madrid.jpg"];
  const urls = [
    "ipfs://bafybeiehspbhuqp7hyoicpzhrbbmj62c6drjaulvodr2r3qgvxisr6wcya",
    "ipfs://bafybeifd23sdf23dfs23f23sdf32f23f23sdf23",
    "ipfs://bafybeig27sd87sdg72s78s6ds7g8sd7gsd7g",
    "ipfs://bafybei34f2f23f32f23f23f23f23f32f23f",
  ];
  return {
    message: faker.lorem.lines(),
    files: [
      {
        fileName: faker.image.url({ width: 400, height: 400 }),
        url: faker.helpers.arrayElement(urls),
        mimeType: "image/jpeg",
        size: faker.number.int({ min: 50000, max: 100000 }),
        fileType: "image",
      },
    ],
    gifs: [],
    hashtags: [],
    mentions: [],
    location: [
      faker.number.float({ min: -90, max: 90, precision: 0.0001 }),
      faker.number.float({ min: -180, max: 180, precision: 0.0001 }),
    ],
    title: "",
    createdAt: moment(
      faker.date.between({ from: "2023-01-01", to: "2024-12-31" }),
    ).toISOString(),
  };
}
async function main() {
  const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
  const KEY = "YOURKEY";
  const BASE = "teritori";
  const REMOTE = "http://127.0.0.1:26657";
  const CHAIN_ID = "dev";
  const PASSWORD = "PASSWORD";

  // Generate the random data structure
  for (let i = 0; i < 300; i++) {
    const metadataPased = JSON.stringify(
      JSON.stringify(randomMetadata()).replace(/"/g, '\\"'),
    );
    console.log(metadataPased);
    await exec(
      `echo ${PASSWORD} | gnokey maketx call \
      -pkgpath "gno.land/r/${BASE}/social_feeds" \
      -func="CreatePost" \
      -gas-fee="1000000ugnot" \
      -gas-wanted="3000000" \
      -remote="${REMOTE}" \
      -chainid="${CHAIN_ID}" \
      -broadcast \
      --insecure-password-stdin \
      -args 1 \
      -args 0 \
      -args 0 \
      -args "$(metadataPased)" \
      ${KEY} `,
      async (error, stdout, stderr) => {
        if (error) {
          console.error(`error: ${error.message}`);
          return;
        }

        if (stderr) {
          console.error(`stderr: ${stderr}`);
          return;
        }

        console.log(`stdout:\n${stdout}`);
      },
    );
    await delay(1000);
  }
}

main();
