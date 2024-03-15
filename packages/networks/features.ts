import { z } from "zod";

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
  NFTMarketplaceLeaderboard = "NFTMarketplaceLeaderboard",
}

const zodCosmWasmPremiumFeed = z.object({
  type: z.literal(NetworkFeature.CosmWasmPremiumFeed),
  membershipContractAddress: z.string(),
  mintDenom: z.string(),
});

export type CosmWasmPremiumFeed = z.infer<typeof zodCosmWasmPremiumFeed>;

type CosmWasmSocialFeed = {
  type: NetworkFeature.SocialFeed;
  feedContractAddress: string;
};

const zodGnoProjectManager = z.object({
  type: z.literal(NetworkFeature.GnoProjectManager),
  projectsManagerPkgPath: z.string(),
  paymentsDenom: z.string(),
});

type GnoProjectManager = z.infer<typeof zodGnoProjectManager>;

export const allFeatureObjects = [zodCosmWasmPremiumFeed, zodGnoProjectManager];

export type NetworkFeatureObject =
  | CosmWasmPremiumFeed
  | CosmWasmSocialFeed
  | GnoProjectManager;
