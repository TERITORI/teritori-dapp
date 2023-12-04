import React from "react";
import { View, ViewStyle } from "react-native";

import { EstateCardBadgesProps } from "./types";
import { BrandText } from "../../../../components/BrandText";
import { useIsMobile } from "../../../../hooks/useIsMobile";
import { useTheme } from "../../../../hooks/useTheme";

export const EstateCardBadges: React.FC<EstateCardBadgesProps> = ({ tags }) => {
  const theme = useTheme();
  const isMobile = useIsMobile();
  return (
    <View style={{ flexDirection: "row", marginBottom: 10 }}>
      {tags.map((value, index) => {
        // Limit to 2 tags on mobile
        if (isMobile && index > 1) {
          return;
        }
        return (
          <View
            style={{
              marginLeft: index !== 0 ? 6 : 0,
              backgroundColor: theme.badgeBackgroundColor,
              ...BadgeItemCStyle,
            }}
            key={index}
          >
            <BrandText
              style={{
                color: theme.badgeColor,
                fontWeight: "200",
                fontSize: 13,
              }}
            >
              {value}
            </BrandText>
          </View>
        );
      })}
    </View>
  );
};

const BadgeItemCStyle: ViewStyle = {
  height: 28,
  borderRadius: 10,
  justifyContent: "center",
  alignItems: "center",
  paddingHorizontal: 12,
};
