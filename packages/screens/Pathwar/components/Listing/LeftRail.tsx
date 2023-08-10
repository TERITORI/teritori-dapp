import React from "react";
import { TouchableOpacity, View } from "react-native";

import { Money } from "../../../../api/pathwar/v1/pathwar";
import { BrandText } from "../../../../components/BrandText";
import { CurrencyIcon } from "../../../../components/CurrencyIcon";
import { OptimizedImage } from "../../../../components/OptimizedImage";
import { TertiaryBox } from "../../../../components/boxes/TertiaryBox";
import { useIsMobile } from "../../../../hooks/useIsMobile";
import { prettyPrice } from "../../../../utils/coins";
import {
  neutral00,
  neutral17,
  neutral77,
  secondaryColor,
} from "../../../../utils/style/colors";
import { fontSemibold13, fontSemibold14 } from "../../../../utils/style/fonts";
import { layout } from "../../../../utils/style/layout";

export const LeftRail: React.FC<{
  sourceURI: string;
  price: Money | undefined;
  onMoreButtonPress?: () => void;
}> = ({ sourceURI, price, onMoreButtonPress }) => {
  const isMobile = useIsMobile();
  return (
    <View
      style={{
        flexDirection: "column",
        paddingRight: isMobile ? 0 : layout.padding_x2,
        height: isMobile ? "auto" : "100%",
        justifyContent: "space-between",
        paddingBottom: isMobile ? layout.padding_x2 : 0,
        width: isMobile ? "100%" : 210,
      }}
    >
      <View>
        <TertiaryBox fullWidth height={200} squaresBackgroundColor={neutral17}>
          <OptimizedImage
            sourceURI={sourceURI}
            style={{
              borderTopRightRadius: 7,
              borderBottomLeftRadius: 7,
              width: "100%",
              height: "100%",
            }}
            height={195}
            width={195}
          />
        </TertiaryBox>
        <TertiaryBox
          fullWidth
          height={47}
          squaresBackgroundColor={neutral17}
          style={{ marginTop: layout.padding_x1 }}
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
                <CurrencyIcon
                  networkId="teritori"
                  denom={price?.denom}
                  size={16}
                />
              </View>
            )}
          </View>
        </TertiaryBox>
      </View>
      <View
        style={{
          flexDirection: "row",
          justifyContent:
            typeof onMoreButtonPress !== "undefined"
              ? "space-between"
              : "center",
          marginTop: layout.padding_x1,
        }}
      >
        <TouchableOpacity>
          <TertiaryBox
            width={110}
            height={40}
            squaresBackgroundColor={neutral17}
            mainContainerStyle={{ backgroundColor: secondaryColor }}
          >
            <BrandText style={[{ color: neutral00 }, fontSemibold14]}>
              Buy
            </BrandText>
          </TertiaryBox>
        </TouchableOpacity>
        {typeof onMoreButtonPress !== "undefined" && (
          <TouchableOpacity onPress={onMoreButtonPress}>
            <TertiaryBox
              width={80}
              height={40}
              squaresBackgroundColor={neutral17}
              mainContainerStyle={{ borderColor: secondaryColor }}
            >
              <BrandText style={[{ color: secondaryColor }, fontSemibold14]}>
                More
              </BrandText>
            </TertiaryBox>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};
