import { NodeHttpTransport } from "@improbable-eng/grpc-web-node-http-transport";
import { Buffer } from "buffer";
import child_process, { ChildProcess, PromiseWithChild } from "child_process";
import fs from "fs/promises";
import util from "util";
import { z } from "zod";

import {
  GrpcWebImpl as MarketplaceGrpcWebImpl,
  MarketplaceServiceClientImpl,
} from "@/api/marketplace/v1/marketplace";
import {
  GrpcWebImpl as MultisigGrpcWebImpl,
  MultisigServiceClientImpl,
} from "@/api/multisig/v1/multisig";
import { getNetwork } from "@/networks";

export const mustGetNodeMultisigClient = (networkId: string | undefined) => {
  const network = getNetwork(networkId);
  let endpoint = process.env.MULTISIG_BACKEND_URL;
  if (!endpoint) {
    if (network?.testnet) {
      endpoint = "https://multisig.testnet.teritori.com";
    } else {
      endpoint = "https://multisig.mainnet.teritori.com";
    }
  }
  const rpc = new MultisigGrpcWebImpl(endpoint, {
    transport: NodeHttpTransport(),
    debug: false,
  });
  return new MultisigServiceClientImpl(rpc);
};

export const mustGetNodeMarketplaceClient = (networkId: string) => {
  const network = getNetwork(networkId);
  if (!network) {
    throw new Error("network not found");
  }
  const rpc = new MarketplaceGrpcWebImpl(network.backendEndpoint, {
    transport: NodeHttpTransport(),
    debug: false,
    // metadata: new grpc.Metadata({ SomeHeader: "bar" }),
  });

  return new MarketplaceServiceClientImpl(rpc);
};

export const retry = async <T>(
  retries: number,
  fn: () => Promise<T> | T,
): Promise<T> => {
  let lastError;
  for (let i = 0; i < retries; i++) {
    try {
      return await fn();
    } catch (e) {
      lastError = e;
      await sleep(500);
    }
  }
  if (lastError) {
    throw lastError;
  }
  throw new Error("unreachable");
};

export const injectRPCPort = (rpcEndpoint: string) => {
  const u = new URL(rpcEndpoint);
  if (u.protocol === "https:" && u.port === "") {
    u.protocol = "ftp:";
    u.port = "443";
    return u.toString().replace("ftp:", "https:");
  }
  if (u.protocol === "http:" && u.port === "") {
    u.protocol = "ftp:";
    u.port = "80";
    return u.toString().replace("ftp:", "http:");
  }
  return rpcEndpoint;
};

export const zodTxResult = z.object({
  height: z.string(),
  txhash: z.string(),
  events: z.array(
    z.object({
      type: z.string(),
      attributes: z.array(
        z.object({
          key: z.string().transform((v) => Buffer.from(v, "base64").toString()),
          value: z
            .string()
            .transform((v) => Buffer.from(v, "base64").toString()),
        }),
      ),
    }),
  ),
});

type TxResult = z.infer<typeof zodTxResult>;

const getAttr = (tx: TxResult, eventKey: string, attrKey: string) => {
  return tx?.events
    .find((e) => e.type === eventKey)
    ?.attributes.find((a) => a.key === attrKey)?.value;
};

export const mustGetAttr = (
  tx: TxResult,
  eventKey: string,
  attrKey: string,
) => {
  const val = getAttr(tx, eventKey, attrKey);
  if (!val) {
    throw new Error(`Failed to get ${eventKey}.${attrKey}`);
  }
  return val;
};

export const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export const replaceInFile = async (
  filePath: string,
  match: string | RegExp,
  repl: string,
) => {
  console.log("🔧 Editing file " + filePath);
  const data = await fs.readFile(filePath, { encoding: "utf-8" });
  const newData = data.replace(match, repl);
  await fs.writeFile(filePath, newData);
  console.log("🔧 Edited file " + filePath);
};

export const execPromise = util.promisify(child_process.exec);

export const killProcess = async (
  p: ChildProcess,
  r: PromiseWithChild<{
    stdout: string;
    stderr: string;
  }>,
  timeout?: number,
) => {
  console.log("🔪 Killing process");
  const innerKillProcess = async () => {
    p.stdin?.destroy();
    p.kill();
    console.log("⏳ Waiting for process to terminate");
    await r;
  };
  const startTimeout = async () => {
    await sleep(timeout || 20000);
    throw new Error("Timed out waiting for process to terminate");
  };
  await Promise.race([startTimeout(), innerKillProcess()]);
  console.log("🔪 Process terminated");
};
