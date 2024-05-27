import { faker } from "@faker-js/faker";
import * as child_process from "child_process";
import { program } from "commander";
import { capitalize, range } from "lodash";

import sqh from "./sqh";

import { NetworkFeature, getGnoNetwork, getNetworkFeature } from "@/networks";

const main = async () => {
  program
    .option("-n, --network <network>", "Network ID")
    .option("-w, --wallet <wallet>", "Wallet name")
    .option("-c, --count <count>", "Number of projects to create")
    .parse();

  const opts = program.opts() as {
    network: string;
    wallet: string;
    count: string;
  };

  const count = parseInt(opts.count, 10);
  if (isNaN(count) || count <= 0) {
    throw new Error("Invalid count");
  }

  const network = getGnoNetwork(opts.network);
  if (!network) {
    throw new Error("Network not found");
  }
  const pmFeature = getNetworkFeature(
    network.id,
    NetworkFeature.GnoProjectManager,
  );
  if (!pmFeature) {
    throw new Error("Project manager feature not found");
  }

  console.log(
    `Creating ${count} projects on ${network.displayName} with ${opts.wallet} wallet`,
  );

  for (let i = 0; i < count; i++) {
    const teamAndLinkData: Record<string, string> = {};

    if (faker.helpers.maybe(() => true)) {
      teamAndLinkData.websiteLink = faker.internet.url();
    }
    if (faker.helpers.maybe(() => true)) {
      teamAndLinkData.twitterProfile =
        "@" + faker.person.firstName().toLowerCase();
    }
    if (faker.helpers.maybe(() => true)) {
      teamAndLinkData.discordLink = "https://discord.com";
    }
    if (faker.helpers.maybe(() => true)) {
      teamAndLinkData.githubLink =
        "https://github.com/" + faker.person.firstName().toLowerCase();
    }
    if (faker.helpers.maybe(() => true)) {
      teamAndLinkData.teamDesc = faker.lorem.paragraph();
    }

    const metadata = {
      shortDescData: {
        name: faker.lorem.sentence(3).slice(0, -1),
        desc:
          capitalize(faker.hacker.phrase()) +
          "\n\n" +
          faker.lorem.paragraphs(10),
        tags: [
          ...new Set(
            range(0, faker.number.int({ min: 3, max: 10 })).map(() =>
              faker.hacker.noun(),
            ),
          ),
        ].join(","),
        coverImg: faker.image.urlPicsumPhotos(),
      },
      teamAndLinkData,
    };

    const milestones = [];
    for (let j = 0; j < faker.number.int({ min: 3, max: 6 }); j++) {
      milestones.push({
        title: faker.lorem.sentence(3).slice(0, -1),
        desc: faker.lorem.paragraphs(3),
        priority: faker.helpers.arrayElement([
          "MS_PRIORITY_HIGH",
          "MS_PRIORITY_MEDIUM",
          "MS_PRIORITY_LOW",
        ]),
        amount: faker.number
          .bigInt({ min: "420000", max: "4200000" })
          .toString(),
        duration: faker.number.bigInt({ min: "3600", max: "36000" }).toString(),
        link: faker.internet.url(),
      });
    }

    const totalPrice = milestones.reduce(
      (acc, m) => acc + BigInt(m.amount),
      BigInt(0),
    );

    const cmd = `gnokey maketx call -insecure-password-stdin -pkgpath ${sqh(pmFeature.projectsManagerPkgPath)} -func "CreateContractJSON" -gas-fee 1000000ugnot -gas-wanted 10000000 -send "${totalPrice}ugnot" -broadcast -chainid ${sqh(network.chainId)} -args "" -args "g1xfjfdfyka23agew9g6qst030pr85q0ggac7vuj" -args ${sqh(pmFeature.paymentsDenom)} -args ${sqh(JSON.stringify(metadata))} -args "200000" -args ${sqh(JSON.stringify(milestones))} -args "g108cszmcvs4r3k67k7h5zuhm4el3qhlrxzhshtv" -remote ${sqh(network.endpoint)} ${sqh(opts.wallet)}`;
    console.log(">", cmd);
    child_process.execSync(cmd, { input: "\n" });
  }
};

main();
