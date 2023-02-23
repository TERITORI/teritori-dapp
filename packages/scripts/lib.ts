import { NodeHttpTransport } from "@improbable-eng/grpc-web-node-http-transport";

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
