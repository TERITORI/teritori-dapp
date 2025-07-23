import { gnoCurrencies } from "./currencies";
import { GnoNetworkInfo, NetworkFeature, NetworkKind } from "../types";

export const gnoZenaoStagingNetwork: GnoNetworkInfo = {
  id: "gno-zenao-staging",
  kind: NetworkKind.Gno,
  displayName: "Gno Zenao Staging",
  icon: "zenao.svg",
  features: [
    NetworkFeature.Organizations,
    NetworkFeature.UPP,
    NetworkFeature.NameService,
    NetworkFeature.SocialFeedReadonly,
  ],
  currencies: gnoCurrencies,
  stakeCurrency: "ugnot",
  idPrefix: "zenaostaging",
  chainId: "zenao-dev-staging",
  endpoint: "https://gnorpc.staging.zenao.io/",
  testnet: true,
  backendEndpoint: "https://dapp-backend.testnet.teritori.com",
  gnowebURL: "https://gnoweb.staging.zenao.io/",
  vaultContractAddress: "",
  nameServiceContractAddress: "gno.land/r/demo/users",
  nameServiceDefaultImage:
    "ipfs://bafkreigqm3i4urywxohvpkbz5sgxosiogwn433ufmzz7eqldjxoi6xmwma",
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

gnoZenaoStagingNetwork.txExplorer = `https://gnoscan.io/transactions/details?txhash=$hash&${customGnoscanParams(gnoZenaoStagingNetwork)}`;
gnoZenaoStagingNetwork.accountExplorer = `https://gnoscan.io/accounts/$address?${customGnoscanParams(gnoZenaoStagingNetwork)}`;
gnoZenaoStagingNetwork.contractExplorer = `https://gnoscan.io/realms/details?path=$address&${customGnoscanParams(gnoZenaoStagingNetwork)}`;
