import { gnoCurrencies } from "./currencies";
import { GnoNetworkInfo, NetworkFeature, NetworkKind } from "../types";

export const gnoTest5Network: GnoNetworkInfo = {
  id: "gno-test5",
  kind: NetworkKind.Gno,
  displayName: "Gno Test5",
  icon: "gno.svg",
  features: [
    NetworkFeature.SocialFeed,
    NetworkFeature.UPP,
    NetworkFeature.GnoProjectManager,
    NetworkFeature.NameService,
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
  idPrefix: "gnotest5",
  chainId: "test5",
  endpoint: "https://rpc.test5.gno.land",
  txExplorer:
    "https://gnoscan.io/transactions/details?txhash=$hash&chainId=test5",
  accountExplorer: "https://gnoscan.io/accounts/$address?chainId=test5",
  contractExplorer:
    "https://gnoscan.io/realms/details?path=$address&chainId=test5",
  testnet: true,
  backendEndpoint: "https://dapp-backend.testnet.teritori.com",
  gnowebURL: "https://gno.land",
  vaultContractAddress: "",
  nameServiceContractAddress: "gno.land/r/demo/users",
  nameServiceDefaultImage:
    "ipfs://bafkreignptjimiu7wuux6mk6uh4hb4odb6ff62ny4bvdokrhes7g67huse",
  socialFeedsPkgPath: "gno.land/r/teritori/social_feeds",
  socialFeedsDAOPkgPath: "gno.land/r/teritori/social_feeds_dao",
  daoInterfacesPkgPath: "gno.land/p/teritori/dao_interfaces",
  profilePkgPath: "gno.land/r/teritori/profile",
  txIndexerURL: "https://indexer.test5.gno.testnet.teritori.com",
};
