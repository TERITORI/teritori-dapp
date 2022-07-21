import { Currency, Keplr } from "@keplr-wallet/types";

export const UTORI_PER_TORI = 1000000;
export const teritoriRestProvider = "http://176.9.19.162:1317";
export const teritoriRPCProvider = "http://176.9.19.162:26657";
export const teritoriChainId = "teritori-testnet-v2";

const toriDisplayDenom = "Tori";
const toriDenom = "utori";
const teritoriBechPrefix = "tori";

interface CosmosBalancesResponse {
  balances: { denom: string; amount: string }[];
}

const getCosmosBalances = async (address: string) => {
  const response = await fetch(
    `${teritoriRestProvider}/cosmos/bank/v1beta1/balances/${address}`
  );
  const responseJSON: CosmosBalancesResponse = await response.json();
  return responseJSON;
};

export const getUtoriBalance = async (address: string) => {
  const cosmosBalances = await getCosmosBalances(address);
  return cosmosBalances.balances
    .filter((balance) => balance.denom === toriDenom)
    .reduce((total, balance) => total + parseInt(balance.amount, 10), 0);
};

// You can add, remove or modify the domains and their status (See DomainsAvailability in NSBHomeScreen.tsx)
export const domainsList = [
  {
    // Displayed name
    name: ".teritori",
    // Is the domains can be minted ? Or just displayed as a "future available domain" (Doesn't exist yet)
    comingSoon: false,
    // Is the domain minted ? (To be true, comingSoon=false necessary) (I don't talk about "availability" to avoid confusion)
    minted: false,
  },
  {
    name: ".tori",
    comingSoon: false,
    minted: false,
  },
  {
    name: ".osmo",
    comingSoon: true,
    minted: false,
  },
  {
    name: ".atom",
    comingSoon: true,
    minted: false,
  },
  {
    name: ".juno",
    comingSoon: true,
    minted: false,
  },
];

const toriCurrency: Currency = {
  // Coin denomination to be displayed to the user.
  coinDenom: toriDisplayDenom,
  // Actual denom (i.e. uatom, uscrt) used by the blockchain.
  coinMinimalDenom: toriDenom,
  // # of decimal points to convert minimal denomination to user-facing denomination.
  coinDecimals: 6,
  // (Optional) Keplr can show the fiat value of the coin if a coingecko id is provided.
  // You can get id from https://api.coingecko.com/api/v3/coins/list if it is listed.
  // coinGeckoId: ""
};

export const keplrSuggestTeritori = (keplr: Keplr) =>
  keplr.experimentalSuggestChain({
    // Chain-id of the Cosmos SDK chain.
    chainId: teritoriChainId,
    // The name of the chain to be displayed to the user.
    chainName: "Teritori",
    // RPC endpoint of the chain.
    rpc: teritoriRPCProvider,
    // REST endpoint of the chain.
    rest: teritoriRestProvider,
    // Staking coin information
    stakeCurrency: toriCurrency,
    // (Optional) If you have a wallet webpage used to stake the coin then provide the url to the website in `walletUrlForStaking`.
    // The 'stake' button in Keplr extension will link to the webpage.
    // walletUrlForStaking: "",
    // The BIP44 path.
    bip44: {
      // You can only set the coin type of BIP44.
      // 'Purpose' is fixed to 44.
      coinType: 118,
    },
    // Bech32 configuration to show the address to user.
    bech32Config: {
      bech32PrefixAccAddr: teritoriBechPrefix,
      bech32PrefixAccPub: `${teritoriBechPrefix}pub`,
      bech32PrefixValAddr: `${teritoriBechPrefix}valoper`,
      bech32PrefixValPub: `${teritoriBechPrefix}valoperpub`,
      bech32PrefixConsAddr: `${teritoriBechPrefix}valcons`,
      bech32PrefixConsPub: `${teritoriBechPrefix}valconspub`,
    },
    // List of all coin/tokens used in this chain.
    currencies: [toriCurrency],
    // List of coin/tokens used as a fee token in this chain.
    feeCurrencies: [toriCurrency],
    // (Optional) The number of the coin type.
    // This field is only used to fetch the address from ENS.
    // Ideally, it is recommended to be the same with BIP44 path's coin type.
    // However, some early chains may choose to use the Cosmos Hub BIP44 path of '118'.
    // So, this is separated to support such chains.
    coinType: 118,
    // (Optional) This is used to set the fee of the transaction.
    // If this field is not provided, Keplr extension will set the default gas price as (low: 0.01, average: 0.025, high: 0.04).
    // Currently, Keplr doesn't support dynamic calculation of the gas prices based on on-chain data.
    // Make sure that the gas prices are higher than the minimum gas prices accepted by chain validators and RPC/REST endpoint.
    gasPriceStep: {
      low: 0.01,
      average: 0.025,
      high: 0.04,
    },
    features: [
      "stargate",
      "ibc-transfer",
      "cosmwasm",
      "no-legacy-stdTx",
      "ibc-go",
    ],
  });
