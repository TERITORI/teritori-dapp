import { ReactNode } from "react";
import { StyleProp, TextStyle, View, ViewStyle } from "react-native";

import cryptoLogoSVG from "../../../assets/icons/crypto-logo.svg";
import SolanaCircleSVG from "../../../assets/icons/networks/solana-circle.svg";
import { useIsMobile } from "../../hooks/useIsMobile";
import { secondaryColor } from "../../utils/style/colors";
import { fontSemibold11, fontSemibold13 } from "../../utils/style/fonts";
import { layout } from "../../utils/style/layout";
import { BrandText } from "../BrandText";
import { SVG } from "../SVG";

export const InnerCellText: React.FC<{
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  children: ReactNode;
  isSolanaIcon?: boolean;
  isCryptoLogo?: boolean;
}> = ({
  children,
  style,
  textStyle,
  isSolanaIcon = false,
  isCryptoLogo = false,
}) => {
  const isMobile = useIsMobile();
  return (
    <View
      style={[
        style,
        {
          paddingRight: layout.spacing_x1,
        },
        (isSolanaIcon || isCryptoLogo) && {
          flexDirection: "row",
          alignItems: "center",
        },
      ]}
    >
      {isSolanaIcon && (
        <View style={{ marginRight: layout.spacing_x0_25 }}>
          <SVG
            width={20}
            height={20}
            source={SolanaCircleSVG}
            color={secondaryColor}
          />
        </View>
      )}
      {isCryptoLogo && (
        <View style={{ marginRight: layout.spacing_x1 }}>
          <SVG source={cryptoLogoSVG} />
        </View>
      )}
      <BrandText
        style={[isMobile ? fontSemibold11 : fontSemibold13, textStyle]}
        numberOfLines={1}
      >
        {children}
      </BrandText>
    </View>
  );
};
