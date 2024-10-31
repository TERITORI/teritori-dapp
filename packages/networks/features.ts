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
  LaunchpadERC20 = "LaunchpadERC20",
  NFTMarketplaceLeaderboard = "NFTMarketplaceLeaderboard",
  CosmWasmNFTsBurner = "CosmWasmNFTsBurner",
  CosmWasmAddressList = "CosmWasmAddressList",
}

// CosmWasm Address List

const zodCCosmWasmAddressList = z.object({
  type: z.literal(NetworkFeature.CosmWasmAddressList),
  cwAddressListContractAddress: z.string(),
  codeId: z.number(),
});

export type CosmWasmAddressList = z.infer<typeof zodCCosmWasmAddressList>;

// CosmWasm Premium Feed

const zodCosmWasmPremiumFeed = z.object({
  type: z.literal(NetworkFeature.CosmWasmPremiumFeed),
  membershipContractAddress: z.string(),
  mintDenom: z.string(),
});

export type CosmWasmPremiumFeed = z.infer<typeof zodCosmWasmPremiumFeed>;

// CosmWasm NFTs Burner

const zodCosmWasmNFTsBurner = z.object({
  type: z.literal(NetworkFeature.CosmWasmNFTsBurner),
  burnerContractAddress: z.string(),
});

export type CosmWasmNFTsBurner = z.infer<typeof zodCosmWasmNFTsBurner>;

// CosmWasm Social Feed

type CosmWasmSocialFeed = {
  type: NetworkFeature.SocialFeed;
  feedContractAddress: string;
};

// Gno Project Manager

const zodGnoProjectManager = z.object({
  type: z.literal(NetworkFeature.GnoProjectManager),
  projectsManagerPkgPath: z.string(),
  paymentsDenom: z.string(),
});

type GnoProjectManager = z.infer<typeof zodGnoProjectManager>;

// Launchpad ERC20

const zodLaunchpadERC20 = z.object({
  type: z.literal(NetworkFeature.LaunchpadERC20),
  launchpadERC20PkgPath: z.string(),
  paymentsDenom: z.string(),
});

type LaunchpadERC20 = z.infer<typeof zodLaunchpadERC20>;

// Registry

export const allFeatureObjects = [
  zodCosmWasmPremiumFeed,
  zodCosmWasmNFTsBurner,
  zodGnoProjectManager,
  zodLaunchpadERC20,
  zodCCosmWasmAddressList,
];

export type NetworkFeatureObject =
  | CosmWasmPremiumFeed
  | CosmWasmSocialFeed
  | CosmWasmNFTsBurner
  | GnoProjectManager
  | LaunchpadERC20
  | CosmWasmAddressList;
