import { Metadata } from "../contracts-clients/teritori-name-service/TeritoriNameService.types";

export interface CosmosDelegationsResponse {
  delegation_responses: {
    delegation: {
      delegator_address: string;
      validator_address: string;
      shares: string;
    };
    balance: {
      denom: string;
      amount: string;
    };
  }[];
}

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

interface PrettyTokenData {
  displayLabel: string;
  value: string | null;
}

export const imageDisplayLabel = "Image URL";
const publicNameDisplayLabel = "Public Name";

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
