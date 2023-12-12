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
  },
  [UppTabKeys.nfts]: {
    name: "NFTs",
    networkFeatures: [NetworkFeature.NFTMarketplace],
  },
  // activity: {
  //   name: "Activity",
  //   disabled: true,
  // },
  [UppTabKeys.quests]: {
    name: "Quests",
    networkKinds: [NetworkKind.Cosmos],
  },
  [UppTabKeys.mentionsPosts]: {
    name: "Mentions Posts",
    networkKinds: [NetworkKind.Cosmos],

  },
  [UppTabKeys.music]: {
    name: "Music",
  },
  [UppTabKeys.videos]: {
    name: "Videos",
  },
  [UppTabKeys.daos]: {
    name: "Organizations",
    networkKinds: [NetworkKind.Cosmos],
    userKinds: [UserKind.Single],
  },
  [UppTabKeys.proposals]: {
    name: "Proposals",
    userKinds: [UserKind.Organization],
  },
  [UppTabKeys.members]: {
    name: "Members",
    userKinds: [UserKind.Organization],
  },
  [UppTabKeys.funds]: {
    name: "Funds",
    networkKinds: [NetworkKind.Cosmos],
    userKinds: [UserKind.Organization],
  },
  [UppTabKeys.gnoDemo]: {
    name: "POCs",
    networkKinds: [NetworkKind.Gno],
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
