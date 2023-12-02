import { polygonMumbaiCurrencies } from "./currencies";
import { EthereumNetworkInfo, NetworkFeature, NetworkKind } from "../types";

export const polygonMumbaiNetwork: EthereumNetworkInfo = {
  id: "polygon-mumbai",
  kind: NetworkKind.Ethereum,
  displayName: "Polygon Mumbai",
  icon: "icons/networks/polygon.svg",
  features: [NetworkFeature.RiotP2E, NetworkFeature.NFTMarketplace],
  currencies: polygonMumbaiCurrencies,
  idPrefix: "mumbai",
  endpoint: "https://polygon-mumbai.blockpi.network/v1/rpc/public",
  txExplorer: "https://mumbai.polygonscan.com/tx/$hash",
  accountExplorer: "https://mumbai.polygonscan.com/address/$address",
  contractExplorer: "https://mumbai.polygonscan.com/address/$address",
  testnet: true,
  // backendEndpoint: "https://dapp-backend.testnet.teritori.com",
  backendEndpoint: "http://localhost:9090",
  chainId: 80001,
  alchemyApiKey: "TCahW5rzmCaegxHVyhXh3vmCG2sS9Yu3",
  theGraphEndpoint:
    "https://api.studio.thegraph.com/query/40379/teritori-goerli-indexer/v-test-01",
  vaultContractAddress: "0xab30d7379ebfd146b77b0b4d6f3eb09bd725e4ef",
  excludeFromLaunchpadList: [],
  riotSquadStakingContractAddress: "0xb080380ccb801d4a4c2e75d3aee7728f97cf4608",
  // Substreams
  firehoseEndpoint: "mumbai.streamingfast.io:443",
  indexStartBlock: "43031073", // Deploy Minter: 43093454, // Transfer NFT: 43031073
  indexStopBlock: "-1",
  indexBlockProgress: 1000,
  indexLiveBlockProgress: 1,
  substreamsManifest: "go/internal/substreams/ethereum/polygon_mumbai.yaml",
  distributorContractAddress: "0xe16927b4df1a9938c0b7506186f6d55f2e1403c6",
  toriBridgedTokenAddress: "0xc46944cd8c700b2a33f496219eecca0fdbdc3fac",
  riotContractAddressGen0: "0xce4b9a825fd6ee8ed87fa7ab5088acacd38300a7",
  riotBridgedNFTAddressGen0: "0x6076668fd92ea736d29c1cfa79a332abc10b2402",
  riotOriginalCollectionIdGen0:
    "testeth-0x43cc70bf324d716782628bed38af97e4afe92f69",
};
