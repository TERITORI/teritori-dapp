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
import { PoolAsset, PriceHash, Trade } from "@cosmology/core/src/types";
import { useQuery } from "@tanstack/react-query";
import Long from "long";
import { osmosis, getSigningOsmosisClient } from "osmojs";
import { QuerySpotPriceRequest } from "osmojs/src/codegen/osmosis/gamm/v1beta1/query";
import { Coin } from "osmojs/types/codegen/cosmos/base/v1beta1/coin";
import {
  MsgSwapExactAmountIn,
  SwapAmountInRoute,
} from "osmojs/types/codegen/osmosis/gamm/v1beta1/tx";
import { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";

import {
  CurrencyInfo,
  getNativeCurrency,
  getNetwork,
} from "../../networks";
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
  const [directPool, setDirectPool] = useState<LcdPool>();
  // Only 2 pools handled for now
  const [multihopPools, setMultihopPools] = useState<LcdPool[]>([]);

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

  // ===== Cleaning
  useEffect(() => {
    setMultihopPools([]);
    setDirectPool(undefined);
  }, [currencyIn?.denom, currencyOut?.denom]);

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

  useEffect(() => {
    if (!currencyIn?.denom || !currencyOut?.denom || !cleanedLcdPools) return;

    const poolsIn: LcdPool[] = [];
    const poolsOut: LcdPool[] = [];
    let bestDirectPool: LcdPool | undefined;
    let cheapestFeePoolIn: LcdPool | undefined;
    let cheapestFeePoolOut: LcdPool | undefined;

    // ===== Finding the best pool that includes out two currencies.
    // And many pools to be the IN or the OUT of the multihop
    cleanedLcdPools.forEach((lcdPool) => {
      //TODO: Only pools with 2 assets ?
      if (lcdPool.poolAssets && lcdPool.poolAssets.length === 2) {
        lcdPool.poolAssets.forEach((asset: PoolAsset) => {
          // We find pools that includes the two currencies to be used for multihop
          if (asset.token.denom === currencyIn.denom) {
            poolsIn.push(lcdPool);
          }
          if (asset.token.denom === currencyOut.denom) {
            poolsOut.push(lcdPool);
          }
        });
        const prettyPool = lcdPoolPretty(lcdPool);

        // We stock the pool that includes the two currencies and has the higher liquidity
        if (
          ((lcdPool.poolAssets[0].token.denom === currencyIn.denom &&
            lcdPool.poolAssets[1].token.denom === currencyOut.denom) ||
            (lcdPool.poolAssets[1].token.denom === currencyIn.denom &&
              lcdPool.poolAssets[0].token.denom === currencyOut.denom)) &&
          (!bestDirectPool ||
            parseFloat(prettyPool.liquidity || "0") >
              parseFloat(lcdPoolPretty(bestDirectPool).liquidity || "0"))
        ) {
          bestDirectPool = lcdPool;
        }
        // else => No pool that includes the two currencies found => Multihop will be used
      }
    });
    if (bestDirectPool) {
      setDirectPool(bestDirectPool);
      setMultihopPools([]); // Lock the usage of multihopPools by emptying it
      return;
    }

    // ===== Finding the cheapest pools to make a multihop swap
    // ===> Only if no directPool found, for now! TODO: Allow to use multihop if it directPool found but it's less profitable
    poolsIn.forEach((lcdPoolIn) => {
      poolsOut.forEach((lcdPoolOut) => {
        // TODO: Ugly! Fix that (+fee+liquidity tests are weirds)
        if (
          ((lcdPoolIn.poolAssets[0].token.denom !== currencyIn.denom &&
            lcdPoolIn.poolAssets[0].token.denom !== currencyOut.denom &&
            lcdPoolOut.poolAssets[0].token.denom !== currencyIn.denom &&
            lcdPoolOut.poolAssets[0].token.denom !== currencyOut.denom &&
            lcdPoolIn.poolAssets[0].token.denom ===
              lcdPoolOut.poolAssets[0].token.denom) ||
            (lcdPoolIn.poolAssets[1].token.denom !== currencyIn.denom &&
              lcdPoolIn.poolAssets[1].token.denom !== currencyOut.denom &&
              lcdPoolOut.poolAssets[1].token.denom !== currencyIn.denom &&
              lcdPoolOut.poolAssets[1].token.denom !== currencyOut.denom &&
              lcdPoolIn.poolAssets[1].token.denom ===
                lcdPoolOut.poolAssets[1].token.denom) ||
            (lcdPoolIn.poolAssets[0].token.denom !== currencyIn.denom &&
              lcdPoolIn.poolAssets[0].token.denom !== currencyOut.denom &&
              lcdPoolOut.poolAssets[1].token.denom !== currencyIn.denom &&
              lcdPoolOut.poolAssets[1].token.denom !== currencyOut.denom &&
              lcdPoolIn.poolAssets[0].token.denom ===
                lcdPoolOut.poolAssets[1].token.denom) ||
            (lcdPoolIn.poolAssets[1].token.denom !== currencyIn.denom &&
              lcdPoolIn.poolAssets[1].token.denom !== currencyOut.denom &&
              lcdPoolOut.poolAssets[0].token.denom !== currencyIn.denom &&
              lcdPoolOut.poolAssets[0].token.denom !== currencyOut.denom &&
              lcdPoolIn.poolAssets[1].token.denom ===
                lcdPoolOut.poolAssets[0].token.denom)) &&
          parseFloat(lcdPoolIn.poolParams.swapFee) <
            parseFloat(cheapestFeePoolIn?.poolParams.swapFee || "9999999999") &&
          parseFloat(lcdPoolOut.poolParams.swapFee) <
            parseFloat(
              cheapestFeePoolOut?.poolParams.swapFee || "9999999999"
            ) &&
          parseFloat(lcdPoolPretty(lcdPoolIn).liquidity) > 10000000000 &&
          parseFloat(lcdPoolPretty(lcdPoolOut).liquidity) > 10000000000
        ) {
          cheapestFeePoolIn = lcdPoolIn;
          cheapestFeePoolOut = lcdPoolOut;
        }
      });
    });

    if (!cheapestFeePoolIn || !cheapestFeePoolOut) return;
    console.log("==================== BEST MULTI POOLS", [
      cheapestFeePoolIn,
      cheapestFeePoolOut,
    ]);
    setMultihopPools([cheapestFeePoolIn, cheapestFeePoolOut]);
  }, [currencyIn?.denom, currencyOut?.denom, cleanedLcdPools]);

  // ===== Getting the cheapest fee between directPool and multihopPools
  const fee = useMemo(() => {
    if (!multihopPools.length && !directPool) return 0;
    if (!directPool?.poolParams.swapFee) {
      setDirectPool(undefined); // Lock the usage of diectPool by emptying it
      return (
        parseFloat(multihopPools[0].poolParams.swapFee) +
        parseFloat(multihopPools[1].poolParams.swapFee)
      );
    } else {
      setMultihopPools([]); // Lock the usage of multihopPools by emptying it
      return parseFloat(directPool.poolParams.swapFee);
    }
  }, [
    multihopPools[0]?.poolParams.swapFee,
    multihopPools[1]?.poolParams.swapFee,
    directPool?.poolParams.swapFee,
  ]);

  // ===== Getting the equivalent in tokenOut of 1 tokenIn
  const { data: spotPrice } = useQuery(
    [
      "spotPrice",
      currencyOut?.denom,
      currencyIn?.denom,
      multihopPools[0]?.id,
      multihopPools[1]?.id,
      directPool?.id,
    ],
    async () => {
      if (!currencyIn || !currencyOut || !selectedNetwork) return "0";
      const { createRPCQueryClient } = osmosis.ClientFactory;
      const clientRPC = await createRPCQueryClient({
        rpcEndpoint: selectedNetwork.rpcEndpoint,
      });

      // ===== Spot price of the multihopPools
      if (multihopPools.length) {
        let firstRequestSpotPrice: QuerySpotPriceRequest | undefined;
        let lastRequestSpotPrice: QuerySpotPriceRequest | undefined;
        multihopPools.forEach((lcdPool) => {
          lcdPool.poolAssets.forEach((asset) => {
            if (asset.token.denom === currencyIn.denom) {
              firstRequestSpotPrice = {
                poolId: Long.fromString(lcdPool.id),
                quoteAssetDenom: currencyIn.denom,
                baseAssetDenom:
                  lcdPool.poolAssets.find(
                    (asset) => asset.token.denom !== currencyIn.denom
                  )?.token.denom || "",
              };
            }
            if (asset.token.denom === currencyOut.denom) {
              lastRequestSpotPrice = {
                poolId: Long.fromString(lcdPool.id),
                quoteAssetDenom:
                  lcdPool.poolAssets.find(
                    (asset) => asset.token.denom !== currencyOut.denom
                  )?.token.denom || "",
                baseAssetDenom: currencyOut.denom,
              };
            }
          });
        });
        if (!firstRequestSpotPrice || !lastRequestSpotPrice) return "0";
        const firstResponseSpotPrice =
          await clientRPC.osmosis.gamm.v1beta1.spotPrice(firstRequestSpotPrice);
        const lastResponseSpotPrice =
          await clientRPC.osmosis.gamm.v1beta1.spotPrice(lastRequestSpotPrice);
        return (
          parseFloat(firstResponseSpotPrice.spotPrice) *
          parseFloat(lastResponseSpotPrice.spotPrice)
        ).toString();
      }
      // ===== Spot price of the directPool
      if (directPool) {
        const requestSpotPrice = {
          poolId: Long.fromString(directPool.id),
          baseAssetDenom: currencyOut.denom,
          quoteAssetDenom: currencyIn.denom,
        };
        const responseSpotPrice =
          await clientRPC.osmosis.gamm.v1beta1.spotPrice(requestSpotPrice);
        return responseSpotPrice.spotPrice;
      }
      return "0";
    }
  );

  const swap = async (amountIn: number, amountOut: number) => {
    if (!currencyIn || !currencyOut || !selectedWallet || !selectedNetwork)
      return;

    console.log("1111111111111111111111111111");

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

    const prettyPools = cleanedLcdPools.map((pool) => lcdPoolPretty(pool));

    console.log("22222222222222222222222222", prettyPools);

    // TODO: Cannot read properties of undefined (reading 'display') getOsmoAssetByDenom returns undefined WTFFF ?
    const pairs = makePoolPairs(prettyPools, 0);

    console.log("33333333333333333333333333333", pairs);

    try {
      // ===== Getting Osmosis client for RPC use
      const signer = await getKeplrOfflineSigner(selectedNetwork);
      const client = await getSigningOsmosisClient({
        rpcEndpoint: selectedNetwork.rpcEndpoint || "",
        signer,
      });

      console.log("444444444444444444444444444444444");

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

      console.log("5555555555555555555555555555", routes);

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

      console.log("666666666666666666666666666", msg);

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

// const addedPercents = (percents: number[]) => {
//   if (!percents.length) return 0;
//   let addedP = 0;
//   for (let i = 0; i < percents.length; i++) {
//     addedP = addedP + percents[i] / 100;
//   }
//   return (addedP * 100) / percents.length;
// };

// ===== Pools format used for MsgSwapExactAmountIn, and used to find the highest liquidity
const lcdPoolPretty = (lcdPool: LcdPool) => {
  const prices: PriceHash = [];
  lcdPool.poolAssets.forEach((asset) => {
    prices[asset.token.denom] = parseFloat(asset.token.amount);
  });
  return makeLcdPoolPretty(prices, lcdPool);
};
