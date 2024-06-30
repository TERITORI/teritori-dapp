import { polygonCurrencies } from "./currencies";
import { EthereumNetworkInfo, NetworkFeature, NetworkKind } from "../types";

export const polygonNetwork: EthereumNetworkInfo = {
  id: "polygon",
  kind: NetworkKind.Ethereum,
  displayName: "Polygon",
  icon: "polygon.svg",
  features: [NetworkFeature.RiotP2E],
  currencies: polygonCurrencies,
  idPrefix: "polygon",
  endpoint: "https://polygon-rpc.com",
  txExplorer: "https://polygonscan.com/tx/$hash",
  accountExplorer: "https://polygonscan.com/address/$address",
  contractExplorer: "https://polygonscan.com/address/$address",
  testnet: false,
  backendEndpoint: "https://dapp-backend.mainnet.teritori.com",
  chainId: 137,
  alchemyApiKey: "TCahW5rzmCaegxHVyhXh3vmCG2sS9Yu3",
  vaultContractAddress: "0x037ecf2480df7b0e8b46d0a9a650cb5371d89573",
  excludeFromLaunchpadList: [],
  riotSquadStakingContractAddress: "0xca415044477678c5e040f6bd1f67da887ab868e9",
  // Substreams
  firehoseEndpoint: "polygon.streamingfast.io:443",
  indexStartBlock: "53027013",
  substreamsManifest: "go/internal/substreams/ethereum/polygon_mainnet.yaml",
  distributorContractAddress: "0xbd85bd724c78150e4ebc3c2bcb0d32ec7c0fc84f",
  toriBridgedTokenAddress: "0x69ded9b7658507ca8c5a6f1f6ff53276802ec228",
  riotOriginalCollectionIdGen0:
    "eth-0x8f8304ea566affeb96ad0ffb593bbebd8876d124",
  riotContractAddressGen0: "0x0e8021622cff2950a35369b336004dea0cd63b5d",
  riotBridgedNFTAddressGen0: "0xe23b470c8b10f7c98c5016d47bd4f98ce4f819f8",
  riotNFTAddressGen0: "0xe23b470c8b10f7c98c5016d47bd4f98ce4f819f8",
};
