import { NodeHttpTransport } from "@improbable-eng/grpc-web-node-http-transport";
import fs from "fs";

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

export const readJSONSync = (filePath: string) => {
  const data = fs.readFileSync(filePath, "utf-8");
  return JSON.parse(data);
};

export const writeJSONSync = (filePath: string, data: any) => {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
};
