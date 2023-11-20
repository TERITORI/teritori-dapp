import { gnoCurrencies } from "./currencies";
import { GnoNetworkInfo, NetworkFeature, NetworkKind } from "../types";

export const gnoTeritoriNetwork: GnoNetworkInfo = {
  id: "gno-teritori",
  kind: NetworkKind.Gno,
  displayName: "Gno Teritori",
  icon: "icons/networks/gno.svg",
  features: [
    NetworkFeature.Organizations,
    NetworkFeature.SocialFeed,
    NetworkFeature.UPP,
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
  daoRegistryPkgPath: "gno.land/r/demo/teritori/dao_registry_v4",
  socialFeedsPkgPath: "gno.land/r/demo/teritori/social_feeds_v4",
  socialFeedsDAOPkgPath: "gno.land/r/demo/teritori/social_feeds_dao_v2",
  modboardsPkgPath: "gno.land/r/demo/teritori/modboards_v4",
  groupsPkgPath: "gno.land/r/demo/teritori/groups_v4",
  votingGroupPkgPath: "gno.land/p/demo/teritori/dao_voting_group_v2",
  daoProposalSinglePkgPath: "gno.land/p/demo/teritori/dao_proposal_single_v4",
  daoInterfacesPkgPath: "gno.land/p/demo/teritori/dao_interfaces_v5",
  daoCorePkgPath: "gno.land/p/demo/teritori/dao_core_v4",
  gnowebURL: "https://testnet.gno.teritori.com",
  faucetURL: "https://testnet.gno.teritori.com:5050/?toaddr=$addr",
};
