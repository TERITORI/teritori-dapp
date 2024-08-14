import { faker } from "@faker-js/faker";
import * as child_process from "child_process";
import { program } from "commander";
import { capitalize, range } from "lodash";

import sqh from "./sqh";

import { NetworkFeature, getGnoNetwork, getNetworkFeature } from "@/networks";
import { ProjectMetadata, ProjectShortDescData } from "@/utils/projects/types";

const main = async () => {
  program
    .option("-n, --network <network>", "Network ID")
    .option("-w, --wallet <wallet>", "Wallet name")
    .option("-a, --addr <address>", "Wallet address")
    .option("-r, --arbit <arbitrator>", "Arbitrator address")
    .option("-c, --count <count>", "Number of projects to create")
    .parse();

  const opts = program.opts() as {
    network: string;
    wallet: string;
    count: string;
    addr: string;
    arbit: string;
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
    const shortDescData: ProjectShortDescData = {
      name: faker.lorem.sentence(3).slice(0, -1),
      desc:
        capitalize(faker.hacker.phrase()) + "\n\n" + faker.lorem.paragraphs(10),
      tags: [
        ...new Set(
          range(0, faker.number.int({ min: 3, max: 10 })).map(() =>
            faker.hacker.noun(),
          ),
        ),
      ].join(","),
      coverImg: faker.image.urlPicsumPhotos(),
    };

    if (faker.helpers.maybe(() => true)) {
      shortDescData.sourceLink =
        "https://github.com/" + faker.person.firstName().toLowerCase();
    }

    const metadata: ProjectMetadata = {
      shortDescData,
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

    const cmd = `gnokey maketx call -insecure-password-stdin -pkgpath ${sqh(pmFeature.projectsManagerPkgPath)} -func "CreateContractJSON" -gas-fee 1000000ugnot -gas-wanted 10000000 -send "${totalPrice}ugnot" -broadcast -chainid ${sqh(network.chainId)} -args "" -args ${sqh(opts.addr)} -args ${sqh(pmFeature.paymentsDenom)} -args ${sqh(JSON.stringify(metadata))} -args "200000" -args ${sqh(JSON.stringify(milestones))} -args ${sqh(opts.arbit)} -remote ${sqh(network.endpoint)} ${sqh(opts.wallet)}`;
    console.log(">", cmd);
    child_process.execSync(cmd, { input: "\n" });
  }
};

main();
