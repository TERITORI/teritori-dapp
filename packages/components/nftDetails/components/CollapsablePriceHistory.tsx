import { useQuery } from "@tanstack/react-query";
import { BigNumber, ethers } from "ethers";
import moment from "moment";
import React, { useMemo } from "react";
import { StyleSheet, View } from "react-native";
import {
  VictoryLine,
  VictoryChart,
  VictoryAxis,
  Curve,
  Path,
} from "victory-native";

import priceHistorySVG from "../../../../assets/icons/price-history.svg";
import { parseNetworkObjectId, NetworkKind } from "../../../networks";
import { getMarketplaceClient } from "../../../utils/backend";
import {
  neutral33,
  neutral77,
  primaryColor,
  transparentColor,
} from "../../../utils/style/colors";
import { fontMedium10, fontMedium14 } from "../../../utils/style/fonts";
import { layout } from "../../../utils/style/layout";
import { BrandText } from "../../BrandText";
import { CollapsableSection } from "../../collapsable/CollapsableSection";

const axisStyle = {
  grid: { strokeDasharray: "none", stroke: "none", padding: 20 },
  tickLabels: { ...StyleSheet.flatten(fontMedium14), fill: neutral77 },
  ticks: { stroke: neutral77, size: 5 },
};
const dependentAxisStyle = {
  ...axisStyle,
  grid: { ...axisStyle, stroke: neutral33 },
};

export const CollapsablePriceHistory: React.FC<{ nftId: string }> = ({
  nftId,
}) => {
  const data = useNFTPriceHistory(nftId);
  const [network] = parseNetworkObjectId(nftId);
  const networkKind = network?.kind;

  const currency = networkKind === NetworkKind.Ethereum ? "ETH" : "USD";

  const convertedData = useMemo(() => {
    if (!data) {
      return [];
    }
    return data.map((d) => ({
      y:
        networkKind === NetworkKind.Ethereum
          ? +ethers.utils.formatEther(BigNumber.from(d.price))
          : d.price,
      x: new Date(d.time),
    }));
  }, [data, networkKind]);

  return (
    <CollapsableSection
      icon={priceHistorySVG}
      title="Price history"
      isExpandedByDefault
    >
      <View style={styles.container}>
        <View style={styles.priceLabelTextContainer}>
          <BrandText style={styles.priceLabelText}>
            Price ({currency})
          </BrandText>
        </View>
        <VictoryChart
          minDomain={{ y: 0 }}
          padding={{ top: 10, bottom: 40, left: 80, right: 0 }}
          height={200}
        >
          <VictoryAxis
            domainPadding={layout.spacing_x4}
            style={axisStyle}
            tickFormat={(val) => moment(val).format("D MMM")}
          />
          <VictoryAxis dependentAxis style={dependentAxisStyle} />

          <VictoryLine
            style={{
              data: { stroke: primaryColor },
              border: { stroke: transparentColor },

              parent: { border: "1px solid red" },
            }}
            dataComponent={<Curve openCurve pathComponent={<Path />} />}
            data={convertedData}
          />
        </VictoryChart>
      </View>
    </CollapsableSection>
  );
};

const useNFTPriceHistory = (nftId: string) => {
  const [network] = parseNetworkObjectId(nftId);
  const { data } = useQuery(
    ["nftPriceHistory", nftId],
    async () => {
      const marketplaceClient = getMarketplaceClient(network?.id);
      if (!marketplaceClient) {
        return [];
      }

      const { data } = await marketplaceClient.NFTPriceHistory({
        id: nftId,
      });
      if (data.length === 0) {
        return data;
      }

      // hack: add start and end point for a cleaner curve
      data.unshift({
        price: data[0].price,
        time: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      });
      data.push({
        price: data[data.length - 1].price,
        time: new Date().toISOString(),
      });

      return data;
    },
    { initialData: [] },
  );
  return data;
};

// FIXME: remove StyleSheet.create
// eslint-disable-next-line no-restricted-syntax
const styles = StyleSheet.create({
  container: {
    margin: layout.spacing_x2,
    marginTop: 0,
    borderRadius: layout.borderRadius * 0.67,
    borderColor: neutral33,
    borderWidth: 1,
    flex: 1,
    paddingTop: layout.spacing_x2,
  },
  priceLabelTextContainer: {
    flex: 1,
    position: "relative",
  },
  priceLabelText: StyleSheet.flatten([
    fontMedium10,
    {
      transform: [{ rotate: "-90deg" }],
      position: "absolute",
      left: -10,
      top: 50,
      bottom: 0,
      color: neutral77,
    },
  ]),
});
