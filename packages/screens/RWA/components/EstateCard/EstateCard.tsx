import React from "react";
import { View } from "react-native";

import { EstateCardBadges } from "./EstateCardBadges";
import { EstateCardImage } from "./EstateCardImage";
import { EstateCardInformations } from "./EstateCardInformations";
import { EstateCardProps } from "./types";
import EstatePlaceholder from "../../../../../assets/default-images/estate-placeholder.png";
import { BrandText } from "../../../../components/BrandText";
import { TertiaryBox } from "../../../../components/boxes/TertiaryBox";
import { useIsMobile } from "../../../../hooks/useIsMobile";
import { useTheme } from "../../../../hooks/useTheme";
import { fontSemibold18 } from "../../../../utils/style/fonts";
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
      style={[
        {
          borderColor: theme.borderColor,
          backgroundColor: theme.backgroundColor,
          padding: isMobile ? layout.spacing_x1_5 : layout.spacing_x2_5,
          width: isMobile ? 328 : 384,
          height: isMobile ? 532 : 508,
        },
        style,
      ]}
    >
      <View style={{ flex: 1, flexDirection: "column" }}>
        <EstateCardImage sourceURI={EstatePlaceholder} />
        <BrandText
          numberOfLines={1}
          style={[
            fontSemibold18,
            {
              marginBottom: layout.spacing_x2,
              marginTop: !isMobile ? layout.spacing_x2 : 0,
            },
          ]}
        >
          {card.title}
        </BrandText>
        <EstateCardBadges tags={tags} />
        <EstateCardInformations card={card} />
      </View>
    </TertiaryBox>
  );
};
