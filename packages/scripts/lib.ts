import { NodeHttpTransport } from "@improbable-eng/grpc-web-node-http-transport";
import child_process from "child_process";
import fs from "fs/promises";
import util from "util";
import { z } from "zod";

import {
  GrpcWebImpl,
  MarketplaceServiceClientImpl,
} from "../api/marketplace/v1/marketplace";
import { getNetwork } from "../networks";

export const mustGetNodeMarketplaceClient = (networkId: string) => {
  const network = getNetwork(networkId);
  if (!network) {
    throw new Error("network not found");
  }
  const rpc = new GrpcWebImpl(network.backendEndpoint, {
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
  const data = await fs.readFile(filePath, { encoding: "utf-8" });
  const newData = data.replace(match, repl);
  await fs.writeFile(filePath, newData);
};

export const execPromise = util.promisify(child_process.exec);
