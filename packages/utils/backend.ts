import {
  FeedService,
  FeedServiceClientImpl,
  GrpcWebImpl as FeedGrpcWebImpl,
} from "../api/feed/v1/feed";
import {
  FreelanceServiceClientImpl,
  GrpcWebImpl as FreelanceGrpcWebImpl,
  FreelanceService,
} from "../api/freelance/v1/freelance";
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
      debug: false,
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

const backendEndpoint = process.env.TERITORI_BACKEND_ENDPOINT;

if (!backendEndpoint) {
  throw new Error("missing TERITORI_BACKEND_ENDPOINT in env");
}

const p2eClients: { [key: string]: P2eService } = {};

export const getP2eClient = (networkId: string | undefined) => {
  const network = getNetwork(networkId);
  if (!network) {
    return undefined;
  }
  if (!p2eClients[network.id]) {
    const rpc = new P2eGrpcWebImpl(network.backendEndpoint, {
      debug: false,
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
      debug: false,
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

const freelanceClients: { [key: string]: FreelanceService } = {};

export const getFreelanceClient = (networkId: string | undefined) => {
  const network = getNetwork(networkId);
  if (!network) {
    return undefined;
  }
  if (!freelanceClients[network.id]) {
    const rpc = new FreelanceGrpcWebImpl(network.backendEndpoint, {
      debug: false,
    });
    freelanceClients[network.id] = new FreelanceServiceClientImpl(rpc);
  }
  return freelanceClients[network.id];
};
export const mustGetFreelanceClient = (networkId: string | undefined) => {
  const client = getFreelanceClient(networkId);
  if (!client) {
    throw new Error(
      `failed to get freelance client for network '${networkId}'`
    );
  }
  return client;
};
