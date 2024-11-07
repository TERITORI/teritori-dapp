import { z } from "zod";

export enum NetworkFeature {
  NFTMarketplace = "NFTMarketplace",
  CosmWasmNFTLaunchpad = "CosmWasmNFTLaunchpad",
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
}

// Marketplace

const zodNFTMarketplace = z.object({
  type: z.literal(NetworkFeature.NFTMarketplace),
  cwAddressListContractAddress: z.string(),
  cwAddressListCodeId: z.number(),
});

export type NFTMarketplace = z.infer<typeof zodNFTMarketplace>;

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

// CosmWasm Launchpad

const zodCosmWasmNFTLaunchpad = z.object({
  type: z.literal(NetworkFeature.CosmWasmNFTLaunchpad),
  launchpadContractAddress: z.string(),
  defaultMintDenom: z.string(),
  launchpadEndpoint: z.string(),
  codeId: z.number(),
  nftTr721CodeId: z.number(),
});

export type CosmWasmNFTLaunchpad = z.infer<typeof zodCosmWasmNFTLaunchpad>;

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
  zodCosmWasmNFTLaunchpad,
  zodGnoProjectManager,
  zodLaunchpadERC20,
  zodNFTMarketplace,
];

export type NetworkFeatureObject =
  | CosmWasmPremiumFeed
  | CosmWasmSocialFeed
  | CosmWasmNFTLaunchpad
  | CosmWasmNFTsBurner
  | GnoProjectManager
  | LaunchpadERC20
  | NFTMarketplace;
