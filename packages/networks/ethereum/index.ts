import { ethereumCurrencies } from "./currencies";
import { EthereumNetworkInfo, NetworkFeature, NetworkKind } from "../types";

export const ethereumNetwork: EthereumNetworkInfo = {
  id: "ethereum",
  kind: NetworkKind.Ethereum,
  displayName: "Ethereum",
  icon: "icons/networks/ethereum.svg",
  features: [
    NetworkFeature.NFTMarketplace,
    NetworkFeature.RiotP2E,
    NetworkFeature.NFTLaunchpad,
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
  theGraphEndpoint:
    "https://api.studio.thegraph.com/query/40379/teritori-mainnet/v1",
  vaultContractAddress: "0x6251B3384c8eD53e2Cc38d34c1f26ffE8d461B94",
  riotContractAddressGen0: "0x8f8304ea566affeb96ad0ffb593bbebd8876d124",
  riotSquadStakingContractAddress: "<must_fill>",
  // Substreams
  firehoseEndpoint: "<must_fill>",
  indexStartBlock: "<must_fill>",
  indexStopBlock: "<must_fill>",
  indexBlockProgress: 0,
  indexLiveBlockProgress: 0,
  substreamsManifest: "<must_fill>",
};
