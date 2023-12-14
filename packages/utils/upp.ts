import { TabDefinition } from "../components/tabs/Tabs";
import { NetworkFeature, NetworkKind, UserKind } from "../networks";

export enum UppTabKeys {
  posts = "",
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
  [UppTabKeys.nfts]: {
    name: "NFTs",
    networkFeatures: [NetworkFeature.NFTMarketplace],
  },
  [UppTabKeys.quests]: {
    name: "Quests",
    networkKinds: [NetworkKind.Cosmos],
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
