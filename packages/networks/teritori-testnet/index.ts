import { teritoriTestnetCurrencies } from "./currencies";
import {
  CosmWasmLaunchpad,
  CosmWasmNFTsBurner,
  CosmWasmPremiumFeed,
  NetworkFeature,
} from "../features";
import { CosmosNetworkInfo, NetworkKind } from "../types";

const nameServiceContractAddress =
  "tori1436kxs0w2es6xlqpp9rd35e3d0cjnw4sv8j3a7483sgks29jqwgsjscd88";

const premiumFeedFeature: CosmWasmPremiumFeed = {
  type: NetworkFeature.CosmWasmPremiumFeed,
  membershipContractAddress: "",
  mintDenom: "utori",
};

const nftsBurnerFeature: CosmWasmNFTsBurner = {
  type: NetworkFeature.CosmWasmNFTsBurner,
  burnerContractAddress:
    "tori1qyl0j7a24amk8k8gcmvv07y2zjx7nkcwpk73js24euh64hkja6esd2p2xp",
};

const cosmwasmLaunchpadFeature: CosmWasmLaunchpad = {
  type: NetworkFeature.NFTLaunchpad,
  launchpadContractAddress:
    "tori1wug8sewp6cedgkmrmvhl3lf3tulagm9hnvy8p0rppz9yjw0g4wtqfxt3j6",
  defaultMintDenom: "utori",
};

const riotContractAddressGen0 =
  "tori1hzz0s0ucrhdp6tue2lxk3c03nj6f60qy463we7lgx0wudd72ctmstg4wkc";
const riotContractAddressGen1 = "";

export const teritoriTestnetNetwork: CosmosNetworkInfo = {
  id: "teritori-testnet",
  kind: NetworkKind.Cosmos,
  chainId: "teritori-test-7",
  displayName: "Teritori Testnet",
  registryName: "teritoritestnet",
  icon: "teritori.svg",
  features: [
    NetworkFeature.NFTMarketplace,
    NetworkFeature.RiotP2E,
    NetworkFeature.Organizations,
    NetworkFeature.SocialFeed,
    NetworkFeature.UPP,
    NetworkFeature.NameService,
    NetworkFeature.BurnTokens,
    NetworkFeature.NFTLaunchpad,
    NetworkFeature.CosmWasmPremiumFeed,
    NetworkFeature.NFTMarketplaceLeaderboard,
    NetworkFeature.CosmWasmNFTsBurner,
  ],
  featureObjects: [
    premiumFeedFeature,
    nftsBurnerFeature,
    cosmwasmLaunchpadFeature,
  ],
  currencies: teritoriTestnetCurrencies,
  txExplorer: "https://explorer.teritori.com/teritori-testnet/tx/$hash",
  accountExplorer:
    "https://explorer.teritori.com/teritori-testnet/account/$address",
  contractExplorer:
    "https://explorer.teritori.com/teritori-testnet/account/$address",
  idPrefix: "testori",
  testnet: true,
  backendEndpoint: "https://dapp-backend.testnet.teritori.com",
  addressPrefix: "tori",
  restEndpoint: "https://rest.testnet.teritori.com",
  rpcEndpoint: "https://rpc.testnet.teritori.com",
  stakeCurrency: "utori",
  gasPriceStep: {
    low: 0.0,
    average: 0.025,
    high: 0.04,
  },
  cosmosFeatures: [
    "stargate",
    "ibc-transfer",
    "cosmwasm",
    "no-legacy-stdTx",
    "ibc-go",
  ],
  nameServiceContractAddress,
  nameServiceDefaultImage:
    "ipfs://bafkreieqcwmjcb64r42ygs6a4dswz63djzgayjn3rhzjber3e42cknawlm",
  nameServiceTLD: ".tori",
  vaultContractAddress:
    "tori1wn625s4jcmvk0szpl85rj5azkfc6suyvf75q6vrddscjdphtve8s2f76jm",
  riotContractAddressGen0,
  riotContractAddressGen1,
  riotSquadStakingContractAddressV1: "",
  riotSquadStakingContractAddressV2: "",
  distributorContractAddress: "",
  riotersFooterContractAddress: "",
  secondaryDuringMintList: [
    premiumFeedFeature.membershipContractAddress,
    nameServiceContractAddress,
    riotContractAddressGen0,
    riotContractAddressGen1,
  ],
  excludeFromLaunchpadList: [riotContractAddressGen1],
  socialFeedContractAddress:
    "tori1mf6ptkssddfmxvhdx0ech0k03ktp6kf9yk59renau2gvht3nq2gqg87tkw",
  daoCoreCodeId: -1,
  daoPreProposeSingleCodeId: -1,
  daoProposalSingleCodeId: -1,
  daoCw4GroupCodeId: -1,
  daoVotingCw4CodeId: -1,
  daoFactoryCodeId: -1,
  daoFactoryContractAddress: "",
};
