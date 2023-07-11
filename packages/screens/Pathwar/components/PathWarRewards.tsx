import React from "react";
import { FlatList, View, ViewStyle } from "react-native";

import { Money } from "../../../api/pathwar/v1/pathwar";
import { BrandText } from "../../../components/BrandText";
import { CurrencyIcon } from "../../../components/CurrencyIcon";
import { TertiaryBox } from "../../../components/boxes/TertiaryBox";
import { useIsMobile } from "../../../hooks/useIsMobile";
import { prettyPrice } from "../../../utils/coins";
import { neutral17 } from "../../../utils/style/colors";
import { fontSemibold13, fontSemibold20 } from "../../../utils/style/fonts";
import { layout } from "../../../utils/style/layout";

export const PathWarRewards: React.FC<{
  rewards: Money[];
  style?: ViewStyle;
}> = ({ rewards, style }) => {
  const isMobile = useIsMobile();
  return (
    <FlatList
      data={rewards}
      style={{
        width: "100%",
      }}
      contentContainerStyle={{
        width: "100%",
      }}
      columnWrapperStyle={{
        justifyContent: "space-between",
        flexWrap: "wrap",
        flex: 1,
        marginTop: 5,
      }}
      showsHorizontalScrollIndicator={false}
      numColumns={99}
      ListEmptyComponent={
        <BrandText style={[fontSemibold20, { textAlign: "center" }]}>
          No users solved this challenge yet.
        </BrandText>
      }
      renderItem={({ item, index }) => {
        return (
          <TertiaryBox
            height={42}
            fullWidth
            squaresBackgroundColor={neutral17}
            style={
              isMobile
                ? {
                    marginTop: layout.padding_x1_5,
                    alignSelf: "center",
                  }
                : { marginRight: layout.padding_x1 }
            }
          >
            <View
              style={{
                flexDirection: "row",
                justifyContent: "center",
                width: 150,
                paddingLeft: layout.padding_x3_5,
                paddingRight: layout.padding_x3_5,
              }}
            >
              <View>
                <View
                  style={{
                    flexDirection: "row",
                    alignContent: "center",
                    alignItems: "center",
                  }}
                >
                  <BrandText
                    style={[
                      fontSemibold13,
                      {
                        marginRight: layout.padding_x0_5,
                      },
                    ]}
                  >
                    Reward {prettyPrice("teritori", item.amount, item.denom)}
                  </BrandText>
                  <CurrencyIcon
                    networkId="teritori"
                    denom={item.denom}
                    size={16}
                  />
                </View>
              </View>
            </View>
          </TertiaryBox>
        );
      }}
    />
  );
};
