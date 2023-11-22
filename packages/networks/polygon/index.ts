import { polygonCurrencies } from "./currencies";
import { EthereumNetworkInfo, NetworkFeature, NetworkKind } from "../types";

const riotContractAddressGen1 = "";

export const polygonNetwork: EthereumNetworkInfo = {
  id: "polygon",
  kind: NetworkKind.Ethereum,
  displayName: "Polygon",
  icon: "icons/networks/polygon.svg",
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
  theGraphEndpoint:
    "https://api.studio.thegraph.com/query/40379/teritori-goerli-indexer/v-test-01",
  vaultContractAddress: "0xab30d7379ebfd146b77b0b4d6f3eb09bd725e4ef",
  riotContractAddressGen0: "0x40d2ed8611f7b4633adf162f788b67cae1811f24",
  riotContractAddressGen1,
  excludeFromLaunchpadList: [],
  riotSquadStakingContractAddress: "0x9083986a7c842b6c733c2f9bd25d67cc27119025",
  // Substreams
  firehoseEndpoint: "mumbai.streamingfast.io:443",
  indexStartBlock: "40567872",
  indexStopBlock: "-1",
  indexBlockProgress: 1000,
  indexLiveBlockProgress: 1,
  substreamsManifest: "go/internal/substreams/ethereum/polygon_mumbai.yaml",
  distributorContractAddress: "0x750070a76A3444F27E3fccabe4D423105cfa3e72",
};
