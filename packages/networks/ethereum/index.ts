import { ethereumCurrencies } from "./currencies";
import { NetworkFeature, NetworkInfo, NetworkKind } from "../types";

export const ethereumNetwork: NetworkInfo = {
  id: "ethereum",
  kind: NetworkKind.Ethereum,
  displayName: "Ethereum",
  features: [NetworkFeature.NFTMarketplace],
  icon: "ethereum.svg",
  currencies: ethereumCurrencies,
  idPrefix: "eth",
  endpoint: "https://ethereum.publicnode.com",
  txExplorer: "https://etherscan.io/tx/$hash",
  accountExplorer: "https://etherscan.io/address/$address",
  contractExplorer: "https://etherscan.io/address/$address",
  testnet: false,
  backendEndpoint: "https://dapp-backend.mainnet.teritori.com",
  chainId: 1,
  alchemyApiKey: "xZ3FVF0o6q_4beg_afmCEzf4GSJErhId",
  theGraphEndpoint:
    "https://api.studio.thegraph.com/query/40379/teritori-mainnet/v1",
  vaultContractAddress: "0x6251B3384c8eD53e2Cc38d34c1f26ffE8d461B94",
  riotContractAddress: "0x8f8304ea566affeb96ad0ffb593bbebd8876d124",
};
