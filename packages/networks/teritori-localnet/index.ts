import { teritoriLocalnetCurrencies } from "./currencies";
import { NetworkFeature, NetworkInfo, NetworkKind } from "../types";

const nameServiceContractAddress = "";

const riotContractAddressGen1 = "";

export const teritoriLocalnetNetwork: NetworkInfo = {
  id: "teritori-localnet",
  kind: NetworkKind.Cosmos,
  chainId: "testing",
  displayName: "Teritori Localnet",
  registryName: "teritorilocalnet",
  icon: "icons/networks/teritori.svg",
  features: [
    NetworkFeature.NFTMarketplace,
    NetworkFeature.Organizations,
    NetworkFeature.SocialFeed,
    NetworkFeature.UPP,
    NetworkFeature.NameService,
    NetworkFeature.BurnTokens,
    NetworkFeature.NFTLaunchpad,
    NetworkFeature.RiotP2E,
    NetworkFeature.NFTMarketplaceLeaderboard,
  ],
  currencies: teritoriLocalnetCurrencies,
  txExplorer: "",
  accountExplorer: "",
  contractExplorer: "",
  idPrefix: "devtori",
  testnet: true,
  backendEndpoint: "http://localhost:9090",
  addressPrefix: "tori",
  restEndpoint: "http://127.0.0.1:1317",
  rpcEndpoint: "http://127.0.0.1:26657",
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
  daoCoreCodeId: -1,
  daoPreProposeSingleCodeId: -1,
  daoProposalSingleCodeId: -1,
  cw4GroupCodeId: -1,
  daoVotingCw4CodeId: -1,
  cwAdminFactoryCodeId: -1,
  cwAdminFactoryContractAddress: "",
};
