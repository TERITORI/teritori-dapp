import {
  DAOServiceClientImpl,
  GrpcWebImpl as DaoGrpcWebImpl,
  DAOService,
} from "../api/dao/v1/dao";
import {
  FeedService,
  FeedServiceClientImpl,
  GrpcWebImpl as FeedGrpcWebImpl,
} from "../api/feed/v1/feed";
import {
  LaunchpadService,
  LaunchpadServiceClientImpl,
  GrpcWebImpl as LaunchpadGrpcWebImpl,
} from "../api/launchpad/v1/launchpad";
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
import { getNetwork, getNetworkFeature, NetworkFeature } from "../networks";

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

const daoClients: { [key: string]: DAOService } = {};

export const getDAOClient = (networkId: string | undefined) => {
  const network = getNetwork(networkId);
  if (!network) {
    return undefined;
  }
  if (!daoClients[network.id]) {
    const rpc = new DaoGrpcWebImpl(network.backendEndpoint, {
      debug: false,
    });
    daoClients[network.id] = new DAOServiceClientImpl(rpc);
  }
  return daoClients[network.id];
};

export const mustGetDAOClient = (networkId: string | undefined) => {
  const client = getDAOClient(networkId);
  if (!client) {
    throw new Error(`failed to get dao client for network '${networkId}'`);
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

const launchpadClients: { [key: string]: LaunchpadService } = {};

export const getLaunchpadClient = (networkId: string | undefined) => {
  const network = getNetwork(networkId);
  const cosmwasmNftLaunchpadFeature = getNetworkFeature(
    networkId,
    NetworkFeature.CosmWasmNFTLaunchpad,
  );
  if (!network || !cosmwasmNftLaunchpadFeature) {
    return undefined;
  }
  if (!launchpadClients[network.id]) {
    const rpc = new LaunchpadGrpcWebImpl(
      cosmwasmNftLaunchpadFeature.launchpadEndpoint,
      {
        debug: false,
      },
    );
    launchpadClients[network.id] = new LaunchpadServiceClientImpl(rpc);
  }
  return launchpadClients[network.id];
};

export const mustGetLaunchpadClient = (networkId: string | undefined) => {
  const client = getLaunchpadClient(networkId);
  if (!client) {
    throw new Error(`failed to get feed client for network '${networkId}'`);
  }
  return client;
};
