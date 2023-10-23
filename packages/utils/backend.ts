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
  MarketplaceServiceClientImpl,
  GrpcWebImpl as MarketplaceGrpcWebImpl,
  MarketplaceService,
} from "../api/marketplace/v1/marketplace";
import {
  NotificationServiceClientImpl,
  GrpcWebImpl as NotificationGrpcWebImpl,
  NotificationService,
} from "../api/notification/v1/notification";
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

const notificationClients: { [key: string]: NotificationService } = {};

export const getNotificationClient = (networkId: string | undefined) => {
  const network = getNetwork(networkId);
  if (!network) {
    return undefined;
  }
  if (!notificationClients[network.id]) {
    const rpc = new NotificationGrpcWebImpl(network.backendEndpoint, {
      debug: false,
    });
    notificationClients[network.id] = new NotificationServiceClientImpl(rpc);
  }
  return notificationClients[network.id];
};

export const mustGetNotificationClient = (
  networkId:
    | (NetworkInfoBase & {
        kind: NetworkKind.Cosmos;
        chainId: string;
        addressPrefix: string;
        restEndpoint: string;
        rpcEndpoint: string;
        stakeCurrency: string;
        gasPriceStep: { low: number; average: number; high: number };
        cosmosFeatures: string[];
        walletUrlForStaking?: string;
        nameServiceContractAddress?: string;
        nameServiceDefaultImage?: string;
        nameServiceTLD?: string;
        vaultContractAddress?: string;
        distributorContractAddress?: string;
        riotContractAddressGen0?: string;
        riotContractAddressGen1?: string;
        riotSquadStakingContractAddressV1?: string;
        riotSquadStakingContractAddressV2?: string;
        riotersFooterContractAddress?: string;
        socialFeedContractAddress?: string;
        daoCw20CodeId?: number;
        daoFactoryCodeId?: number;
        daoCoreCodeId?: number;
        daoPreProposeSingleCodeId?: number;
        daoProposalSingleCodeId?: number;
        daoVotingCw20StakedCodeId?: number;
        daoCw20StakeCodeId?: number;
        daoCw4GroupCodeId?: number;
        daoVotingCw4CodeId?: number;
        daoFactoryContractAddress?: string;
        coreDAOAddress?: string;
      })
    | (NetworkInfoBase & {
        kind: NetworkKind.Ethereum;
        endpoint: string;
        chainId: number;
        alchemyApiKey: string;
        theGraphEndpoint: string;
        vaultContractAddress: string;
        riotContractAddress: string;
      })
    | (NetworkInfoBase & {
        kind: NetworkKind.Gno;
        chainId: string;
        endpoint: string;
        stakeCurrency: string;
        vaultContractAddress: string;
        nameServiceContractAddress: string;
        nameServiceDefaultImage: string;
        gnowebURL: string;
        daoRegistryPkgPath?: string;
        modboardsPkgPath?: string;
        socialFeedsPkgPath?: string;
        socialFeedsDAOPkgPath?: string;
        votingGroupPkgPath?: string;
        daoProposalSinglePkgPath?: string;
        daoInterfacesPkgPath?: string;
        daoCorePkgPath?: string;
        groupsPkgPath?: string;
        faucetURL?: string;
      })
) => {
  const client = getNotificationClient(networkId);
  if (!client) {
    throw new Error(
      `failed to get notification client for network '${networkId}'`
    );
  }
  return client;
};
