import React, { FC } from "react";
import { View } from "react-native";
import { SvgProps } from "react-native-svg";

import chevronRightSVG from "../../../../../assets/icons/chevron-right-gray.svg";
import questionSVG from "../../../../../assets/icons/question-gray.svg";
import { BrandText } from "../../../../components/BrandText";
import { SVG } from "../../../../components/SVG";
import { SVGorImageIcon } from "../../../../components/SVG/SVGorImageIcon";
import { CustomPressable } from "../../../../components/buttons/CustomPressable";
import { prettyPrice } from "../../../../utils/coins";
import { neutral39, neutralA3 } from "../../../../utils/style/colors";
import { fontMedium13, fontSemibold14 } from "../../../../utils/style/fonts";
import { layout } from "../../../../utils/style/layout";
import { findByBaseDenom } from "../../../Wallet/util/chain-registry";

type Props = {
  icon: string | FC<SvgProps>;
  denom: string;
  amount: string;
  dollarAmount: string;
  onPress: () => void;
};

export const AddedToken = ({ dollarAmount, onPress, denom, amount }: Props) => {
  const assetList = findByBaseDenom(denom);
  const asset = assetList?.assets[0];

  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          gap: layout.spacing_x1_5,
        }}
      >
        <View
          style={{
            backgroundColor: !asset?.logo_URIs?.svg ? neutral39 : "transparent",
            borderRadius: 100,
            alignItems: "center",
            justifyContent: "center",
            width: 24,
            height: 24,
          }}
        >
          <SVGorImageIcon
            icon={asset?.logo_URIs?.png || questionSVG}
            iconSize={asset ? 24 : 18}
          />
        </View>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: layout.spacing_x0_5,
          }}
        >
          <BrandText style={[fontSemibold14]}>{asset?.symbol}</BrandText>
        </View>
      </View>
      <CustomPressable
        onPress={onPress}
        style={{
          flexDirection: "row",
          alignItems: "center",
          gap: layout.spacing_x0_5,
        }}
      >
        <BrandText style={[fontSemibold14]}>
          {prettyPrice(assetList?.chain_name, amount, denom)}
        </BrandText>
        <BrandText style={[fontMedium13, { color: neutralA3 }]}>
          ${dollarAmount.toLocaleString()}
        </BrandText>
        <SVG source={chevronRightSVG} height={16} width={16} />
      </CustomPressable>
    </View>
  );
};
