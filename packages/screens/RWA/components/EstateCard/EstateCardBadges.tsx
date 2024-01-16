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
    <View
      style={{
        flexDirection: "row",
        flexWrap: isMobile ? "wrap" : "nowrap",
        gap: 6,
        marginBottom: 10,
      }}
    >
      {tags.map((value, index) => {
        return (
          <View
            style={{
              backgroundColor: theme.badgeBackgroundColor,
              ...BadgeItemCStyle,
            }}
            key={index}
          >
            <BrandText
              style={{
                color: theme.badgeColor,
                fontWeight: "200",
                fontSize: 12,
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
  height: 20,
  borderRadius: 10,
  justifyContent: "center",
  alignItems: "center",
  paddingHorizontal: 6,
};
