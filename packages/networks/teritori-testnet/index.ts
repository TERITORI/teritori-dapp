import { teritoriTestnetCurrencies } from "./currencies";
import {
  CosmWasmLaunchpad,
  CosmWasmPremiumFeed,
  NetworkFeature,
} from "../features";
import { CosmosNetworkInfo, NetworkKind } from "../types";

const nameServiceContractAddress = "";

const premiumFeedFeature: CosmWasmPremiumFeed = {
  type: NetworkFeature.CosmWasmPremiumFeed,
  membershipContractAddress: "",
  mintDenom: "utori",
};

const cosmwasmLaunchpadFeature: CosmWasmLaunchpad = {
  type: NetworkFeature.NFTLaunchpad,
  launchpadContractAddress:
    "tori14q3el3uekvvhtg6af4wz89e8muqdsmz3yx37pw74w06luvsehwlsmh9q4e",
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
  ],
  featureObjects: [premiumFeedFeature, cosmwasmLaunchpadFeature],
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
  vaultContractAddress: "",
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
  socialFeedContractAddress: "",
  daoCoreCodeId: -1,
  daoPreProposeSingleCodeId: -1,
  daoProposalSingleCodeId: -1,
  daoCw4GroupCodeId: -1,
  daoVotingCw4CodeId: -1,
  daoFactoryCodeId: -1,
  daoFactoryContractAddress: "",
};
