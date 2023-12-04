import { TabDefinition } from "../components/tabs/Tabs";
import { NetworkFeature, NetworkKind, UserKind } from "../networks";

export enum UppTabKeys {
  posts = "posts",
  nfts = "nfts",
  quests = "quests",
  mentionsPosts = "mentionsPosts",
  music = "music",
  videos = "videos",
  daos = "daos",
  proposals = "proposals",
  members = "members",
  funds = "funds",
  gnoDemo = "gnoDemo",
}

export const DEFAULT_UPP_TAB_KEY: keyof typeof uppTabItems = UppTabKeys.posts;

export const uppTabItems: { [key: string]: TabDefinition } = {
  [UppTabKeys.posts]: {
    name: "Posts",
    networkKinds: [NetworkKind.Cosmos, NetworkKind.Gno],
    networkFeatures: [NetworkFeature.UPP, NetworkFeature.SocialFeed],
    userKinds: [UserKind.Single, UserKind.Organization],
  },
  [UppTabKeys.nfts]: {
    name: "NFTs",
    networkKinds: [NetworkKind.Cosmos],
    networkFeatures: [NetworkFeature.UPP, NetworkFeature.NFTMarketplace],
    userKinds: [UserKind.Single, UserKind.Organization],
  },
  // activity: {
  //   name: "Activity",
  //   disabled: true,
  // },
  [UppTabKeys.quests]: {
    name: "Quests",
    networkKinds: [NetworkKind.Cosmos],
    networkFeatures: [NetworkFeature.UPP],
    userKinds: [UserKind.Single, UserKind.Organization],
  },
  [UppTabKeys.mentionsPosts]: {
    name: "Mentions Posts",
    networkKinds: [NetworkKind.Cosmos],
    networkFeatures: [NetworkFeature.UPP, NetworkFeature.SocialFeed],
    userKinds: [UserKind.Single, UserKind.Organization],
  },
  [UppTabKeys.music]: {
    name: "Music",
    networkKinds: [NetworkKind.Cosmos, NetworkKind.Gno],
    networkFeatures: [NetworkFeature.UPP, NetworkFeature.SocialFeed],
    userKinds: [UserKind.Single, UserKind.Organization],
  },
  [UppTabKeys.videos]: {
    name: "Videos",
    networkKinds: [NetworkKind.Cosmos, NetworkKind.Gno],
    networkFeatures: [NetworkFeature.UPP, NetworkFeature.SocialFeed],
    userKinds: [UserKind.Single, UserKind.Organization],
  },
  [UppTabKeys.daos]: {
    name: "Organizations",
    networkKinds: [NetworkKind.Cosmos],
    networkFeatures: [NetworkFeature.UPP, NetworkFeature.Organizations],
    userKinds: [UserKind.Single],
  },
  [UppTabKeys.proposals]: {
    name: "Proposals",
    networkKinds: [NetworkKind.Cosmos, NetworkKind.Gno],
    networkFeatures: [NetworkFeature.UPP, NetworkFeature.Organizations],
    userKinds: [UserKind.Organization],
  },
  [UppTabKeys.members]: {
    name: "Members",
    networkKinds: [NetworkKind.Cosmos, NetworkKind.Gno],
    networkFeatures: [NetworkFeature.UPP, NetworkFeature.Organizations],
    userKinds: [UserKind.Organization],
  },
  [UppTabKeys.funds]: {
    name: "Funds",
    networkKinds: [NetworkKind.Cosmos],
    networkFeatures: [NetworkFeature.UPP, NetworkFeature.Organizations],
    userKinds: [UserKind.Organization],
  },
  [UppTabKeys.gnoDemo]: {
    name: "POCs",
    networkKinds: [NetworkKind.Gno],
    networkFeatures: [NetworkFeature.UPP],
    userKinds: [UserKind.Organization],
  },
  // pathwar: {
  //   name: "Pathwar Challenges",
  //   disabled: true,
  // },
  // gig: {
  //   name: "Gig Services",
  //   disabled: true,
  // },
  // votes: {
  //   name: "Governance Votes",
  //   disabled: true,
  // },
  // footer: {
  //   name: "Putted NFT to Rioters Footer",
  //   disabled: true,
  // },
  // servers: {
  //   name: "Shared servers",
  //   disabled: true,
  // },
};
