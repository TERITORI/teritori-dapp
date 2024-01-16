import { NodeHttpTransport } from "@improbable-eng/grpc-web-node-http-transport";
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
