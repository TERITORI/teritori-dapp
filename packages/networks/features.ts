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
  NFTMarketplaceLeaderboard = "NFTMarketplaceLeaderboard",
  CosmWasmNFTsBurner = "CosmWasmNFTsBurner",
}

// CosmWasm Premium Feed

const zodCosmWasmPremiumFeed = z.object({
  type: z.literal(NetworkFeature.CosmWasmPremiumFeed),
  membershipContractAddress: z.string(),
  mintDenom: z.string(),
});

export type CosmWasmPremiumFeed = z.infer<typeof zodCosmWasmPremiumFeed>;

const zodCosmWasmLaunchpad = z.object({
  type: z.literal(NetworkFeature.NFTLaunchpad),
  launchpadContractAddress: z.string(),
  defaultMintDenom: z.string(),
  // allowedMintDenoms: z.array(z.string()), // for future
});
export type CosmWasmLaunchpad = z.infer<typeof zodCosmWasmLaunchpad>;

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

export const allFeatureObjects = [
  zodCosmWasmPremiumFeed,
  zodCosmWasmNFTsBurner,
];

export type NetworkFeatureObject =
  | CosmWasmPremiumFeed
  | CosmWasmSocialFeed
  | CosmWasmNFTsBurner;
