import { polygonMumbaiCurrencies } from "./currencies";
import { NetworkFeature, NetworkInfo, NetworkKind } from "../types";

export const polygonMumbaiNetwork: NetworkInfo = {
  id: "polygon-mumbai",
  kind: NetworkKind.Ethereum,
  displayName: "Polygon Mumbai",
  icon: "icons/networks/polygon.svg",
  features: [NetworkFeature.P2E],
  currencies: polygonMumbaiCurrencies,
  idPrefix: "mumbai",
  endpoint: "https://polygon-mumbai.blockpi.network/v1/rpc/public	",
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
  riotContractAddressGen0: "0x43cc70bf324d716782628bed38af97e4afe92f69:testeth",
  excludeFromLaunchpadList: [],
  riotSquadStakingContractAddress: "0xb080380ccb801d4a4c2e75d3aee7728f97cf4608",
  // Substreams
  firehoseEndpoint: "mumbai.streamingfast.io:443",
  indexStartBlock: "40891584",
  indexStopBlock: "-1",
  indexBlockProgress: 1000,
  indexLiveBlockProgress: 1,
  substreamsManifest: "go/internal/substreams/ethereum/polygon_mumbai.yaml",
  distributorContractAddress: "0x750070a76A3444F27E3fccabe4D423105cfa3e72",
  riotBridgedNFTAddressGen0: "0xda2e0db1772e5635999f83a3d6e777b45980863b", // "0x059a95a0e7829f20650763adfe93456a8289b808",
};
