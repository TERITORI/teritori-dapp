import { grpc } from "@improbable-eng/grpc-web";

import {
  FeedService,
  FeedServiceClientImpl,
  GrpcWebImpl as FeedGrpcWebImpl,
} from "../api/feed/v1/feed";
import {
  MarketplaceServiceClientImpl,
  GrpcWebImpl as MarketplaceGrpcWebImpl,
  MarketplaceService,
} from "../api/marketplace/v1/marketplace";
import {
  P2eServiceClientImpl,
  GrpcWebImpl as P2eGrpcWebImpl,
  P2eService,
} from "../api/p2e/v1/p2e";
import { getNetwork } from "../networks";

const marketplaceClients: { [key: string]: MarketplaceService } = {};

export const getMarketplaceClient = (networkId: string | undefined) => {
  const network = getNetwork(networkId);
  if (!network) {
    return undefined;
  }
  if (!marketplaceClients[network.id]) {
    const rpc = new MarketplaceGrpcWebImpl(network.backendEndpoint, {
      transport: grpc.WebsocketTransport(),
      debug: false,
      // metadata: new grpc.Metadata({ SomeHeader: "bar" }),
    });
    marketplaceClients[network.id] = new MarketplaceServiceClientImpl(rpc);
  }
  return marketplaceClients[network.id];
};

export const mustGetMarketplaceClient = (networkId: string | undefined) => {
  const client = getMarketplaceClient(networkId);
  if (!client) {
    throw new Error(
      `failed to get marketplace client for network '${networkId}'`
    );
  }
  return client;
};

const p2eClients: { [key: string]: P2eService } = {};

export const getP2eClient = (networkId: string | undefined) => {
  const network = getNetwork(networkId);
  if (!network) {
    return undefined;
  }
  if (!p2eClients[network.id]) {
    const rpc = new P2eGrpcWebImpl(network.backendEndpoint, {
      transport: grpc.WebsocketTransport(),
      debug: false,
      // metadata: new grpc.Metadata({ SomeHeader: "bar" }),
    });
    p2eClients[network.id] = new P2eServiceClientImpl(rpc);
  }
  return p2eClients[network.id];
};

export const mustGetP2eClient = (networkId: string | undefined) => {
  const client = getP2eClient(networkId);
  if (!client) {
    throw new Error(`failed to get p2e client for network '${networkId}'`);
  }
  return client;
};

const feedClients: { [key: string]: FeedService } = {};

export const getFeedClient = (networkId: string | undefined) => {
  const network = getNetwork(networkId);
  if (!network) {
    return undefined;
  }
  if (!feedClients[network.id]) {
    const rpc = new FeedGrpcWebImpl(network.backendEndpoint, {
      transport: grpc.WebsocketTransport(),
      debug: false,
      // metadata: new grpc.Metadata({ SomeHeader: "bar" }),
    });
    feedClients[network.id] = new FeedServiceClientImpl(rpc);
  }
  return feedClients[network.id];
};

export const mustGetFeedClient = (networkId: string | undefined) => {
  const client = getFeedClient(networkId);
  if (!client) {
    throw new Error(`failed to get feed client for network '${networkId}'`);
  }
  return client;
};
