import { gnoCurrencies } from "./currencies";
import { GnoNetworkInfo, NetworkFeature, NetworkKind } from "../types";

export const gnoPortalNetwork: GnoNetworkInfo = {
  id: "gno-portal",
  kind: NetworkKind.Gno,
  displayName: "Gno Portal Loop",
  icon: "gno.svg",
  features: [
    NetworkFeature.Organizations,
    NetworkFeature.SocialFeed,
    NetworkFeature.UPP,
  ],
  currencies: gnoCurrencies,
  stakeCurrency: "ugnot",
  idPrefix: "gnoport",
  chainId: "portal-loop",
  endpoint: "https://rpc.gno.land:443",
  txExplorer: "https://gnoscan.io/transactions/details?txhash=$hash",
  accountExplorer: "https://gnoscan.io/accounts/$address",
  contractExplorer: "https://gnoscan.io/realms/details?path=$address",
  testnet: true,
  backendEndpoint: "https://dapp-backend.testnet.teritori.com",
  gnowebURL: "https://gno.land",
  vaultContractAddress: "",
  nameServiceContractAddress: "gno.land/r/demo/users",
  nameServiceDefaultImage:
    "ipfs://bafkreignptjimiu7wuux6mk6uh4hb4odb6ff62ny4bvdokrhes7g67huse",
  daoRegistryPkgPath: "gno.land/r/demo/teritori/dao_registry",
  socialFeedsPkgPath: "gno.land/r/demo/teritori/social_feeds",
  socialFeedsDAOPkgPath: "gno.land/r/demo/teritori/social_feeds_dao",
  // modboardsPkgPath: "gno.land/r/demo/teritori/modboards_v4",
  groupsPkgPath: "gno.land/r/demo/teritori/groups",
  votingGroupPkgPath: "gno.land/p/demo/teritori/dao_voting_group",
  daoProposalSinglePkgPath: "gno.land/p/demo/teritori/dao_proposal_single",
  daoInterfacesPkgPath: "gno.land/p/demo/teritori/dao_interfaces",
  daoCorePkgPath: "gno.land/p/demo/teritori/dao_core",
};
