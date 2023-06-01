import React from "react";
import { useWindowDimensions, View } from "react-native";

import searchSVG from "../../../../assets/icons/search.svg";
import { BrandText } from "../../BrandText";
import { SVG } from "../../SVG";
import { Separator } from "../../Separator";
import { TextInputCustom } from "../../inputs/TextInputCustom";

export const FreelanceServicesHeader: React.FC = () => {
  const { width } = useWindowDimensions();

  return (
    <View>
      <BrandText style={{ fontSize: 28, alignSelf: "center", marginTop: 50 }}>
        Find the Perfect Freelance Services for your Business
      </BrandText>
      <TextInputCustom<{ Search: string }>
        label=""
        name="Search"
        width={width > 1024 ? 480 : 300}
        placeHolder="Search..."
        style={{ alignSelf: "center", marginTop: 30 }}
      >
        <SVG
          source={searchSVG}
          width={22}
          height={22}
          style={{ marginRight: 12 }}
        />
      </TextInputCustom>
      <Separator style={{ width: 360, alignSelf: "center", marginTop: 50 }} />
    </View>
  );
};
