import { teritoriCurrencies } from "./currencies";
import { NetworkKind, CosmosNetworkInfo, NetworkFeature } from "../types";

const nameServiceContractAddress =
  "tori1wkwy0xh89ksdgj9hr347dyd2dw7zesmtrue6kfzyml4vdtz6e5wscs7038";
const riotContractAddressGen1 =
  "tori1gflccmghzfscmxl95z43v36y0rle8v9x8kvt9na03yzywtw86amsj9nf37";

export const teritoriNetwork: CosmosNetworkInfo = {
  id: "teritori",
  kind: NetworkKind.Cosmos,
  chainId: "teritori-1",
  displayName: "Teritori",
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
  overrides: "cosmos-registry:teritori",
  walletUrlForStaking: "https://app.teritori.com/staking",
  currencies: teritoriCurrencies,
  txExplorer: "https://www.mintscan.io/teritori/txs/$hash",
  accountExplorer: "https://www.mintscan.io/teritori/account/$address",
  contractExplorer: "https://www.mintscan.io/teritori/account/$address",
  idPrefix: "tori",
  testnet: false,
  backendEndpoint: "https://dapp-backend.mainnet.teritori.com",
  addressPrefix: "tori",
  restEndpoint: "https://rest.mainnet.teritori.com",
  rpcEndpoint: "https://rpc.mainnet.teritori.com",
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
    "tori14hj2tavq8fpesdwxxcu44rty3hh90vhujrvcmstl4zr3txmfvw9s3hewys",
  riotContractAddressGen0:
    "tori1mf6ptkssddfmxvhdx0ech0k03ktp6kf9yk59renau2gvht3nq2gqg87tkw",
  riotContractAddressGen1,
  riotSquadStakingContractAddressV1:
    "tori1zwkmdfsc6h96jm4yqdykaw5y7ndwsvqvgh5ryxp9nxs3hccml0xqfyrm37",
  riotSquadStakingContractAddressV2:
    "tori1kvjk9m7dk0es35y6ah0k28llllvle3n7xgvh0gh568ta0paf8awsml2xev",
  distributorContractAddress:
    "tori1mnem0rhjaxcsghe0xw692xysra63xwwdee2wth9s0rkfwh4dxpaq76qqre",
  riotersFooterContractAddress:
    "tori1m6g3l3j5t988zwmp965hrhsxvm8jrkf2ulw4gmwj8hx8pd84tvcqeearsd",
  secondaryDuringMintList: [
    nameServiceContractAddress,
    riotContractAddressGen1,
    "tori1lnx4r7styl209e9lfce8tdd7hyclq98upx25ax3t2qkmcl3jlgvsh787qa", // Glitch Candies
    "tori167xst2jy9n6u92t3n8hf762adtpe3cs6acsgn0w5n2xlz9hv3xgs4ksc6t", // Diseases of the Brain AI
  ],
  excludeFromLaunchpadList: [riotContractAddressGen1],
  socialFeedContractAddress:
    "tori1lxf8agg0wd2m7n2ultl0yx337jw23puh0mlkkw5vhtnkkfettwfqya7kpp",
  daoFactoryContractAddress:
    "tori16rxh5hgukhdq8rvm2j3t6v483dcqguwp4l825vlwz5pmfpw7s4rs45nnca",
  daoCoreCodeId: 27,
  daoPreProposeSingleCodeId: 28,
  daoProposalSingleCodeId: 31,
  daoCw4GroupCodeId: 32,
  daoVotingCw4CodeId: 33,
};
