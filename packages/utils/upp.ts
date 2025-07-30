import { NetworkFeature, NetworkKind, UserKind } from "@/networks";
import { TabDefinition } from "@/utils/types/tabs";

export enum UppTabKeys {
  posts = "",
  premiumSubscribe = "premium-content",
  nfts = "nfts",
  quests = "quests",
  mentionsPosts = "mentions-posts",
  music = "music",
  videos = "videos",
  daos = "daos",
  proposals = "proposals",
  members = "members",
  funds = "funds",
  gnoDemo = "gno-demo",
}

export const uppTabItems: { [key: string]: TabDefinition } = {
  [UppTabKeys.posts]: {
    name: "Posts",
    networkFeatures: [NetworkFeature.SocialFeed],
  },
  [UppTabKeys.premiumSubscribe]: {
    name: "Premium Content",
    networkFeatures: [NetworkFeature.SocialFeed],
  },
  [UppTabKeys.nfts]: {
    name: "NFTs",
    networkFeatures: [NetworkFeature.SocialFeed],
  },
  [UppTabKeys.quests]: {
    name: "Quests",
    networkFeatures: [NetworkFeature.SocialFeed],
  },
  [UppTabKeys.mentionsPosts]: {
    name: "Mentions Posts",
    networkFeatures: [NetworkFeature.SocialFeed],
  },
  [UppTabKeys.music]: {
    name: "Music",
    networkFeatures: [NetworkFeature.SocialFeed],
  },
  [UppTabKeys.videos]: {
    name: "Videos",
    networkFeatures: [NetworkFeature.SocialFeed],
  },
  [UppTabKeys.daos]: {
    name: "Organizations",
    userKinds: [UserKind.Single],
    networkFeatures: [NetworkFeature.Organizations],
  },
  [UppTabKeys.proposals]: {
    name: "Proposals",
    userKinds: [UserKind.Organization],
    networkFeatures: [NetworkFeature.Organizations],
  },
  [UppTabKeys.members]: {
    name: "Members",
    userKinds: [UserKind.Organization],
    networkFeatures: [NetworkFeature.Organizations],
  },
  [UppTabKeys.funds]: {
    name: "Funds",
    userKinds: [UserKind.Organization],
  },
  [UppTabKeys.gnoDemo]: {
    name: "POCs",
    networkKinds: [NetworkKind.Gno],
    userKinds: [UserKind.Organization],
  },
};

export type ProfileData = {
  displayName?: string | null;
  avatarURL?: string | null;
  bannerURL?: string | null;
  bio?: string | null;
};

export const EMPTY_PROFILE: ProfileData = {
  displayName: "",
  avatarURL: "",
  bannerURL: "",
  bio: "",
};
