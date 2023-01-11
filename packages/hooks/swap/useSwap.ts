import { coins, isDeliverTxFailure, StdFee } from "@cosmjs/stargate";
import {
  calculateAmountWithSlippage,
  CoinValue,
  LcdPool,
  lookupRoutesForTrade,
  makeLcdPoolPretty,
  makePoolPairs,
  OsmosisApiClient,
} from "@cosmology/core";
import {
  PoolAsset,
  PrettyPool,
  PriceHash,
  Trade,
} from "@cosmology/core/src/types";
import { useQuery } from "@tanstack/react-query";
import Long from "long";
import { osmosis, getSigningOsmosisClient } from "osmojs";
import { Coin } from "osmojs/types/codegen/cosmos/base/v1beta1/coin";
import {
  MsgSwapExactAmountIn,
  SwapAmountInRoute,
} from "osmojs/types/codegen/osmosis/gamm/v1beta1/tx";
import { useEffect, useMemo } from "react";
import { useSelector } from "react-redux";

import { CurrencyInfo, getNativeCurrency, getNetwork } from "../../networks";
import { selectSelectedNetworkId } from "../../store/slices/settings";
import { getKeplrOfflineSigner } from "../../utils/keplr";
import useSelectedWallet from "../useSelectedWallet";

export type SwapResult = {
  title: string;
  message: string;
  isError?: boolean;
};

export const useSwap = (
  slippage: number,
  currencyIn?: CurrencyInfo,
  currencyOut?: CurrencyInfo
) => {
  const selectedWallet = useSelectedWallet();
  const selectedNetworkId = useSelector(selectSelectedNetworkId);
  const selectedNetwork = getNetwork(selectedNetworkId);

  // ===== Creating Osmosis client for API use
  const api = new OsmosisApiClient({
    url: selectedNetwork?.restEndpoint,
  });

  const { data: lcdPools } = useQuery(["lcdPools"], async () => {
    return await api.getPools();
  });

  useEffect(() => {
    if (!lcdPools) {
      // TODO: ? SERVICE UNAVAILABLE
    }
  }, [lcdPools]);

  // ===== Pools format used to find FEE
  const cleanedLcdPools = useMemo(() => {
    const pools: LcdPool[] = [];
    lcdPools?.pools.forEach((pool) => {
      // FIXME: We get LcdPool with properties with underscore WTF donnow sorry ==> Prevent errors in makeLcdPoolPretty
      if (pool.pool_assets) pool.poolAssets = pool.pool_assets;
      if (pool.total_weight) pool.totalWeight = pool.total_weight;
      if (pool.pool_params) pool.poolParams = pool.pool_params;
      if (pool.pool_params.swap_fee)
        pool.poolParams.swapFee = pool.pool_params.swap_fee;
      //TODO: Get "/osmosis.gamm.v1beta1.Pool" from libs
      if (pool["@type"] !== "/osmosis.gamm.v1beta1.Pool") return;

      pools.push(pool);
    });
    return pools;
  }, [lcdPools?.pools]);

  // ===== Pools format used for MsgSwapExactAmountIn, and used to find the highest liquidity (See usedPool)
  const prettyPools = useMemo(() => {
    const pools: PrettyPool[] = [];
    cleanedLcdPools.forEach((pool) => {
      const prices: PriceHash = [];
      pool.poolAssets.forEach((asset) => {
        prices[asset.token.denom] = parseFloat(asset.token.amount);
      });
      pools.push(makeLcdPoolPretty(prices, pool));
    });
    return pools;
  }, [cleanedLcdPools]);

  // TODO: Certainly too simple, no intermediate, polish that!
  // TODO: ==========> Handle multihop : No pool for ATOM/TORI, so we want : ATOM/OSMO -> OSMO/TORI
  // ===== Finding the pool to use (The one that includes the two currencies and has the higher liquidity)
  const usedPool: LcdPool = useMemo(() => {
    if (!currencyIn?.denom || !currencyOut?.denom || !cleanedLcdPools)
      return cleanedLcdPools[0];

    let highestLiquidity = "0";
    let result: LcdPool = cleanedLcdPools[0];

    cleanedLcdPools.forEach((lcdPool) => {
      let baseAssetDenom;
      let quoteAssetDenom;

      if (lcdPool.poolAssets && lcdPool.poolAssets.length === 2) {
        lcdPool.poolAssets.forEach((asset: PoolAsset) => {
          if (asset.token.denom === currencyIn.denom) baseAssetDenom = asset;
          if (asset.token.denom === currencyOut.denom) quoteAssetDenom = asset;
        });

        // We want the pool with the highest liquidity
        const liquidity =
          prettyPools.find((prettyPool) => prettyPool.id === lcdPool.id)
            ?.liquidity || "";

        if (
          baseAssetDenom &&
          quoteAssetDenom &&
          parseFloat(liquidity) > parseFloat(highestLiquidity)
        ) {
          highestLiquidity = liquidity;
          result = lcdPool;
        }
      }
    });
    return result;
  }, [currencyIn?.denom, currencyOut?.denom, cleanedLcdPools]);

  // ===== Getting the fee of the used pool
  const fee = useMemo(() => {
    if (!usedPool?.poolParams?.swapFee) return 0;
    return parseFloat(usedPool.poolParams.swapFee);
  }, [usedPool?.poolParams?.swapFee]);

  // ===== Getting the spot price of the used pool, for the two currencies
  const { data: spotPrice } = useQuery(
    [
      "spotPrice",
      selectedNetwork?.rpcEndpoint,
      currencyOut?.denom,
      currencyIn?.denom,
      usedPool?.id,
    ],
    async () => {
      console.log("((((((((((((( usedPool", usedPool);

      if (!currencyIn || !currencyOut || !selectedNetwork || !usedPool?.id)
        return "0";

      const { createRPCQueryClient } = osmosis.ClientFactory;
      // console.log("222222222222222222222222");

      const clientRPC = await createRPCQueryClient({
        rpcEndpoint: selectedNetwork.rpcEndpoint,
      });
      // const REQ: QuerySpotPriceRequest = {
      const requestSpotPrice = {
        // poolId: Long.fromString(poolId),
        poolId: Long.fromString(usedPool.id),
        baseAssetDenom: currencyOut.denom,
        quoteAssetDenom: currencyIn.denom,
      };
      // console.log("3333333333333333333333", requestSpotPrice);

      const responseSpotPrice = await clientRPC.osmosis.gamm.v1beta1.spotPrice(
        requestSpotPrice
      );
      // console.log("444444444444444444444444", requestSpotPrice);

      return responseSpotPrice.spotPrice;
    }
  );

  const swap = async (amountIn: number, amountOut: number) => {
    if (!currencyIn || !currencyOut || !selectedWallet || !selectedNetwork)
      return;
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

    const { swapExactAmountIn } =
      osmosis.gamm.v1beta1.MessageComposer.withTypeUrl;
    // ===== Making a trade
    const trade: Trade = {
      sell: {
        denom: currencyIn.denom,
        amount: amountInMicro,
      } as CoinValue,
      buy: {
        denom: currencyOut.denom,
        amount: amountOutMicro,
      } as CoinValue,
      //TODO: Which value ?
      beliefValue: "1",
    };

    const pairs = makePoolPairs(prettyPools || [], 0);
    try {
      // ===== Getting Osmosis client for RPC use
      const signer = await getKeplrOfflineSigner(selectedNetwork);
      const client = await getSigningOsmosisClient({
        rpcEndpoint: selectedNetwork.rpcEndpoint || "",
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
      // ==== Handling splippage
      const amountOutMicroWithSlippage = Math.round(
        parseFloat(calculateAmountWithSlippage(amountOutMicro, slippage))
      ).toString();

      // ==== Make a trade between two currencies
      const msgValue: MsgSwapExactAmountIn = {
        sender: selectedWallet.address || "",
        routes,
        tokenIn: { denom: currencyIn.denom, amount: amountInMicro } as Coin,
        tokenOutMinAmount: amountOutMicroWithSlippage,
      };
      const msg = swapExactAmountIn(msgValue);

      // console.log('feefeefeefee', fee)
      console.log("msgmsgmsgmsgmsgmsgmsg", msg);
      console.log("fee * 1000000fee * 1000000", fee * 1000000);

      // We use the fee found in the usedPool
      const stdFee: StdFee = {
        amount: coins(fee * 1000000, currencyIn.denom),
        gas: "250000",
      };

      const txResponse = await client.signAndBroadcast(
        selectedWallet.address || "",
        [msg],
        stdFee
      );
      if (isDeliverTxFailure(txResponse)) {
        console.error("tx failed", txResponse);
        let message = txResponse.rawLog || "";
        console.log("txResponse.codetxResponse.code", txResponse.code);

        if (txResponse.code === 7)
          message =
            "The prices have changed, you need to set a higher slippage tolerance";

        return {
          isError: true,
          title: "Transaction failed",
          message,
        } as SwapResult;
      }
      return {
        title: "Swap succeed",
        message: "",
      } as SwapResult;
    } catch (e) {
      console.error(e);
      return {
        isError: true,
        title: "Transaction failed",
        message: e,
      } as SwapResult;
    }
  };
  return { swap, spotPrice, fee };
};

export const amountToCurrencyMicro = (
  amount: number,
  networkId: string,
  denom: string
) => {
  let multiplier = 1;
  for (
    let i = 0;
    i < (getNativeCurrency(networkId, denom)?.decimals || 0);
    i++
  ) {
    multiplier = multiplier * 10;
  }
  return Math.round(amount * multiplier).toString();
};
