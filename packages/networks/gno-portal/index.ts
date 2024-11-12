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
    NetworkFeature.NameService,
  ],
  currencies: gnoCurrencies,
  stakeCurrency: "ugnot",
  idPrefix: "gnoport",
  chainId: "portal-loop",
  endpoint: "https://rpc.gno.land:443",
  txExplorer:
    "https://gnoscan.io/transactions/details?txhash=$hash&chainId=portal-loop",
  accountExplorer: "https://gnoscan.io/accounts/$address?chainId=portal-loop",
  contractExplorer:
    "https://gnoscan.io/realms/details?path=$address&chainId=portal-loop",
  testnet: true,
  backendEndpoint: "https://dapp-backend.testnet.teritori.com",
  gnowebURL: "https://gno.land",
  vaultContractAddress: "",
  nameServiceContractAddress: "gno.land/r/demo/users",
  nameServiceDefaultImage:
    "ipfs://bafkreignptjimiu7wuux6mk6uh4hb4odb6ff62ny4bvdokrhes7g67huse",
  daoRegistryPkgPath: "gno.land/r/teritori/dao_registry",
  socialFeedsPkgPath: "gno.land/r/teritori/social_feeds",
  socialFeedsDAOPkgPath: "gno.land/r/teritori/social_feeds_dao",
  // modboardsPkgPath: "gno.land/r/teritori/modboards_v4",
  groupsPkgPath: "gno.land/r/teritori/groups",
  votingGroupPkgPath: "gno.land/p/teritori/dao_voting_group",
  rolesGroupPkgPath: "gno.land/p/teritori/dao_roles_group",
  daoProposalSinglePkgPath: "gno.land/p/teritori/dao_proposal_single",
  daoInterfacesPkgPath: "gno.land/p/teritori/dao_interfaces",
  daoCorePkgPath: "gno.land/p/teritori/dao_core",
  daoUtilsPkgPath: "gno.land/r/teritori/dao_utils",
  toriPkgPath: "gno.land/r/teritori/tori",
  profilePkgPath: "gno.land/r/demo/profile",
  txIndexerURL: "https://indexer.portal-loop.gno.testnet.teritori.com",
};
