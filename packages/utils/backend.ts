import { grpc } from "@improbable-eng/grpc-web";

import {
  DaoServiceClientImpl,
  GrpcWebImpl as DaoGrpcWebImpl,  
} from "../api/dao/v1/dao";
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

const daoBackendEndpoint = process.env.TERITORI_DAO_BACKEND_ENDPOINT;

if (!daoBackendEndpoint) {
  throw new Error("missing TERITORI_DAO_BACKEND_ENDPOINT in env");
}

const daoRpc = new DaoGrpcWebImpl(daoBackendEndpoint, {
  transport: grpc.WebsocketTransport(),
  debug: false,
  // metadata: new grpc.Metadata({ SomeHeader: "bar" }),
});

export const daoClient = new DaoServiceClientImpl(daoRpc);
