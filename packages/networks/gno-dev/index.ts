import { gnoCurrencies } from "./currencies";
import { GnoNetworkInfo, NetworkFeature, NetworkKind } from "../types";

export const gnoDevNetwork: GnoNetworkInfo = {
  id: "gno-dev",
  kind: NetworkKind.Gno,
  displayName: "Gno Dev",
  icon: "gno.svg",
  features: [
    NetworkFeature.Organizations,
    NetworkFeature.SocialFeed,
    NetworkFeature.UPP,
    NetworkFeature.GnoProjectManager,
  ],
  featureObjects: [
    {
      type: NetworkFeature.GnoProjectManager,
      projectsManagerPkgPath: "gno.land/r/teritori/projects_manager",
      paymentsDenom: "ugnot",
    },
  ],
  currencies: gnoCurrencies,
  stakeCurrency: "ugnot",
  idPrefix: "gnodev",
  chainId: "dev",
  endpoint: "http://127.0.0.1:26657",
  txExplorer: "https://gnoscan.io/transactions/details?txhash=$hash",
  accountExplorer: "https://gnoscan.io/accounts/$address",
  contractExplorer: "https://gnoscan.io/realms/details?path=$address",
  testnet: true,
  // backendEndpoint: "http://localhost:9090",
  backendEndpoint: "https://dapp-backend.testnet.teritori.com",
  vaultContractAddress: "",
  daoRegistryPkgPath: "gno.land/r/teritori/dao_registry",
  socialFeedsPkgPath: "gno.land/r/teritori/social_feeds",
  socialFeedsDAOPkgPath: "gno.land/r/teritori/social_feeds_dao",
  nameServiceContractAddress: "gno.land/r/demo/users",
  modboardsPkgPath: "gno.land/r/teritori/modboards",
  groupsPkgPath: "gno.land/r/teritori/groups",
  votingGroupPkgPath: "gno.land/p/teritori/dao_voting_group",
  daoProposalSinglePkgPath: "gno.land/p/teritori/dao_proposal_single",
  profilePkgPath: "gno.land/r/demo/profile",

  daoInterfacesPkgPath: "gno.land/p/teritori/dao_interfaces",
  daoCorePkgPath: "gno.land/p/teritori/dao_core",
  nameServiceDefaultImage:
    "ipfs://bafkreignptjimiu7wuux6mk6uh4hb4odb6ff62ny4bvdokrhes7g67huse",
  gnowebURL: "http://127.0.0.1:8888",
  txIndexerURL: "http://127.0.0.1:8546",
};
