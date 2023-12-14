import { Coin } from "../../api/teritori-chain/cosmos/base/v1beta1/coin";
import { parseUserId } from "../../networks";
import { useBalances } from "../useBalances";

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
    parseInt(costBalance.amount, 10) > 0 &&
    parseInt(costBalance.amount, 10) >= parseInt(cost?.amount || "0", 10);

  return canPay;
};
