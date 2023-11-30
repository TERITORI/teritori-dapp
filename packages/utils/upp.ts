import { TabDefinition } from "../components/tabs/Tabs";

export const DEFAULT_UPP_TAB: keyof typeof uppTabItems = "feedPosts";

export const uppTabItems: { [key: string]: TabDefinition } = {
  feedPosts: {
    name: "Posts",
  },
  nfts: {
    name: "NFTs",
  },
  // activity: {
  //   name: "Activity",
  //   disabled: true,
  // },
  quests: {
    name: "Quests",
  },
  feedMentionsPosts: {
    name: "Mentions Posts",
  },
  feedMusic: {
    name: "Music",
  },
  feedVideos: {
    name: "Videos",
  },
  daos: {
    name: "Organizations",
  },
  daosProposals: {
    name: "Proposals",
  },
  daosMembers: {
    name: "Members",
  },
  funds: {
    name: "Funds",
  },
  gnoDemo: {
    name: "POCs",
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
