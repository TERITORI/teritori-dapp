import { NetworkKind, NetworkInfo } from "../types";

export const solanaNetwork: NetworkInfo = {
  id: "solana",
  kind: NetworkKind.Solana,
  displayName: "Solana",
  icon: "icons/networks/solana.svg",
  currencies: [],
  txExplorer: "TODO",
  accountExplorer: "TODO",
  contractExplorer: "TODO",
  idPrefix: "sol",
  testnet: false,
  backendEndpoint: "https://dapp-backend.mainnet.teritori.com",
  holaplexGraphqlEndpoint: "",
};
