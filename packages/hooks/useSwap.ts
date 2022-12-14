import {
  calculateAmountWithSlippage,
  CoinValue,
  lookupRoutesForTrade,
  makeLcdPoolPretty,
  makePoolPairs,
  OsmosisApiClient,
  SwapAmountInRoute,
} from "@cosmology/core";
import { PrettyPool, PriceHash, Trade } from "@cosmology/core/src/types";
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { useSelector } from "react-redux";

import { CurrencyInfo, getNativeCurrency, getNetwork } from "../networks";
import { selectSelectedNetworkId } from "../store/slices/settings";

export const useSwap = (
  tokenInAmount: string,
  tokenOutAmount: string,
  tokenIn?: CurrencyInfo,
  tokenOut?: CurrencyInfo
) => {
  const selectedNetworkId = useSelector(selectSelectedNetworkId);
  const selectedNetwork = getNetwork(selectedNetworkId);

  // ===== Getting correct amounts and prices array
  const prices: PriceHash = [];

  //TODO: Function for that
  const tokenInTrueAmount = useMemo(() => {
    let multiplier = 10;
    for (
      let i = 0;
      i < (getNativeCurrency(selectedNetworkId, tokenIn?.denom)?.decimals || 0);
      i++
    ) {
      multiplier = multiplier * 10;
    }
    return parseFloat(tokenInAmount) * multiplier;
  }, [tokenInAmount]);
  const tokenOutTrueAmount = useMemo(() => {
    let multiplier = 10;
    for (
      let i = 0;
      i <
      (getNativeCurrency(selectedNetworkId, tokenOut?.denom)?.decimals || 0);
      i++
    ) {
      multiplier = multiplier * 10;
    }
    return parseFloat(tokenOutAmount) * multiplier;
  }, [tokenOutAmount]);

  prices[tokenIn?.denom] = tokenInTrueAmount;
  prices[tokenOut?.denom] = tokenOutTrueAmount;

  // ===== Creating Osmosis client for API use
  const api = new OsmosisApiClient({
    url: selectedNetwork?.restEndpoint,
  });

  // ==== Getting pools
  const { data: lcdPools } = useQuery(
    ["pools"],
    async () => await api.getPools(),
    { refetchInterval: 5000 }
  );

  const prettyPools = useMemo(() => {
    // ===== Cleaning Lcd Pools
    const pools: PrettyPool[] = [];
    lcdPools?.pools.forEach((pool, index) => {
      // FIXME: We get LcdPool with properties with underscore WTF ==> Prevent errors in makeLcdPoolPretty
      if (pool.pool_assets) pool.poolAssets = pool.pool_assets;
      if (pool.total_weight) pool.totalWeight = pool.total_weight;

      //TODO: Get "/osmosis.gamm.v1beta1.Pool" from libs
      if (pool["@type"] !== "/osmosis.gamm.v1beta1.Pool") return;

      pools.push(makeLcdPoolPretty(prices, pool));
    });

    return pools;
  }, [lcdPools?.pools, prices]);

  console.log("======================== prettyPools", prettyPools);

  // ===== Making a trade
  const trade: Trade = useMemo(() => {
    return {
      sell: {
        denom: tokenIn?.denom,
        amount: tokenInTrueAmount.toString(),
      } as CoinValue,
      buy: {
        denom: tokenOut?.denom,

        //TODO: Which value ?
        amount: tokenOutTrueAmount.toString(),
      } as CoinValue,

      //TODO: Which value ?
      beliefValue: "0",
    };
  }, [tokenIn?.denom, tokenOut?.denom, tokenInTrueAmount, tokenOutTrueAmount]);

  // ==== Getting trading routes
  const routes = useMemo(() => {
    // if(!prettyPools) return
    const pairs = makePoolPairs(prettyPools || [], 0);

    try {
      return lookupRoutesForTrade({
        trade,
        pairs,
      }).map((tradeRoute) => {
        const { poolId, tokenOutDenom } = tradeRoute;
        const swapAmountInRoute: SwapAmountInRoute = {
          poolId,
          tokenOutDenom,
        };

        return swapAmountInRoute;
      });
    } catch (e) {
      //TODO: Handle this : No trade route

      console.error(e);
    }
  }, [prettyPools, trade]);

  console.log("============= routesroutesroutesroutesroutesroutes", routes);

  //TODO: No route = No enough tokenIn/Out for swap ==> Need deposit

  const tokenOutMinAmount = calculateAmountWithSlippage(
    tokenOutAmount,
    //TODO: Good value ?
    0.01
  );

  // ==== We need a TradeRoute to swap

  //TODO: Fees ?

  // ==== Make a trade between two currencies
  // const msg = messages.swapExactAmountIn({
  //   sender: selectedWallet.address, // osmo address
  //   routes, // TradeRoute
  //   tokenIn: coin(tokenInAmount, tokenIn.denom), // Coin
  //   tokenOutMinAmount // number as a string with no decimals
  // });

  return false;
};
