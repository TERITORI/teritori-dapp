import { ethereumGoerliCurrencies } from "./currencies";
import { NetworkInfo, NetworkKind } from "../types";

const riotContractAddressGen1 = "0xdfff431d4c2275201dEd83dAd613A3DbDA1D11A7";

export const ethereumGoerliNetwork: NetworkInfo = {
  id: "ethereum-goerli",
  kind: NetworkKind.Ethereum,
  displayName: "Ethereum Goerli",
  icon: "icons/networks/ethereum.svg",
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
  vaultContractAddress: "0xaB30d7379EbfD146B77B0B4d6f3eB09BD725e4EF",
  riotContractAddressGen0: "0x43cc70bf324d716782628bed38af97e4afe92f69",
  riotContractAddressGen1,
  excludeFromLaunchpadList: [riotContractAddressGen1],
  riotSquadStakingContractAddress: "0xdfA5cbcD0Db5d966E68dd143c6441eC47e2777bE",
  // Substreams
  firehoseEndpoint: "goerli.eth.streamingfast.io:443",
  indexStartBlock: "8694034", //  Stake: "8694034",
  // indexStartBlock: "8255711", //  TransferFrom
  indexStopBlock: "+500",
  indexBlockProgress: 1000,
  indexLiveBlockProgress: 1,
  substreamsManifest: "go/internal/substreams/ethereum/ethereum_goerli.yaml",
};
