import { Decimal } from "cosmwasm";
import React, { useCallback, useEffect, useState } from "react";
import { StyleProp, ViewStyle } from "react-native";
import { LineChart, Grid } from "react-native-svg-charts";

import { PriceDatum } from "../../api/marketplace/v1/marketplace";
import { backendClient } from "../../utils/backend";
import { toriCurrency } from "../../utils/teritori";

export const NFTPriceHistory: React.FC<{
  id: string;
  style: StyleProp<ViewStyle>;
}> = ({ id, style }) => {
  const { priceHistory } = useNFTPriceHistory(id);
  if (!priceHistory.length) {
    return null;
  }
  return (
    <LineChart
      style={style}
      data={priceHistory}
      xAccessor={({ item: datum }: { item: PriceDatum }) =>
        new Date(datum.time).getTime()
      }
      yAccessor={({ item: datum }: { item: PriceDatum }) =>
        Decimal.fromAtomics(
          datum.price,
          toriCurrency.coinDecimals
        ).toFloatApproximation()
      }
      svg={{ stroke: "rgb(134, 65, 244)" }}
      contentInset={{ top: 20, bottom: 20 }}
    >
      <Grid />
    </LineChart>
  );
};

const useNFTPriceHistory = (id: string) => {
  const [priceHistory, setPriceHistory] = useState<PriceDatum[]>([]);
  const [refreshIndex, setRefreshIndex] = useState(0);
  const refresh = useCallback(() => {
    setRefreshIndex((i) => i + 1);
  }, []);
  useEffect(() => {
    const effect = async () => {
      try {
        const { data } = await backendClient.NFTPriceHistory({ id });
        const firstY = data.length ? data[0].price : "0";
        const lastY = data.length ? data[data.length - 1].price : "0";
        const now = Date.now();
        data.unshift({
          price: firstY,
          time: new Date(now - 1000 * 60 * 60 * 24).toISOString(),
        });
        data.push({ price: lastY, time: new Date(now).toISOString() });
        setPriceHistory(data);
      } catch (err) {
        console.error(err);
      }
    };
    effect();
  }, [id, refreshIndex]);
  return { priceHistory, refreshPriceHistory: refresh };
};
