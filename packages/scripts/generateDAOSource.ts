import { program } from "commander";
import { z } from "zod";

import { gnoDevNetwork } from "@/networks/gno-dev";
import { GnoDAOConfig } from "@/utils/gnodao/deploy";
import { generateMembershipDAOSource } from "@/utils/gnodao/generateMembershipDAOSource";
import { generateRolesDAOSource } from "@/utils/gnodao/generateRolesDAOSource";

// example usage: `npx tsx packages/scripts/generateDAOSource.ts roles | gofmt > my_dao.gno`

const kindSchema = z.union([z.literal("membership"), z.literal("roles")]);

const main = () => {
  const [kindArg] = program.argument("<kind>").parse().args;
  const kind = kindSchema.parse(kindArg);

  const network = gnoDevNetwork;

  const config: GnoDAOConfig = {
    name: "my_dao",
    displayName: "My DAO",
    description: "Some DAO",
    imageURI:
      "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=1080&fit=max",
    maxVotingPeriodSeconds: 60 * 60 * 24 * 42, // 42 days
    roles: [
      { name: "fooer", color: "#111111", resources: ["fooing"] },
      { name: "barer", color: "#777777", resources: ["baring", "bazing"] },
    ],
    initialMembers: [
      {
        address: "g1fakeaddr",
        weight: 42,
        roles: ["fooer", "barer"],
      },
      {
        address: "g1fakeaddr2",
        weight: 21,
        roles: [],
      },
    ],
    thresholdPercent: 0.66,
    quorumPercent: 0.33,
  };

  let source: string;
  switch (kind) {
    case "membership":
      source = generateMembershipDAOSource(network.id, config);
      break;
    case "roles":
      source = generateRolesDAOSource(network.id, config);
      break;
    default:
      throw new Error("unknown dao structure");
  }
  console.log(source);
};

main();
