import React, { ReactNode } from "react";
import { View } from "react-native";

import logoSVG from "../../../assets/logos/logo.svg";
import { neutral33, neutral77 } from "../../utils/style/colors";
import { fontSemibold14 } from "../../utils/style/fonts";
import { layout, legalFooterHeight } from "../../utils/style/layout";
import { BrandText } from "../BrandText";
import { ExternalLink } from "../ExternalLink";
import { SVG } from "../SVG";

export const LegalFooter: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  return (
    <View
      style={{
        flexDirection: "row",
        flexWrap: "wrap",
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
          marginLeft: layout.spacing_x4,
        }}
      >
        <SVG source={logoSVG} width={32} height={32} />
        <BrandText
          style={[
            fontSemibold14,
            { color: neutral77, marginLeft: layout.spacing_x1_5 },
          ]}
        >
          2023 Teritori
        </BrandText>
      </View>

      {children}

      <View
        style={{
          flexDirection: "row",
          flexWrap: "wrap",
          alignItems: "center",
          justifyContent: "space-evenly",
          width: "40%",
        }}
      >
        <ExternalLink
          gradientType="gray"
          externalUrl="https://teritori.notion.site/Important-Notice-74e66ded18164023b80602b17b284d93"
          style={[
            fontSemibold14,
            {
              marginRight: layout.spacing_x1,
            },
          ]}
          numberOfLines={1}
        >
          Important Notice
        </ExternalLink>

        <ExternalLink
          gradientType="gray"
          externalUrl="https://teritori.notion.site/Privacy-Policy-16e2332744d346db9b78909a91cb44e3"
          style={[
            fontSemibold14,
            {
              marginRight: layout.spacing_x1,
            },
          ]}
          numberOfLines={1}
        >
          Privacy Policy
        </ExternalLink>

        <ExternalLink
          gradientType="gray"
          externalUrl="https://teritori.notion.site/Terms-Conditions-6007160a0c74472cbb75a07bdfdd5f73"
          style={[fontSemibold14, { textDecorationLine: "none" }]}
          numberOfLines={1}
        >
          Terms & Conditions
        </ExternalLink>
      </View>
    </View>
  );
};
