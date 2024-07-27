import { gnoCurrencies } from "./currencies";
import { GnoNetworkInfo, NetworkFeature, NetworkKind } from "../types";

export const gnoTest4Network: GnoNetworkInfo = {
  id: "gno-test4",
  kind: NetworkKind.Gno,
  displayName: "Gno Test4",
  icon: "gno.svg",
  features: [NetworkFeature.SocialFeed, NetworkFeature.UPP],
  currencies: gnoCurrencies,
  stakeCurrency: "ugnot",
  idPrefix: "gnotest4",
  chainId: "test4",
  endpoint: "https://rpc.test4.gno.land:443",
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
  socialFeedsPkgPath: "gno.land/r/teritori/social_feeds",
  socialFeedsDAOPkgPath: "gno.land/r/teritori/social_feeds_dao",
  daoInterfacesPkgPath: "gno.land/p/teritori/dao_interfaces",
};
