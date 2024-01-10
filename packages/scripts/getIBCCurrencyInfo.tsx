import { IBCInfo } from "@chain-registry/types";
import { ibc } from "chain-registry";
import { program } from "commander";
import nodeReadline from "node:readline";

import {
  NetworkKind,
  getCosmosNetwork,
  parseNetworkObjectId,
} from "../networks";
import { IBCCurrencyInfo } from "../networks/ibc";
import { getIBCDenom } from "../utils/ibc";

// find IBC currency info from chain-registry

const main = async () => {
  program.argument("<src-currency-id>", "source currency id");
  program.argument("<dst-network-id>", "destination network id");
  program.parse();

  const [srcCurrencyId, dstNetworkId] = program.args;

  const [srcNetwork, srcCurrencyDenom] = parseNetworkObjectId(srcCurrencyId);
  if (srcNetwork?.kind !== NetworkKind.Cosmos) {
    throw new Error(
      `invalid source currency id: ${srcCurrencyId}: invalid network`,
    );
  }
  if (!srcCurrencyDenom) {
    throw new Error(
      `invalid source currency id: ${srcCurrencyId}: invalid denom`,
    );
  }
  // console.log(`source network: ${srcNetwork.registryName}`);

  const dstNetwork = getCosmosNetwork(dstNetworkId);
  if (!dstNetwork) {
    throw new Error(`invalid destination network id: ${dstNetworkId}`);
  }
  // console.log(`destination network: ${dstNetwork.registryName}`);

  const ibcInfo = ibc
    .filter(
      (ibcInfo) =>
        (ibcInfo.chain_1.chain_name === srcNetwork.registryName &&
          ibcInfo.chain_2.chain_name === dstNetwork.registryName) ||
        (ibcInfo.chain_2.chain_name === srcNetwork.registryName &&
          ibcInfo.chain_1.chain_name === dstNetwork.registryName),
    )
    .map((ibcInfo) => {
      if (
        ibcInfo.chain_1.chain_name === srcNetwork.registryName &&
        ibcInfo.chain_2.chain_name === dstNetwork.registryName
      ) {
        return ibcInfo;
      }
      return {
        chain_1: ibcInfo.chain_2,
        chain_2: ibcInfo.chain_1,
        channels: ibcInfo.channels.map((channel) => ({
          chain_1: channel.chain_2,
          chain_2: channel.chain_1,
          ordering: channel.ordering,
          version: channel.version,
        })),
      };
    });
  if (ibcInfo.length) {
    printOutput(ibcInfo, srcNetwork.id, srcCurrencyDenom);
    return;
  }

  console.error("No IBC channel found, please enter manually...");

  const readline = nodeReadline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  const srcChannelId = await promptForString(readline, `Source channel id: `);
  const dstChannelId = await promptForString(
    readline,
    `Destination channel id: `,
  );
  readline.close();

  printOutput(
    [
      {
        chain_1: {
          chain_name: srcNetwork.registryName,
          client_id: "",
          connection_id: "",
        },
        chain_2: {
          chain_name: dstNetwork.registryName,
          client_id: "",
          connection_id: "",
        },
        channels: [
          {
            chain_1: {
              channel_id: `${srcChannelId}`,
              port_id: "transfer",
            },
            chain_2: {
              channel_id: `${dstChannelId}`,
              port_id: "transfer",
            },
            ordering: "",
            version: "",
          },
        ],
      },
    ],
    srcNetwork.id,
    srcCurrencyDenom,
  );
};

const printOutput = (
  ibcInfo: IBCInfo[],
  srcNetworkId: string,
  denom: string,
) => {
  const channels = ibcInfo.map((ibcInfo) => ibcInfo.channels).flat();
  if (!channels.length) {
    throw new Error("no IBC channel found");
  }
  const channel = channels[0];

  const currency: IBCCurrencyInfo = {
    kind: "ibc",
    denom: getIBCDenom(
      channel.chain_2.port_id,
      channel.chain_2.channel_id,
      denom,
    ),
    sourceNetwork: srcNetworkId,
    sourceDenom: denom,
    sourceChannelId: channel.chain_1.channel_id,
    sourceChannelPort: channel.chain_1.port_id,
    destinationChannelId: channel.chain_2.channel_id,
    destinationChannelPort: channel.chain_2.port_id,
  };

  console.log(JSON.stringify(currency, null, 2));
};

const promptForString = async (
  readline: nodeReadline.Interface,
  prompt: string,
) => {
  const input = await new Promise<string>((resolve) =>
    readline.question(prompt, resolve),
  );
  return input;
};

main();
