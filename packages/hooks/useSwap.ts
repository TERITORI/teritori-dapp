import { coins, isDeliverTxFailure, StdFee } from "@cosmjs/stargate";
import {
  calculateAmountWithSlippage,
  LcdPool,
  makeLcdPoolPretty,
  OsmosisApiClient,
} from "@cosmology/core";
// @ts-expect-error FIXME: Could not find a declaration file for module '@cosmology/core/src/assets'
import { assets as osmosisAssets } from "@cosmology/core/src/assets";
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

import {
  CurrencyInfo,
  getCosmosNetwork,
  getKeplrSigner,
  getNativeCurrency,
} from "../networks";
import { useSelectedNetworkId } from "./useSelectedNetwork";
import useSelectedWallet from "./useSelectedWallet";

interface PriceHash<T> {
  [key: string]: T;
}
interface PoolAsset {
  token: Coin;
  weight: string;
}

export type SwapResult = {
  title: string;
  message: string;
  isError?: boolean;
};

export const useSwap = (
  currencyIn?: CurrencyInfo,
  currencyOut?: CurrencyInfo
) => {
  const selectedWallet = useSelectedWallet();
  const selectedNetworkId = useSelectedNetworkId();
  const selectedNetwork = getCosmosNetwork(selectedNetworkId);
  const [isMultihop, setIsMultihop] = useState(false);
  const [directPool, setDirectPool] = useState<LcdPool>();
  // Only 2 pools handled for now
  const [multihopPools, setMultihopPools] = useState<LcdPool[]>([]);
  const [loading, setLoading] = useState(false);

  // ===== Creating Osmosis client for API use
  const api = new OsmosisApiClient({
    url: selectedNetwork?.restEndpoint,
  });

  const { data: lcdPools } = useQuery(["lcdPools"], async () => {
    setLoading(true);
    const pools = await api.getPools();
    setLoading(false);
    return pools;
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
      // @ts-expect-error FIXME: We get LcdPool with properties with underscore. Prevent errors in makeLcdPoolPretty
      if (pool.pool_assets) pool.poolAssets = pool.pool_assets;
      // @ts-expect-error
      if (pool.total_weight) pool.totalWeight = pool.total_weight;
      // @ts-expect-error
      if (pool.pool_params) pool.poolParams = pool.pool_params;
      // @ts-expect-error
      if (pool.pool_params.swap_fee)
        // @ts-expect-error
        pool.poolParams.swapFee = pool.pool_params.swap_fee;
      //TODO: Get "/osmosis.gamm.v1beta1.Pool" from libs
      if (pool["@type"] !== "/osmosis.gamm.v1beta1.Pool") return;
      //TODO: Only pools with 2 assets ?
      if (!pool.poolAssets || pool.poolAssets.length !== 2) return;

      // TODO: Don't want pools with unknown asset ?
      let firstAssetsExists = false;
      let lastAssetsExists = false;
      osmosisAssets.forEach((asset: any) => {
        if (asset.base === pool.poolAssets[0].token.denom) {
          firstAssetsExists = true;
        }
        if (asset.base === pool.poolAssets[1].token.denom) {
          lastAssetsExists = true;
        }
      });
      if (!firstAssetsExists || !lastAssetsExists) return;

      pools.push(pool);
    });
    return pools;
  }, [lcdPools?.pools]);

  // ===== Searching for pools to use (routes)
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
      //TODO: Better tests for that
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
    });
    if (bestDirectPool) {
      setDirectPool(bestDirectPool);
    }

    // ===== Finding the cheapest pools to make a multihop swap
    // ===> Only if no directPool found, for now! TODO: Allow to use multihop if it directPool found but it's less profitable
    poolsIn.forEach((lcdPoolIn) => {
      // We want enough OSMO in the pools
      if (
        parseFloat(
          lcdPoolIn.poolAssets.find((asset) => asset.token.denom === "uosmo")
            ?.token.amount || "1"
        ) /
          1000000 <
        1
      )
        return;
      // We want enough liquidity is the pools
      if (parseFloat(lcdPoolPretty(lcdPoolIn).liquidity) < 10000000000) return;

      poolsOut.forEach((lcdPoolOut) => {
        if (
          parseFloat(
            lcdPoolOut.poolAssets.find((asset) => asset.token.denom === "uosmo")
              ?.token.amount || "1"
          ) /
            1000000 <
          1
        )
          return;
        if (parseFloat(lcdPoolPretty(lcdPoolOut).liquidity) < 10000000000)
          return;

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
            parseFloat(cheapestFeePoolOut?.poolParams.swapFee || "9999999999")
        ) {
          cheapestFeePoolIn = lcdPoolIn;
          cheapestFeePoolOut = lcdPoolOut;
        }
      });
    });

    if (cheapestFeePoolIn && cheapestFeePoolOut) {
      setMultihopPools([cheapestFeePoolIn, cheapestFeePoolOut]);
    }
  }, [currencyIn?.denom, currencyOut?.denom, cleanedLcdPools]);

  // ===== Getting the cheapest way between directPool and multihopPools
  useEffect(() => {
    if (!multihopPools.length && !directPool) return;
    // Choose the cheapest way if multihop and direct route available
    if (multihopPools.length && directPool) {
      const multiHopFee =
        parseFloat(multihopPools[0].poolParams.swapFee) +
        parseFloat(multihopPools[1].poolParams.swapFee);
      const directPoolFee = parseFloat(directPool.poolParams.swapFee);
      if (multiHopFee > directPoolFee) {
        setIsMultihop(false);
      } else {
        setIsMultihop(true);
      }
    }
    if (multihopPools.length && !directPool) {
      setIsMultihop(true);
    }
    if (!multihopPools.length && directPool) {
      setIsMultihop(false);
    }
  }, [multihopPools, directPool]);

  // ===== Getting fee
  const fee = useMemo(() => {
    if (!multihopPools.length && !directPool) return 0;
    if (isMultihop)
      return (
        parseFloat(multihopPools[0].poolParams.swapFee) +
        parseFloat(multihopPools[1].poolParams.swapFee)
      );
    else return parseFloat(directPool?.poolParams.swapFee || "0");
  }, [multihopPools, directPool, isMultihop]);

  // ===== Getting the equivalent in tokenOut of 1 tokenIn
  const { data: spotPrice } = useQuery(
    [
      "spotPrice",
      currencyOut?.denom,
      currencyIn?.denom,
      isMultihop,
      multihopPools[0]?.id,
      multihopPools[1]?.id,
      directPool?.id,
      selectedNetwork?.id,
    ],
    async () => {
      if (
        !currencyIn ||
        !currencyOut ||
        !selectedNetwork ||
        ((!multihopPools[0] || !multihopPools[1]) && !directPool)
      )
        return "0";

      setLoading(true);

      const { createRPCQueryClient } = osmosis.ClientFactory;
      const clientRPC = await createRPCQueryClient({
        rpcEndpoint: selectedNetwork.rpcEndpoint,
      });

      // ===== Spot price of the multihopPools
      if (isMultihop) {
        // We need 2 spot prices corresponding te the 2 pools used for multihop
        let firstRequestSpotPrice: QuerySpotPriceRequest | undefined;
        let lastRequestSpotPrice: QuerySpotPriceRequest | undefined;
        multihopPools.forEach((lcdPool) => {
          lcdPool.poolAssets.forEach((asset) => {
            if (asset.token.denom === currencyIn.denom) {
              firstRequestSpotPrice = {
                poolId: Long.fromString(lcdPool.id),
                // quote asset is the currencyIn
                quoteAssetDenom: currencyIn.denom,
                // base asset is the no currencyIn (Certainly OSMO)
                baseAssetDenom:
                  lcdPool.poolAssets.find(
                    (asset) => asset.token.denom !== currencyIn.denom
                  )?.token.denom || "",
              };
            }
            if (asset.token.denom === currencyOut.denom) {
              lastRequestSpotPrice = {
                poolId: Long.fromString(lcdPool.id),
                // quote asset is the no currencyIn (Certainly OSMO)
                quoteAssetDenom:
                  lcdPool.poolAssets.find(
                    (asset) => asset.token.denom !== currencyOut.denom
                  )?.token.denom || "",
                // base asset is the currencyIn
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

        setLoading(false);

        return (
          parseFloat(firstResponseSpotPrice.spotPrice) *
          parseFloat(lastResponseSpotPrice.spotPrice)
        ).toString();
      }
      // ===== Spot price of the directPool
      else if (directPool) {
        const requestSpotPrice = {
          poolId: Long.fromString(directPool.id),
          baseAssetDenom: currencyOut.denom,
          quoteAssetDenom: currencyIn.denom,
        };
        const responseSpotPrice =
          await clientRPC.osmosis.gamm.v1beta1.spotPrice(requestSpotPrice);

        setLoading(false);

        return responseSpotPrice.spotPrice;
      }

      setLoading(false);
      return "0";
    }
  );

  const swap = async (
    amountIn: number,
    amountOut: number,
    slippage: number
  ) => {
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

    try {
      // ===== Getting Osmosis client for RPC use
      const signer = await getKeplrSigner(selectedNetwork.id);
      const client = await getSigningOsmosisClient({
        rpcEndpoint: selectedNetwork.rpcEndpoint || "",
        signer,
      });
      const routes: SwapAmountInRoute[] = [];
      if (isMultihop) {
        if (multihopPools[0].poolAssets[0].token.denom)
          routes.push({
            poolId: Long.fromString(multihopPools[0].id),
            tokenOutDenom: "uosmo", // multihopPools must have osmo token as asset
          } as SwapAmountInRoute);

        routes.push({
          poolId: Long.fromString(multihopPools[1].id),
          tokenOutDenom: currencyOut.denom,
        } as SwapAmountInRoute);
      } else {
        //use directPool
        //only one route
        routes.push({
          poolId: Long.fromString(directPool?.id!),
          tokenOutDenom: currencyOut.denom,
        });
      }

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

      // We use the fee found in the usedPool
      const stdFee: StdFee = {
        amount: coins(Math.round(fee) * 1000000, currencyIn.denom),
        gas: "250000",
      };

      const txResponse = await client.signAndBroadcast(
        selectedWallet.address || "",
        [msg],
        stdFee
      );
      if (isDeliverTxFailure(txResponse)) {
        console.error("tx failed", txResponse);
        const message = txResponse.rawLog || "";
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
      console.error("tx failed", e);
      return {
        isError: true,
        title: "Transaction failed",
        message: e.message,
      } as SwapResult;
    }
  };
  return { swap, spotPrice, fee, loading };
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

// ===== Pools format used for MsgSwapExactAmountIn, and used to find the highest liquidity
const lcdPoolPretty = (lcdPool: LcdPool) => {
  const prices: PriceHash<any> = {};
  lcdPool.poolAssets.forEach((asset) => {
    prices[asset.token.denom] = parseFloat(asset.token.amount);
  });
  return makeLcdPoolPretty(prices, lcdPool);
};
