import React from "react";
import { View } from "react-native";

import { Money } from "../../../api/pathwar/v1/pathwar";
import { BrandText } from "../../../components/BrandText";
import { CurrencyIcon } from "../../../components/CurrencyIcon";
import { TertiaryBox } from "../../../components/boxes/TertiaryBox";
import { prettyPrice } from "../../../utils/coins";
import { neutral17, neutral77 } from "../../../utils/style/colors";
import { fontSemibold13 } from "../../../utils/style/fonts";
import { layout } from "../../../utils/style/layout";

export const PathWarPrice: React.FC<{ price: Money | undefined }> = ({
  price,
}) => {
  return (
    <TertiaryBox
      width={200}
      height={47}
      squaresBackgroundColor={neutral17}
      style={{ marginTop: layout.padding_x1_5 }}
    >
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-around",
          alignItems: "center",
          width: "100%",
        }}
      >
        <BrandText style={[{ color: neutral77 }, fontSemibold13]}>
          Price
        </BrandText>
        {price && (
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              alignContent: "center",
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
              {prettyPrice("teritori", price?.amount, price?.denom)}
            </BrandText>
            <CurrencyIcon networkId="teritori" denom={price?.denom} size={16} />
          </View>
        )}
      </View>
    </TertiaryBox>
  );
};
