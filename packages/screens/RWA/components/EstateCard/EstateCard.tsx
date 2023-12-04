import React from "react";
import { View } from "react-native";

import { EstateCardBadges } from "./EstateCardBadges";
import { EstateCardImage } from "./EstateCardImage";
import { EstateCardInformations } from "./EstateCardInformations";
import { EstateCardProps } from "./types";
import EstatePlaceholder from "../../../../../assets/default-images/estate-placeholder.png";
import { TertiaryBox } from "../../../../components/boxes/TertiaryBox";
import { useIsMobile } from "../../../../hooks/useIsMobile";
import { useTheme } from "../../../../hooks/useTheme";
import { layout } from "../../../../utils/style/layout";

export const EstateCard: React.FC<EstateCardProps> = ({
  tags,
  card,
  style,
}) => {
  const theme = useTheme();
  const isMobile = useIsMobile();
  return (
    <TertiaryBox
      mainContainerStyle={{
        borderColor: theme.borderColor,
        backgroundColor: theme.backgroundColor,
        padding: isMobile ? layout.spacing_x1_5 : layout.spacing_x2_5,
      }}
      style={style}
      squaresBackgroundColor={theme.backgroundColor}
      width={isMobile ? 350 : 580}
      height={isMobile ? 250 : 327}
    >
      <View style={{ flex: 1 }}>
        <EstateCardBadges tags={tags} />
        <View style={{ flex: 1, flexDirection: "row", marginTop: 5 }}>
          <EstateCardInformations card={card} />
          <EstateCardImage sourceURI={EstatePlaceholder} />
        </View>
      </View>
    </TertiaryBox>
  );
};
