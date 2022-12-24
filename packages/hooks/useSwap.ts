import { isDeliverTxFailure } from "@cosmjs/stargate";
import {
  calculateAmountWithSlippage,
  CoinValue,
  lookupRoutesForTrade,
  makeLcdPoolPretty,
  makePoolPairs,
  OsmosisApiClient,
} from "@cosmology/core";
import { PrettyPool, PriceHash, Trade } from "@cosmology/core/src/types";
import { useQuery } from "@tanstack/react-query";
import Long from "long";
import { FEES, osmosis, getSigningOsmosisClient } from "osmojs";
import { Coin } from "osmojs/types/codegen/cosmos/base/v1beta1/coin";
import {
  MsgSwapExactAmountIn,
  SwapAmountInRoute,
} from "osmojs/types/codegen/osmosis/gamm/v1beta1/tx";
import { useSelector } from "react-redux";

import { useFeedbacks } from "../context/FeedbacksProvider";
import { CurrencyInfo, getNativeCurrency, getNetwork } from "../networks";
import { selectSelectedNetworkId } from "../store/slices/settings";
import { getKeplrOfflineSigner } from "../utils/keplr";
import useSelectedWallet from "./useSelectedWallet";

type HookParams = {
  amountIn: number;
  amountOut: number;
  currencyIn?: CurrencyInfo;
  currencyOut?: CurrencyInfo;
  callback?: () => void;
};

export const useSwap = (params: HookParams) => {
  const { amountIn, amountOut, currencyIn, currencyOut, callback } = params;
  const selectedWallet = useSelectedWallet();
  const selectedNetworkId = useSelector(selectSelectedNetworkId);
  const selectedNetwork = getNetwork(selectedNetworkId);
  const { setToastError, setToastSuccess } = useFeedbacks();

  // ===== Creating Osmosis client for API use
  const api = new OsmosisApiClient({
    url: selectedNetwork?.restEndpoint,
  });

  // ==== Getting pools
  const { data: lcdPools } = useQuery(
    ["pools", selectedNetworkId],
    async () => await api.getPools(),
    { refetchInterval: 5000 }
  );

  const swap = async () => {
    if (!currencyIn || !currencyOut || !selectedNetwork || !selectedWallet)
      return;

    // ===== Getting GAMM stuff
    const { swapExactAmountIn } =
      osmosis.gamm.v1beta1.MessageComposer.withTypeUrl;

    // ===== Getting correct amounts and prices array
    const prices: PriceHash = [];

    const amountInMicro = amountToCurrencyMicro(
      amountIn,
      selectedNetworkId,
      currencyIn.denom
    );
    const amountOutMicro = amountToCurrencyMicro(
      amountOut,
      selectedNetworkId,
      currencyOut.denom
    );

    prices[currencyIn.denom] = amountInMicro;
    prices[currencyOut.denom] = amountOutMicro;

    // ===== Cleaning Lcd Pools
    const prettyPools: PrettyPool[] = [];
    lcdPools?.pools.forEach((pool) => {
      // FIXME: We get LcdPool with properties with underscore WTF ==> Prevent errors in makeLcdPoolPretty
      if (pool.pool_assets) pool.poolAssets = pool.pool_assets;
      if (pool.total_weight) pool.totalWeight = pool.total_weight;

      //TODO: Get "/osmosis.gamm.v1beta1.Pool" from libs
      if (pool["@type"] !== "/osmosis.gamm.v1beta1.Pool") return;

      prettyPools.push(makeLcdPoolPretty(prices, pool));
    });

    // ===== Making a trade
    const trade: Trade = {
      sell: {
        denom: currencyIn?.denom,
        amount: amountInMicro,
      } as CoinValue,
      buy: {
        denom: currencyOut?.denom,
        amount: amountOutMicro,
      } as CoinValue,
      //TODO: Which value ?
      beliefValue: "0",
    };

    const pairs = makePoolPairs(prettyPools || [], 0);

    try {
      // ===== Getting Osmosis client for RPC use
      const signer = await getKeplrOfflineSigner(selectedNetwork);
      const client = await getSigningOsmosisClient({
        rpcEndpoint: selectedNetwork.rpcEndpoint,
        signer,
      });

      // ==== Getting trading routes
      const routes = lookupRoutesForTrade({
        trade,
        pairs,
      }).map((tradeRoute) => {
        const { poolId, tokenOutDenom } = tradeRoute;
        const swapAmountInRoute: SwapAmountInRoute = {
          poolId: Long.fromString(poolId),
          tokenOutDenom,
        };
        return swapAmountInRoute;
      });

      const currencyOutMinAmount = Math.round(
        parseFloat(
          calculateAmountWithSlippage(
            amountOutMicro,
            //TODO: Good value ? (0.1% ?)
            1
          )
        )
      ).toString();

      // ==== Make a trade between two currencies
      const msgValue: MsgSwapExactAmountIn = {
        sender: selectedWallet.address,
        routes,
        tokenIn: { denom: currencyIn.denom, amount: amountInMicro } as Coin,
        tokenOutMinAmount: currencyOutMinAmount,
      };
      const msg = swapExactAmountIn(msgValue);

      //TODO: Fees ?
      const fee = FEES.osmosis.swapExactAmountIn("low"); // low, medium, high

      const txResponse = await client.signAndBroadcast(
        selectedWallet.address,
        [msg],
        fee
      );
      if (isDeliverTxFailure(txResponse)) {
        console.error("tx failed", txResponse);
        setToastError({
          title: "Transaction failed",
          message: txResponse.rawLog || "",
        });
        return;
      }
      setToastSuccess({ title: "Swap success", message: "" });
      callback && callback();
    } catch (e) {
      console.error(e);
    }
  };
  return { swap };
};

export const amountToCurrencyMicro = (
  amount: number,
  networkId: string,
  denom: string
) => {
  let multiplier = 10;
  for (
    let i = 0;
    i < (getNativeCurrency(networkId, denom)?.decimals || 0);
    i++
  ) {
    multiplier = multiplier * 10;
  }
  return Math.round(amount * multiplier).toString();
};
