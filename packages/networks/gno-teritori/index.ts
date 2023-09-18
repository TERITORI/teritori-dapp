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
  txExplorer: "https://etherscan.io/tx/$hash",
  accountExplorer: "https://etherscan.io/address/$address",
  contractExplorer: "https://etherscan.io/address/$address",
  testnet: true,
  backendEndpoint: "https://dapp-backend.testnet.teritori.com",
  vaultContractAddress: "",
  nameServiceContractAddress: "gno.land/r/demo/users",
  nameServiceDefaultImage:
    "ipfs://bafkreignptjimiu7wuux6mk6uh4hb4odb6ff62ny4bvdokrhes7g67huse",
  daoRegistryPkgPath: "gno.land/r/demo/dao_registry_v8",
  modboardsPkgPath: "gno.land/r/demo/modboards_v9",
  groupsPkgPath: "gno.land/r/demo/groups_v22",
  socialFeedsPkgPath: "gno.land/r/demo/social_feeds_v9",
  socialFeedsDAOPkgPath: "gno.land/r/demo/social_feeds_dao_v3",
  gnowebURL: "https://testnet.gno.teritori.com",
};
