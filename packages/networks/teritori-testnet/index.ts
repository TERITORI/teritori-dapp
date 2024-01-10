import { teritoriTestnetCurrencies } from "./currencies";
import { NetworkFeature, NetworkInfo, NetworkKind } from "../types";

const nameServiceContractAddress =
  "tori160wk6qdepxy99p79vgq4ue0stvz4sstxfcj5n9vq04h6gx6ydrwsy0a5fy";

const riotContractAddressGen1 = "";

export const teritoriTestnetNetwork: NetworkInfo = {
  id: "teritori-testnet",
  kind: NetworkKind.Cosmos,
  chainId: "teritori-test-5",
  displayName: "Teritori Testnet",
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
    "tori1da7gq3lv7v48fkq2w4jp0f0yg4v7rey3d92legs8e83mhuf3agyq2z7rr9",
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
  socialFeedContractAddress:
    "tori1fc7nakzuyfn2qzkclafcsc54asamnclg064962lwne40w2lq558q2ch5h9",
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
