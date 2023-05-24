import { gnoCurrencies } from "./currencies";
import { NetworkInfo, NetworkKind } from "../types";

export const gnoTestnetNetwork: NetworkInfo = {
  id: "gno-testnet",
  kind: NetworkKind.Gno,
  displayName: "Gno",
  icon: "icons/networks/ethereum.svg",
  currencies: gnoCurrencies,
  idPrefix: "gno",
  chainId: "test3",
  endpoint: "https://rpc.test3.gno.land",
  txExplorer: "https://etherscan.io/tx/$hash",
  accountExplorer: "https://etherscan.io/address/$address",
  contractExplorer: "https://etherscan.io/address/$address",
  testnet: true,
  backendEndpoint: "https://dapp-backend.mainnet.teritori.com",
};
