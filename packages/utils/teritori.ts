import { Decimal } from "@cosmjs/math";
import { OfflineSigner } from "@cosmjs/proto-signing";
import { GasPrice, SigningStargateClient } from "@cosmjs/stargate";
import { Currency } from "@keplr-wallet/types";

import { Metadata } from "../contracts-clients/teritori-name-service/TeritoriNameService.types";
import {NetworkInfo} from "../networks";

export const UTORI_PER_TORI = process.env.PUBLIC_BASE_MINT_FEE;
export const teritoriRestProvider = process.env.PUBLIC_CHAIN_REST_ENDPOINT;
export const teritoriRPCProvider = process.env.PUBLIC_CHAIN_RPC_ENDPOINT;
export const teritoriChainId = process.env.PUBLIC_CHAIN_ID;
export const toriDisplayDenom = process.env.PUBLIC_STAKING_DENOM_DISPLAY_NAME;
export const vaultContractAddress =
  process.env.TERITORI_VAULT_CONTRACT_ADDRESS || "";
const toriDenom = process.env.PUBLIC_STAKING_DENOM;

export interface CosmosRewardsResponse {
  total: {
    denom: string;
    amount: string;
  }[];
  rewards: {
    validator_address: string;
    reward: {
      denom: string;
      amount: string;
    }[];
  }[];
}

export interface CosmosBalancesResponse {
  balances: { denom: string; amount: string }[];
}

export const getCosmosBalances = async (address: string, network?: NetworkInfo) => {
  const response = await fetch(
    `${network?.restEndpoint || teritoriRestProvider}/cosmos/bank/v1beta1/balances/${address}`
  );
  const responseJSON: CosmosBalancesResponse = await response.json();
  return responseJSON;
};

export const teritoriNFTVaultCodeID = 10;

export const getUtoriBalance = async (address: string, network?: NetworkInfo) => {
  const cosmosBalances = await getCosmosBalances(address, network);
  return cosmosBalances.balances
    .filter((balance) => balance.denom === toriDenom)
    .reduce(
      (total, balance) =>
        total.plus(
          Decimal.fromAtomics(balance.amount, toriCurrency.coinDecimals)
        ),
      Decimal.fromAtomics("0", toriCurrency.coinDecimals)
    );
};

export const toriCurrency: Currency = {
  // Coin denomination to be displayed to the user.
  coinDenom: toriDisplayDenom || "",
  // Actual denom (i.e. uatom, uscrt) used by the blockchain.
  coinMinimalDenom: toriDenom || "",
  // # of decimal points to convert minimal denomination to user-facing denomination.
  coinDecimals: 6,
  // (Optional) Keplr can show the fiat value of the coin if a coingecko id is provided.
  // You can get id from https://api.coingecko.com/api/v3/coins/list if it is listed.
  // coinGeckoId: ""
};

export const teritoriGasPrice = new GasPrice(
  Decimal.fromUserInput("0.025", toriCurrency.coinDecimals),
  toriCurrency.coinMinimalDenom
);

export const getSigningStargateClient = (signer: OfflineSigner, network?: NetworkInfo) =>
  SigningStargateClient.connectWithSigner(network?.rpcEndpoint || teritoriRPCProvider || "", signer, {
    gasPrice: teritoriGasPrice,
  });

interface PrettyTokenData {
  displayLabel: string;
  value: string | null;
}

export const imageDisplayLabel = "Image URL";
export const publicNameDisplayLabel = "Public Name";

// From a token data, returns an array with these data ordered and containing a pretty label
// FIXME: type this properly
export const prettyTokenData = (tokenData: Metadata): PrettyTokenData[] => {
  const finalDatas: PrettyTokenData[] = [];
  Object.entries(tokenData).map(([key, value], i) => {
    switch (key) {
      case "email":
        finalDatas[0] = { displayLabel: "Email", value: value as string };
        break;
      case "public_name":
        finalDatas[1] = {
          displayLabel: publicNameDisplayLabel,
          value: value as string,
        };
        break;
      case "public_bio":
        finalDatas[2] = { displayLabel: "Bio", value: value as string };
        break;
      case "image":
        finalDatas[3] = {
          displayLabel: imageDisplayLabel,
          value: value as string,
        };
        break;
      case "external_url":
        finalDatas[4] = {
          displayLabel: "External URL",
          value: value as string,
        };
        break;
      case "discord_id":
        finalDatas[5] = {
          displayLabel: "Discord",
          value: value as string,
        };
        break;
      case "twitter_id":
        finalDatas[6] = { displayLabel: "Twitter", value: value as string };
        break;
      case "telegram_id":
        finalDatas[7] = {
          displayLabel: "Telegram username",
          value: value as string,
        };
        break;
      case "keybase_id":
        finalDatas[8] = { displayLabel: "Keybase", value: value as string };
        break;
      case "validator_operator_address":
        finalDatas[9] = { displayLabel: "Validator", value: value as string };
        break;
    }
  });
  return finalDatas;
};

// You can add, remove or modify the domains and their status (See DomainsAvailability in TNSHomeScreen.tsx)
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

export const txExplorerLink = (txHash: string) => {
  return (process.env.TERITORI_TRANSACTION_EXPLORER_URL || "").replace(
    "$hash",
    txHash
  );
};

export const accountExplorerLink = (address: string) => {
  return (process.env.TERITORI_ACCOUNT_EXPLORER_URL || "").replace(
    "$address",
    address
  );
};
