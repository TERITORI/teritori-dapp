import { GnoNetworkInfo, NetworkFeature, NetworkKind } from "../types";
import { gnoCurrencies } from "./currencies";

export const gnoTeritoriNetwork: GnoNetworkInfo = {
  id: "gno-teritori",
  kind: NetworkKind.Gno,
  displayName: "Gno Teritori",
  icon: "gno.svg",
  features: [
    NetworkFeature.Organizations,
    NetworkFeature.SocialFeed,
    NetworkFeature.UPP,
    NetworkFeature.GnoProjectManager,
    NetworkFeature.NameService,
  ],
  featureObjects: [
    {
      type: NetworkFeature.GnoProjectManager,
      projectsManagerPkgPath: "gno.land/r/teritori/escrow",
      paymentsDenom: "ugnot",
    },
  ],
  currencies: gnoCurrencies,
  stakeCurrency: "ugnot",
  idPrefix: "gnotori",
  chainId: "teritori-1",
  endpoint: "https://testnet.gno.teritori.com:26658",
  txExplorer: "https://gnoscan.io/transactions/details?txhash=$hash",
  accountExplorer: "https://gnoscan.io/accounts/$address",
  contractExplorer: "https://gnoscan.io/realms/details?path=$address",
  testnet: true,
  backendEndpoint: "https://dapp-backend.testnet.teritori.com",
  vaultContractAddress: "",
  nameServiceContractAddress: "gno.land/r/demo/users",
  nameServiceDefaultImage:
    "ipfs://bafkreignptjimiu7wuux6mk6uh4hb4odb6ff62ny4bvdokrhes7g67huse",
  daoRegistryPkgPath: "gno.land/r/teritori/dao_registry_v4",
  socialFeedsPkgPath: "gno.land/r/teritori/social_feeds_v4",
  socialFeedsDAOPkgPath: "gno.land/r/teritori/social_feeds_dao_v2",
  modboardsPkgPath: "gno.land/r/teritori/modboards_v4",
  groupsPkgPath: "gno.land/r/teritori/groups_v4",
  votingGroupPkgPath: "gno.land/p/teritori/dao_voting_group_v2",
  rolesGroupPkgPath: "gno.land/p/teritori/dao_roles_group",
  daoProposalSinglePkgPath: "gno.land/p/teritori/dao_proposal_single_v4",
  daoInterfacesPkgPath: "gno.land/p/teritori/dao_interfaces_v5",
  daoUtilsPkgPath: "", //TODO: fill with the correct path
  daoCorePkgPath: "gno.land/p/teritori/dao_core_v4",
  toriPkgPath: "", //TODO: fill with the correct path
  gnowebURL: "https://testnet.gno.teritori.com",
  faucetURL: "https://testnet.gno.teritori.com:5050/?toaddr=$addr",
};
