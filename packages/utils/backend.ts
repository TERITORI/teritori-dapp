import { grpc } from "@improbable-eng/grpc-web";

import {
  MarketplaceServiceClientImpl,
  GrpcWebImpl,
} from "../api/marketplace/v1/marketplace";

const backendEndpoint = process.env.TERITORI_BACKEND_ENDPOINT;

if (!backendEndpoint) {
  console.warn("missing TERITORI_BACKEND_ENDPOINT in env");
}

const rpc = new GrpcWebImpl(backendEndpoint, {
  transport: grpc.WebsocketTransport(),
  debug: false,
  // metadata: new grpc.Metadata({ SomeHeader: "bar" }),
});

export const backendClient = new MarketplaceServiceClientImpl(rpc);
