import { grpc } from "@improbable-eng/grpc-web";

import {
  MarketplaceServiceClientImpl,
  GrpcWebImpl,
} from "../api/marketplace/v1/marketplace";

const rpc = new GrpcWebImpl("http://localhost:9090", {
  transport: grpc.WebsocketTransport(),
  debug: false,
  // metadata: new grpc.Metadata({ SomeHeader: "bar" }),
});

export const backendClient = new MarketplaceServiceClientImpl(rpc);
