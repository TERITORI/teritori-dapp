import React from "react";
import { View, ViewStyle } from "react-native";
import { VictoryPie } from "victory-native";

import { BrandText } from "../../../components/BrandText";
import { SVG } from "../../../components/SVG";
import { WALLET_TOKEN_PIE } from "../../../utils/fakeData/walletManager";
import { neutral33 } from "../../../utils/style/colors";
import { getWalletIconFromTitle } from "../../../utils/walletManagerHelpers";

interface TokenAllocationProps {
  style?: ViewStyle;
}

export const TokenAllocation: React.FC<TokenAllocationProps> = ({ style }) => {
  return (
    <View style={[style]}>
      <BrandText style={{ marginBottom: 24, fontSize: 20 }}>
        Token Allocation
      </BrandText>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <VictoryPie
          innerRadius={160}
          padAngle={0.8}
          colorScale={["#5C26F5", "#16BBFF"]}
          labels={() => null}
          data={WALLET_TOKEN_PIE}
          padding={0}
        />

        <View style={{ marginLeft: 32 }}>
          {WALLET_TOKEN_PIE.map((item) => (
            <View
              key={item.title}
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: 16,
              }}
            >
              <SVG
                height={24}
                width={24}
                source={getWalletIconFromTitle(item.title)}
              />
              <BrandText
                style={{
                  marginLeft: 8,
                  width: 120,
                  fontSize: 14,
                }}
              >
                {item.title}
              </BrandText>
              <BrandText
                style={{
                  fontSize: 14,
                }}
              >
                ${item.amount}
              </BrandText>
              <BrandText
                style={{
                  fontSize: 14,
                  borderLeftWidth: 1,
                  borderColor: neutral33,
                  paddingLeft: 12,
                  marginLeft: 12,
                }}
              >
                {item.percent}%
              </BrandText>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
};
