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
  MusicplayerService,
  MusicplayerServiceClientImpl,
  GrpcWebImpl as MusicplayerGrpcWebImpl,
} from "../api/musicplayer/v1/musicplayer";
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

const musicplayerClients: { [key: string]: MusicplayerService } = {};
export const getMusicplayerClient = (networkId: string | undefined) => {
  const network = getNetwork(networkId);
  if (!network) {
    return undefined;
  }
  if (!musicplayerClients[network.id]) {
    // const backendEndpoint = network.backendEndpoint;
    const backendEndpoint = process.env.TERITORI_MUSICPLAYER_BACKEND_ENDPOINT!;
    const rpc = new MusicplayerGrpcWebImpl(backendEndpoint, {
      debug: false,
    });
    musicplayerClients[network.id] = new MusicplayerServiceClientImpl(rpc);
  }
  return musicplayerClients[network.id];
};

export const mustGetMusicplayerClient = (networkId: string | undefined) => {
  const client = getMusicplayerClient(networkId);
  if (!client) {
    throw new Error(
      `failed to get musicplayer client for network '${networkId}'`
    );
  }
  return client;
};
// const musicplayerBackendEndpoint =
//   process.env.TERITORI_MUSICPLAYER_BACKEND_ENDPOINT;

// if (!musicplayerBackendEndpoint) {
//   throw new Error("missing TERITORI_MUSICPLAYER_BACKEND_ENDPOINT in env");
// }

// const musicplayerRpc = new MusicplayerGrpcWebImpl(musicplayerBackendEndpoint, {
//   transport: grpc.WebsocketTransport(),
//   debug: false,
//   // metadata: new grpc.Metadata({ SomeHeader: "bar" }),
// });

// export const musicplayerClient = new MusicplayerServiceClientImpl(
//   musicplayerRpc
// );
