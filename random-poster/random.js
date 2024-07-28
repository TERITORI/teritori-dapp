import { faker } from "@faker-js/faker";
import moment from "moment";
import { exec } from "child_process";

// Function to generate a random metadata object
function randomMetadata() {
  const fileNames = ["calanques.jpg", "paris.jpg", "london.jpg", "madrid.jpg"];
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
      faker.number.float({ min: 40, max: 50, precision: 0.0001 }),
      faker.number.float({ min: -5, max: 5, precision: 0.0001 }),
    ],
    title: "",
    createdAt: moment(
      faker.date.between({ from: "2023-01-01", to: "2024-12-31" }),
    ).toISOString(),
  };
}
async function main() {
  const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  // Generate the random data structure
  for (let i = 0; i < 100; i++) {
    let metadataPased = JSON.stringify(
      JSON.stringify(randomMetadata()).replace(/"/g, '\\"'),
    );
    console.log(metadataPased);
    await exec(
      `make add_post metadata=${metadataPased}`,
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
