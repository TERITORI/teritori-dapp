import { gnoCurrencies } from "./currencies";
import { GnoNetworkInfo, NetworkFeature, NetworkKind } from "../types";

import { derivePkgAddr } from "@/utils/gno";

const hyperacktiveEventId = "15";
const pkgPath = `gno.land/r/zenao/events/e${hyperacktiveEventId}`;
const globalFeedId = `${derivePkgAddr(pkgPath)}:main`;

export const gnoZenaoNetwork: GnoNetworkInfo = {
  id: "gno-zenao",
  kind: NetworkKind.Gno,
  displayName: "Gno Zenao",
  icon: "zenao.svg",
  features: [
    NetworkFeature.Organizations,
    NetworkFeature.UPP,
    NetworkFeature.NameService,
    NetworkFeature.SocialFeedReadonly,
  ],
  currencies: gnoCurrencies,
  stakeCurrency: "ugnot",
  idPrefix: "zenao",
  chainId: "zenao-dev",
  endpoint: "https://gnorpc.prod.zenao.io/",
  testnet: true,
  backendEndpoint: "https://dapp-backend.testnet.teritori.com",
  gnowebURL: "https://gnoweb.prod.zenao.io/",
  vaultContractAddress: "",
  nameServiceContractAddress: "gno.land/r/demo/users",
  nameServiceDefaultImage:
    "ipfs://bafkreigqm3i4urywxohvpkbz5sgxosiogwn433ufmzz7eqldjxoi6xmwma",
  globalFeedId,
  socialFeedsPkgPath: "gno.land/r/zenao/social_feed",
  socialFeedsDAOPkgPath: "gno.land/r/teritori/social_feeds_dao",
  daoInterfacesPkgPath: "gno.land/p/teritori/dao_interfaces",
  profilePkgPath: "gno.land/r/demo/profile",
  txIndexerURL: "https://indexer.zenao.gno.testnet.teritori.com",
  cockpitNamespace: "zenao",

  txExplorer: "",
  accountExplorer: "",
  contractExplorer: "",
};

const customGnoscanParams = (network: GnoNetworkInfo) => {
  return `type=custom&chainId=${network.chainId}&rpcUrl=${network.endpoint}&indexerUrl=${network.txIndexerURL}`;
};

gnoZenaoNetwork.txExplorer = `https://gnoscan.io/transactions/details?txhash=$hash&${customGnoscanParams(gnoZenaoNetwork)}`;
gnoZenaoNetwork.accountExplorer = `https://gnoscan.io/accounts/$address?${customGnoscanParams(gnoZenaoNetwork)}`;
gnoZenaoNetwork.contractExplorer = `https://gnoscan.io/realms/details?path=$address&${customGnoscanParams(gnoZenaoNetwork)}`;
