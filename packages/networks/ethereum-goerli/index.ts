import { ethereumGoerliCurrencies } from "./currencies";
import { NetworkFeature, NetworkInfo, NetworkKind } from "../types";

export const ethereumGoerliNetwork: NetworkInfo = {
  id: "ethereum-goerli",
  kind: NetworkKind.Ethereum,
  displayName: "Ethereum Goerli",
  features: [NetworkFeature.NFTMarketplace],
  icon: "ethereum.svg",
  currencies: ethereumGoerliCurrencies,
  idPrefix: "testeth",
  endpoint: "https://goerli.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161",
  txExplorer: "https://goerli.etherscan.io/tx/$hash",
  accountExplorer: "https://goerli.etherscan.io/address/$address",
  contractExplorer: "https://goerli.etherscan.io/address/$address",
  testnet: true,
  backendEndpoint: "https://dapp-backend.testnet.teritori.com",
  chainId: 5,
  alchemyApiKey: "TCahW5rzmCaegxHVyhXh3vmCG2sS9Yu3",
  theGraphEndpoint:
    "https://api.studio.thegraph.com/query/40379/teritori-goerli-indexer/v-test-01",
  vaultContractAddress: "0xaB30d7379EbfD146B77B0B4d6f3eB09BD725e4EF",
  riotContractAddress: "0x43cc70bf324d716782628bed38af97e4afe92f69",
};
