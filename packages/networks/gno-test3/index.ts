import { gnoCurrencies } from "./currencies";
import { GnoNetworkInfo, NetworkKind } from "../types";

export const gnoTest3Network: GnoNetworkInfo = {
  id: "gno-test3",
  kind: NetworkKind.Gno,
  displayName: "Gno Test3",
  icon: "icons/networks/gno.svg",
  features: [],
  currencies: gnoCurrencies,
  stakeCurrency: "ugnot",
  idPrefix: "gnotest3",
  chainId: "test3",
  endpoint: "https://rpc.test3.gno.land",
  txExplorer: "https://etherscan.io/tx/$hash",
  accountExplorer: "https://etherscan.io/address/$address",
  contractExplorer: "https://etherscan.io/address/$address",
  testnet: true,
  backendEndpoint: "https://dapp-backend.mainnet.teritori.com",
  vaultContractAddress: "",
  nameServiceContractAddress: "gno.land/r/demo/users",
  nameServiceDefaultImage:
    "ipfs://bafkreignptjimiu7wuux6mk6uh4hb4odb6ff62ny4bvdokrhes7g67huse",
  gnowebURL: "https://test3.gno.land",
};
