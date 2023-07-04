import React from "react";
import { View } from "react-native";

import { Money } from "../../../api/pathwar/v1/pathwar";
import { BrandText } from "../../../components/BrandText";
import { CurrencyIcon } from "../../../components/CurrencyIcon";
import { TertiaryBox } from "../../../components/boxes/TertiaryBox";
import { prettyPrice } from "../../../utils/coins";
import { neutral17 } from "../../../utils/style/colors";
import { fontSemibold13 } from "../../../utils/style/fonts";
import { layout } from "../../../utils/style/layout";

export const PathWarRewards: React.FC<{ rewards: Money[] }> = ({ rewards }) => {
  return (
    <View>
      {rewards.map((reward) => (
        <View style={{ width: "100%" }}>
          <TertiaryBox
            height={42}
            squaresBackgroundColor={neutral17}
            style={{ marginTop: layout.padding_x1_5, alignSelf: "center" }}
          >
            <View
              style={{
                flexDirection: "row",
                justifyContent: "center",
                width: "fit-content",
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
                    Reward{" "}
                    {prettyPrice("teritori", reward.amount, reward.denom)}
                  </BrandText>
                  <CurrencyIcon
                    networkId="teritori"
                    denom={reward.denom}
                    size={16}
                  />
                </View>
              </View>
            </View>
          </TertiaryBox>
        </View>
      ))}
    </View>
  );
};
