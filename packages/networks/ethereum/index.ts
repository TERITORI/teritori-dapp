import { ethereumCurrencies } from "./currencies";
import { EthereumNetworkInfo, NetworkFeature, NetworkKind } from "../types";

export const ethereumNetwork: EthereumNetworkInfo = {
  id: "ethereum",
  kind: NetworkKind.Ethereum,
  displayName: "Ethereum",
  icon: "ethereum.svg",
  features: [
    NetworkFeature.NFTMarketplace,
    NetworkFeature.RiotP2E,
    NetworkFeature.NFTLaunchpad,
    NetworkFeature.NFTBridge,
  ],
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
  vaultContractAddress: "0x6251B3384c8eD53e2Cc38d34c1f26ffE8d461B94",
  riotContractAddressGen0: "0x8f8304ea566affeb96ad0ffb593bbebd8876d124",
  riotSquadStakingContractAddress: "0x00---",
  // Substreams
  firehoseEndpoint: "mainnet.eth.streamingfast.io:443",
  indexStartBlock: "16341067",
  indexStopBlock: "-1",
  substreamsManifest: "go/internal/substreams/ethereum/ethereum_mainnet.yaml",
  distributorContractAddress: "0x00---",
  riotBridgeAddressGen0: "0x00---",
  riotNFTAddressGen0: "0x39e45eca52965210e69f7e768f58550460e5e79a",
};
