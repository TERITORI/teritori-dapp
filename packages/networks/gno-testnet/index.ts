import { gnoCurrencies } from "./currencies";
import { GnoNetworkInfo, NetworkKind } from "../types";

export const gnoTestnetNetwork: GnoNetworkInfo = {
  id: "gno-testnet",
  kind: NetworkKind.Gno,
  displayName: "Gno Testnet",
  icon: "icons/networks/gno.svg",
  features: [],
  currencies: gnoCurrencies,
  stakeCurrency: "ugnot",
  idPrefix: "gno",
  chainId: "test3",
  endpoint: "https://rpc.test3.gno.land",
  txExplorer: "https://etherscan.io/tx/$hash",
  accountExplorer: "https://etherscan.io/address/$address",
  contractExplorer: "https://etherscan.io/address/$address",
  testnet: true,
  backendEndpoint: "https://dapp-backend.mainnet.teritori.com",
  vaultContractAddress: "",
};
