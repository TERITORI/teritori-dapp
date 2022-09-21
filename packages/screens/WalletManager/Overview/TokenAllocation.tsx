import React from "react";
import { View } from "react-native";
import { PieChart } from "react-native-svg-charts";

import cosmosHubSVG from "../../../../assets/icons/cosmos-hub-circle.svg";
import solanaSVG from "../../../../assets/icons/solana-circle.svg";
import teritoriSVG from "../../../../assets/icons/teritori.svg";
import { BrandText } from "../../../components/BrandText";
import { SVG } from "../../../components/SVG";

const getPieColor = (title: string): string => {
  switch (title) {
    case "Solana":
      return "#16BBFF";
    case "Cosmos Hub":
      return "#5C26F5";
    default:
      return "black";
  }
};

export const getIconFromTitle = (title: string) => {
  switch (title) {
    case "Solana":
      return solanaSVG;
    case "Cosmos Hub":
      return cosmosHubSVG;
    case "Teritori":
      return teritoriSVG;
    default:
      return solanaSVG;
  }
};

const pieData = [
  {
    title: "Solana",
    amount: 400,
    percent: 80,
  },
  {
    title: "Cosmos Hub",
    amount: 100,
    percent: 20,
  },
];

export const TokenAllocation: React.FC = () => {
  return (
    <View>
      <BrandText style={{ marginBottom: 24 }}>Token Allocation</BrandText>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          flex: 1,
        }}
      >
        <PieChart
          style={{ height: 216, flex: 1 }}
          data={pieData.map((data) => ({
            ...data,
            key: data.title,
            value: data.percent,
            svg: {
              fill: getPieColor(data.title),
            },
          }))}
          innerRadius="80%"
          padAngle={0.02}
        />
        <View>
          {pieData.map((item) => (
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <SVG
                height={24}
                width={24}
                source={getIconFromTitle(item.title)}
              />
              <BrandText
                style={{
                  marginLeft: 8,
                }}
              >
                {item.title}
              </BrandText>
              <BrandText
                style={{
                  alignSelf: "flex-end",
                }}
              >
                ${item.amount}
              </BrandText>
              <BrandText>{item.percent}%</BrandText>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
};
