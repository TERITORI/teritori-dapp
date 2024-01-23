import child_process from "child_process";
import { program } from "commander";

import { mustGetCosmosNetwork } from "../networks";
import { prettyPrice } from "../utils/coins";

// TODO: retry policy

const batchSize = 100;

const main = async () => {
  // FIXME: use typesafe commander
  program.argument("<network-id>");
  program.option("-p, --pretty", "human readable output", "");
  program.parse();
  const [networkId] = program.args as [string];
  const { pretty } = program.opts() as { pretty?: boolean };

  const network = mustGetCosmosNetwork(networkId);

  const rawEndpoint = new URL(network.rpcEndpoint);
  let port = rawEndpoint.port;
  if (!port) {
    if (rawEndpoint.protocol === "https:") {
      port = "443";
    } else if (rawEndpoint.protocol === "http:") {
      port = "80";
    } else {
      throw new Error(`Unsupported protocol: ${rawEndpoint.protocol}`);
    }
  }
  const endpoint = `${rawEndpoint.protocol}//${rawEndpoint.host}:${port}${rawEndpoint.pathname}`;

  // we need to use teritorid since the js client timeouts

  const statusCmd = `teritorid status --node '${endpoint}'`;
  const res = child_process.spawnSync(statusCmd, { shell: true });
  const statusJSON = res.stderr.toString();
  // FIXME: sanitize
  // eslint-disable-next-line no-restricted-syntax
  const status = JSON.parse(statusJSON);
  const latestBlockHeight: string = status.SyncInfo.latest_block_height; // FIXME: sanitize

  let page = 1;
  const totals: { [key: string]: number } = {};

  while (true) {
    const cmd = `teritorid query txs --height ${latestBlockHeight} --events message.action=/teritori.mint.v1beta1.MsgBurnTokens --node '${endpoint}' --limit ${batchSize} --page ${page} -o json`;
    const burnTxsJSON = child_process.execSync(cmd).toString();
    // FIXME: sanitize
    // eslint-disable-next-line no-restricted-syntax
    const txs = JSON.parse(burnTxsJSON);

    for (const tx of txs.txs) {
      const burnValue = getEventValue(tx.events, "burn", "amount");
      if (!burnValue) {
        continue;
      }
      const burnAmount = parseInt(burnValue, 10);
      const denom = burnValue.substring(burnAmount.toString().length);
      totals[denom] = (totals[denom] || 0) + burnAmount;
    }

    if (page >= +txs.page_total) {
      break;
    }

    page++;
  }

  if (pretty) {
    for (const [denom, amount] of Object.entries(totals)) {
      console.log(prettyPrice(networkId, amount.toString(), denom));
    }
  } else {
    console.log(totals);
  }
};

const getEventValue = (events: any, type: string, key: string) => {
  for (const event of events) {
    if (event.type === type) {
      for (const attribute of event.attributes) {
        const attrKey = Buffer.from(attribute.key, "base64").toString();
        if (attrKey === key) {
          return Buffer.from(attribute.value, "base64").toString();
        }
      }
    }
  }
};

main();
