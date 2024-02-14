export enum NetworkFeature {
  NFTMarketplace = "NFTMarketplace",
  NFTLaunchpad = "NFTLaunchpad",
  NameService = "NameService",
  Swap = "Swap",
  BurnTokens = "BurnTokens",
  Organizations = "Organizations",
  P2E = "P2E",
  SocialFeed = "SocialFeed",
  UPP = "UPP",
  RiotP2E = "RiotP2E",
  NFTBridge = "NFTBridge",
  CosmWasmPremiumFeed = "CosmWasmPremiumFeed",
  GnoProjectManager = "GnoProjectManager",
}

type CosmWasmPremiumFeed = {
  type: NetworkFeature.CosmWasmPremiumFeed;
  membershipContractAddress: string;
  mintDenom: string;
};

type CosmWasmSocialFeed = {
  type: NetworkFeature.SocialFeed;
  feedContractAddress: string;
};

type GnoProjectManager = {
  type: NetworkFeature.GnoProjectManager;
  projectsManagerPkgPath: string;
  paymentsDenom: string;
};

export type NetworkFeatureObject =
  | CosmWasmPremiumFeed
  | CosmWasmSocialFeed
  | GnoProjectManager;
