// import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { useWindowDimensions, View, ViewStyle } from "react-native";
import { SvgProps } from "react-native-svg";

import cosmosHubSVG from "../../../../assets/icons/networks/cosmos-hub-circle.svg";
import ethereumSVG from "../../../../assets/icons/networks/ethereum-circle.svg";
import teritoriSVG from "../../../../assets/icons/networks/teritori-circle.svg";
import { BrandText } from "../../../components/BrandText";
import { ProgressLine } from "../../../components/ProgressLine";
import { SVG } from "../../../components/SVG";
import { OVERVIEW_FLEX_BREAK_WIDTH } from "../constants";

interface AssetRatioData {
  icon: React.FC<SvgProps>;
  title: string;
  percent: number;
}

const DATA: AssetRatioData[] = [
  {
    icon: teritoriSVG,
    title: "Teritori",
    percent: 100,
  },
  {
    icon: cosmosHubSVG,
    title: "Cosmos Hub",
    percent: 0,
  },
  {
    icon: ethereumSVG,
    title: "Ethereum",
    percent: 0,
  },
];

const ListItem: React.FC<AssetRatioData> = ({ title, icon, percent }) => {
  const { width } = useWindowDimensions();

  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 24,
      }}
    >
      <SVG width={24 * 2} source={icon} />

      <BrandText
        style={{
          width: 200,
          marginLeft: 8,
          fontSize: 14,
        }}
      >
        {title}
      </BrandText>
      <ProgressLine
        percent={percent}
        width={width < OVERVIEW_FLEX_BREAK_WIDTH ? width - 540 : 200}
      />
      <BrandText
        style={{
          width: 80,
          textAlign: "right",
          fontSize: 14,
        }}
      >
        {percent}%
      </BrandText>
    </View>
  );
};

interface AssetRatioByChainProps {
  style?: ViewStyle;
}
export const AssetRatioByChain: React.FC<AssetRatioByChainProps> = ({
  style,
}) => {
  return (
    <View style={[style]}>
      <BrandText
        style={{
          marginBottom: 24,
          fontSize: 20,
        }}
      >
        Asset Ratio by Chain
      </BrandText>
      <View
      /* style={{
          borderBottomWidth: 1,
          borderColor: neutral33,
        }}*/
      >
        {DATA.map((item) => (
          <ListItem key={item.title} {...item} />
        ))}
      </View>
      {/*<View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "flex-end",
          paddingTop: 20,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginRight: 32,
          }}
        >
          <LinearGradient
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            locations={[0, 0.5, 1]}
            colors={["#5433FF", "#20BDFF", "#A5FECB"]}
            style={{
              width: 16,
              height: 16,
              borderRadius: 12,
              marginRight: 12,
            }}
          />
          <BrandText
            style={{
              fontSize: 14,
            }}
          >
            Available Balance
          </BrandText>
        </View>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <View
            style={{
              width: 16,
              height: 16,
              borderRadius: 12,
              backgroundColor: "#5C26F5",
              marginRight: 12,
            }}
          />
          <BrandText
            style={{
              fontSize: 14,
            }}
          >
            Staked Balance
          </BrandText>
        </View>
          </View>*/}
    </View>
  );
};
