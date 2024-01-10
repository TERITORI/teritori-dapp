import { teritoriTestnetCurrencies } from "./currencies";
import { NetworkFeature, NetworkInfo, NetworkKind } from "../types";

const nameServiceContractAddress =
  "tori14hj2tavq8fpesdwxxcu44rty3hh90vhujrvcmstl4zr3txmfvw9s3hewys";

const riotContractAddressGen1 = "";

export const teritoriTestnetNetwork: NetworkInfo = {
  id: "teritori-testnet",
  kind: NetworkKind.Cosmos,
  chainId: "teritori-test-5",
  displayName: "Teritori Testnet",
  icon: "icons/networks/teritori.svg",
  features: [
    NetworkFeature.NFTMarketplace,
    NetworkFeature.RiotP2E,
    NetworkFeature.Organizations,
    NetworkFeature.SocialFeed,
    NetworkFeature.UPP,
    NetworkFeature.NameService,
    NetworkFeature.BurnTokens,
    NetworkFeature.NFTLaunchpad,
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
  vaultContractAddress: "",
  riotContractAddressGen0: "",
  riotContractAddressGen1,
  riotSquadStakingContractAddressV1: "",
  riotSquadStakingContractAddressV2: "",
  distributorContractAddress: "",
  riotersFooterContractAddress: "",
  secondaryDuringMintList: [
    nameServiceContractAddress,
    riotContractAddressGen1,
  ],
  excludeFromLaunchpadList: [riotContractAddressGen1],
  socialFeedContractAddress: "",
  daoCw20CodeId: -1,
  daoFactoryCodeId: -1,
  daoCoreCodeId: -1,
  daoPreProposeSingleCodeId: -1,
  daoProposalSingleCodeId: -1,
  daoVotingCw20StakedCodeId: -1,
  daoCw20StakeCodeId: -1,
  daoCw4GroupCodeId: -1,
  daoVotingCw4CodeId: -1,
  daoFactoryContractAddress: "",
  coreDAOAddress: "",
};
