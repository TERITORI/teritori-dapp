import { polygonMumbaiCurrencies } from "./currencies";
import { EthereumNetworkInfo, NetworkFeature, NetworkKind } from "../types";

export const polygonMumbaiNetwork: EthereumNetworkInfo = {
  id: "polygon-mumbai",
  kind: NetworkKind.Ethereum,
  displayName: "Polygon Mumbai",
  icon: "polygon.svg",
  features: [NetworkFeature.RiotP2E, NetworkFeature.NFTMarketplace],
  currencies: polygonMumbaiCurrencies,
  idPrefix: "mumbai",
  endpoint: "https://polygon-mumbai.blockpi.network/v1/rpc/public",
  txExplorer: "https://mumbai.polygonscan.com/tx/$hash",
  accountExplorer: "https://mumbai.polygonscan.com/address/$address",
  contractExplorer: "https://mumbai.polygonscan.com/address/$address",
  testnet: true,
  backendEndpoint: "https://dapp-backend.testnet.teritori.com",
  chainId: 80001,
  alchemyApiKey: "TCahW5rzmCaegxHVyhXh3vmCG2sS9Yu3",
  vaultContractAddress: "0xffc71bf3aca1355dc29b06c12bc8ef32f8f20c51",
  excludeFromLaunchpadList: [],
  riotSquadStakingContractAddress: "0xb080380ccb801d4a4c2e75d3aee7728f97cf4608",
  // Substreams
  firehoseEndpoint: "mumbai.streamingfast.io:443",
  indexStartBlock: "43127605", // Deploy Minter: 43127605, // Transfer NFT (old minter): 43031073
  substreamsManifest: "go/internal/substreams/ethereum/polygon_mumbai.yaml",
  distributorContractAddress: "0xe16927b4df1a9938c0b7506186f6d55f2e1403c6",
  toriBridgedTokenAddress: "0xc46944cd8c700b2a33f496219eecca0fdbdc3fac",
  riotOriginalCollectionIdGen0:
    "testeth-0x43cc70bf324d716782628bed38af97e4afe92f69",
  riotContractAddressGen0: "0x916ad9d549907ccbbaf9ba65526826bfc3a9c0c4",
  riotBridgedNFTAddressGen0: "0xd0410e21b2672ca31a4e4c4faff513270e64d5bc",
};
