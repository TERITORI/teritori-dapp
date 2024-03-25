import { teritoriTestnetCurrencies } from "./currencies";
import { CosmWasmPremiumFeed, NetworkFeature } from "../features";
import { NetworkInfo, NetworkKind } from "../types";

const nameServiceContractAddress =
  "tori14hj2tavq8fpesdwxxcu44rty3hh90vhujrvcmstl4zr3txmfvw9s3hewys";

const premiumFeedFeature: CosmWasmPremiumFeed = {
  type: NetworkFeature.CosmWasmPremiumFeed,
  membershipContractAddress:
    "tori1rs244rjrhap2v4setxlugkh8ungxlrsh8asvh0trsgvqvplvkd5q7752l6",
  mintDenom: "utori",
};

const launchpadContractAddress = "tori164jjtp4c032arq30dzpgn2uujwavm777ug7we5evlvf0c26007jqetqdv3";

const riotContractAddressGen0 =
  "tori1hzz0s0ucrhdp6tue2lxk3c03nj6f60qy463we7lgx0wudd72ctmstg4wkc";
const riotContractAddressGen1 = "";

export const teritoriTestnetNetwork: NetworkInfo = {
  id: "teritori-testnet",
  kind: NetworkKind.Cosmos,
  chainId: "teritori-test-6",
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
  featureObjects: [premiumFeedFeature],
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
    "tori17p9rzwnnfxcjp32un9ug7yhhzgtkhvl9jfksztgw5uh69wac2pgs9ezf0j",
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
    "tori1nc5tatafv6eyq7llkr2gv50ff9e22mnf70qgjlv737ktmt4eswrqazuvxk",
  daoCoreCodeId: 4,
  daoPreProposeSingleCodeId: 5,
  daoProposalSingleCodeId: 6,
  daoCw4GroupCodeId: 7,
  daoVotingCw4CodeId: 8,
  daoFactoryCodeId: 9,
  daoFactoryContractAddress:
    "tori1s85asu5dckeelmgzrwqakxc8tc4gllutjq4uq3a4lwak2hfp9c3q4spguf",
};
