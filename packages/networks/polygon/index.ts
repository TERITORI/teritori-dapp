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
  endpoint: "https://polygon-mumbai.blockpi.network/v1/rpc/public",
  txExplorer: "https://mumbai.polygonscan.com/tx/$hash",
  accountExplorer: "https://mumbai.polygonscan.com/address/$address",
  contractExplorer: "https://mumbai.polygonscan.com/address/$address",
  testnet: false,
  backendEndpoint: "https://dapp-backend.testnet.teritori.com",
  chainId: 137,
  alchemyApiKey: "TCahW5rzmCaegxHVyhXh3vmCG2sS9Yu3",
  vaultContractAddress: "0x037ecf2480df7b0e8b46d0a9a650cb5371d89573",
  excludeFromLaunchpadList: [],
  riotSquadStakingContractAddress: "0x9083986a7c842b6c733c2f9bd25d67cc27119025",
  // Substreams
  firehoseEndpoint: "polygon.streamingfast.io:443",
  indexStartBlock: "52917042",
  indexStopBlock: "-1",
  substreamsManifest: "go/internal/substreams/ethereum/polygon.yaml",
  distributorContractAddress: "0xbd85bd724c78150e4ebc3c2bcb0d32ec7c0fc84f",
  toriBridgedTokenAddress: "0x69ded9b7658507ca8c5a6f1f6ff53276802ec228",
  riotOriginalCollectionIdGen0:
    "mumbai-0x8f8304ea566affeb96ad0ffb593bbebd8876d124",
  riotContractAddressGen0: "0x9083986a7c842b6c733c2f9bd25d67cc27119025",
  riotBridgedNFTAddressGen0: "0x539b772de11f78109e0131bf9fde54b4b50a8440",
};
