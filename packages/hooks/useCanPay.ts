import Long from "long";

import { useBalances } from "./useBalances";
import { Coin } from "../api/teritori-chain/cosmos/base/v1beta1/coin";
import { parseUserId } from "../networks";

interface CanPayForPostParams {
  userId?: string;
  cost?: Coin;
}

export const useCanPay = ({ userId, cost }: CanPayForPostParams) => {
  const [network, userAddress] = parseUserId(userId);
  const balances = useBalances(network?.id, userAddress);
  const costBalance = balances.find((bal) => bal.denom === cost?.denom);
  const canPay =
    cost &&
    userId &&
    !!costBalance?.amount &&
    Long.fromString(costBalance.amount).gt(0) &&
    Long.fromString(costBalance.amount).gte(cost?.amount || "0");

  return canPay;
};
