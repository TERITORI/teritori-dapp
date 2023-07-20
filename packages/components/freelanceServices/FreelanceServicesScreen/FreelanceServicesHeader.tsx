import React from "react";
import { useWindowDimensions, View } from "react-native";

import searchSVG from "../../../../assets/icons/search.svg";
import { BuyerSellerToggle } from "../../../screens/FreelanceServices/components/BuyerSellerToggle";
import { fontSemibold28 } from "../../../utils/style/fonts";
import { layout } from "../../../utils/style/layout";
import { BrandText } from "../../BrandText";
import FlexRow from "../../FlexRow";
import { SVG } from "../../SVG";
import { Separator } from "../../Separator";
import { TextInputCustom } from "../../inputs/TextInputCustom";

export const FreelanceServicesHeader: React.FC = () => {
  const { width } = useWindowDimensions();

  return (
    <FlexRow justifyContent="space-between">
      <BuyerSellerToggle
        isBuyer
        style={{ flex: 1, marginLeft: layout.padding_x4 }}
      />

      <View style={{ alignItems: "center" }}>
        <BrandText style={[fontSemibold28, { marginTop: 48 }]}>
          Find the Perfect Freelance Services for your Business
        </BrandText>
        <TextInputCustom<{ Search: string }>
          label=""
          name="Search"
          width={width > 1024 ? 480 : 300}
          placeHolder="Search..."
          style={{ alignSelf: "center", marginTop: layout.padding_x3_5 }}
        >
          <SVG
            source={searchSVG}
            width={22}
            height={22}
            style={{ marginRight: 12 }}
          />
        </TextInputCustom>
        <Separator style={{ width: 360, marginTop: 42 }} />
      </View>

      <View style={{ flex: 1 }} />
    </FlexRow>
  );
};
