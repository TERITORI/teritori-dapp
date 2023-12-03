import { ethereumGoerliCurrencies } from "./currencies";
import { EthereumNetworkInfo, NetworkFeature, NetworkKind } from "../types";

const riotContractAddressGen1 = "0xdfff431d4c2275201dEd83dAd613A3DbDA1D11A7";

export const ethereumGoerliNetwork: EthereumNetworkInfo = {
  id: "ethereum-goerli",
  kind: NetworkKind.Ethereum,
  displayName: "Ethereum Goerli",
  icon: "icons/networks/ethereum.svg",
  features: [
    NetworkFeature.NFTMarketplace,
    NetworkFeature.RiotP2E,
    NetworkFeature.NFTLaunchpad,
    NetworkFeature.NFTBridge,
  ],
  currencies: ethereumGoerliCurrencies,
  idPrefix: "testeth",
  endpoint: "https://goerli.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161",
  txExplorer: "https://goerli.etherscan.io/tx/$hash",
  accountExplorer: "https://goerli.etherscan.io/address/$address",
  contractExplorer: "https://goerli.etherscan.io/address/$address",
  testnet: true,
  backendEndpoint: "https://dapp-backend.testnet.teritori.com",
  // backendEndpoint: "http://localhost:9090",
  chainId: 5,
  alchemyApiKey: "TCahW5rzmCaegxHVyhXh3vmCG2sS9Yu3",
  theGraphEndpoint:
    "https://api.studio.thegraph.com/query/40379/teritori-goerli-indexer/v-test-01",
  vaultContractAddress: "0xab30d7379ebfd146b77b0b4d6f3eb09bd725e4ef",
  riotContractAddressGen0: "0x43cc70bf324d716782628bed38af97e4afe92f69",
  riotContractAddressGen1,
  excludeFromLaunchpadList: [riotContractAddressGen1],
  riotSquadStakingContractAddress: "0xdfa5cbcd0db5d966e68dd143c6441ec47e2777be",
  // Substreams
  firehoseEndpoint: "goerli.eth.streamingfast.io:443",
  indexStartBlock: "8218450", //  Stake: "8694034", Mint: "8218450", Bridge: "9817776"
  indexStopBlock: "-1",
  indexBlockProgress: 1000,
  indexLiveBlockProgress: 1,
  substreamsManifest: "go/internal/substreams/ethereum/ethereum_goerli.yaml",
  distributorContractAddress: "0x750070a76a3444f27e3fccabe4d423105cfa3e72",
  riotBridgeAddressGen0: "0xf7e1268364168328c0445b8da152581f96f49780",
  riotNFTAddressGen0: "0x7a9e5dbe7d3946ce4ea2f2396549c349635ebf2f",
};
