import React from "react";
import { View } from "react-native";

import logoSVG from "../../../assets/logos/logo.svg";
import { neutral33, neutral77 } from "../../utils/style/colors";
import { fontSemibold14 } from "../../utils/style/fonts";
import { layout, legalFooterHeight } from "../../utils/style/layout";
import { BrandText } from "../BrandText";
import { ExternalLink } from "../ExternalLink";
import { SVG } from "../SVG";

export const LegalFooter: React.FC = ({ children }) => {
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        height: legalFooterHeight,
        width: "100%",
        borderTopColor: neutral33,
        borderTopWidth: 1,
      }}
    >
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          marginLeft: layout.padding_x4,
          width: "100%",
          maxWidth: 800 - layout.padding_x4,
        }}
      >
        <SVG source={logoSVG} width={32} height={32} />
        <BrandText
          style={[
            fontSemibold14,
            { color: neutral77, marginLeft: layout.padding_x1_5 },
          ]}
        >
          2022 Teritori
        </BrandText>
      </View>

      {children}

      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-evenly",
          width: "100%",
          maxWidth: 800,
        }}
      >
        {/*TODO: Gradient text for these 3 ExternalLink ["#676767", "#B7B7B7"]*/}
        <ExternalLink
          externalUrl="TODO"
          style={[
            fontSemibold14,
            { color: "#676767", textDecorationLine: "none" },
          ]}
          numberOfLines={1}
        >
          Important Notice
        </ExternalLink>

        <ExternalLink
          externalUrl="TODO"
          style={[
            fontSemibold14,
            { color: "#676767", textDecorationLine: "none" },
          ]}
          numberOfLines={1}
        >
          Privacy Policy
        </ExternalLink>

        <ExternalLink
          externalUrl="TODO"
          style={[
            fontSemibold14,
            { color: "#676767", textDecorationLine: "none" },
          ]}
          numberOfLines={1}
        >
          Terms & Conditions
        </ExternalLink>
      </View>
    </View>
  );
};
