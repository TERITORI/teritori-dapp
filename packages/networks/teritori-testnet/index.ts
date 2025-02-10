import { teritoriTestnetCurrencies } from "./currencies";
import {
  CosmWasmNFTLaunchpad,
  CosmWasmNFTsBurner,
  CosmWasmPremiumFeed,
  CosmWasmRakki,
  NetworkFeature,
  NFTMarketplace,
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

const nftMarketplace: NFTMarketplace = {
  type: NetworkFeature.NFTMarketplace,
  cwAddressListCodeId: 63,
  cwAddressListContractAddress:
    "tori1x72plnprsjnmszylmdm3cnvu5h6u55fyf0pe02lye9p6q2ws05ps33qmft",
};

const cosmwasmNftLaunchpadFeature: CosmWasmNFTLaunchpad = {
  type: NetworkFeature.CosmWasmNFTLaunchpad,
  launchpadContractAddress:
    "tori1l07lh669x8wg2rh3pxzpatrr2npf5ql7y6kusaup53fu2xr68p5qglyy9t",
  launchpadEndpoint: "https://dapp-backend.testnet.teritori.com",
  nftTr721CodeId: 60,
  codeId: 95,
  defaultMintDenom: "utori",
  daoProposalSingleContractAddress:
    "tori1tj2uked2zfq958w6cugnm44qlllnrpaaxk09j39qqdqhhedjpljszjyhx6",
};

const rakkiFeature: CosmWasmRakki = {
  type: NetworkFeature.CosmWasmRakki,
  codeId: 81,
  contractAddress:
    "tori1ycw04kktq9l0ywqr85suuvg9t80h3nr94juxxkuxhh4sha7r8fuses8de3",
};

const riotContractAddressGen0 =
  "tori1r8raaqul4j05qtn0t05603mgquxfl8e9p7kcf7smwzcv2hc5rrlq0vket0";
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
    NetworkFeature.CosmWasmNFTLaunchpad,
    NetworkFeature.CosmWasmPremiumFeed,
    NetworkFeature.NFTMarketplaceLeaderboard,
    NetworkFeature.CosmWasmNFTsBurner,
    NetworkFeature.CosmWasmRakki,
  ],
  featureObjects: [
    premiumFeedFeature,
    nftsBurnerFeature,
    nftMarketplace,
    cosmwasmNftLaunchpadFeature,
    rakkiFeature,
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
  secondaryDuringMintList: [
    premiumFeedFeature.membershipContractAddress,
    nameServiceContractAddress,
    riotContractAddressGen0,
    riotContractAddressGen1,
  ],
  excludeFromLaunchpadList: [riotContractAddressGen1],
  socialFeedContractAddress:
    "tori1mf6ptkssddfmxvhdx0ech0k03ktp6kf9yk59renau2gvht3nq2gqg87tkw",
  daoCoreCodeId: 30,
  daoPreProposeSingleCodeId: 32,
  daoProposalSingleCodeId: 33,
  cw4GroupCodeId: 28,
  daoVotingCw4CodeId: 31,
  cwAdminFactoryCodeId: 29,
  cwAdminFactoryContractAddress:
    "tori1du6yg34tljg54s5qhsqv2ay23nx7cqjmku2yuv0fs4namz7yn9yqep8rde",
};
