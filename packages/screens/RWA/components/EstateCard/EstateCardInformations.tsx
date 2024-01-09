import React from "react";
import { View } from "react-native";

import { EstateCardViewProperty, EstateCardWailistInput } from "./EstateSubmit";
import {
  EstateCardInformationBoxProps,
  EstateCardInformationsProps,
} from "./types";
import { BrandText } from "../../../../components/BrandText";
import { TertiaryBox } from "../../../../components/boxes/TertiaryBox";
import { useIsMobile } from "../../../../hooks/useIsMobile";
import { useIsLightTheme, useTheme } from "../../../../hooks/useTheme";
import { neutral77, neutralA3 } from "../../../../utils/style/colors";

const EstateCardInformationBox: React.FC<EstateCardInformationBoxProps> = ({
  label,
  value,
  secondary = false,
  style,
}) => {
  const theme = useTheme();
  const isLightTheme = useIsLightTheme();
  const isMobile = useIsMobile();
  const backgroundColor = secondary
    ? theme.headerBackgroundColor
    : isLightTheme
      ? "#F9F9F9"
      : theme.headerBackgroundColor;
  const labelColor = secondary
    ? neutral77
    : isLightTheme
      ? neutralA3
      : neutral77;

  return (
    <TertiaryBox
      style={[
        style,
        {
          flex: 1,
          paddingLeft: 10,
          flexDirection: "column",
          alignItems: "flex-start",
          backgroundColor,
          borderColor: secondary
            ? theme.borderColor
            : !isLightTheme
              ? theme.borderColor
              : undefined,
          borderWidth: secondary ? 1 : !isLightTheme ? 1 : 0,
          justifyContent: "center",
          height: isMobile ? 35 : 66,
          width: isMobile ? 80 : 136,
        },
      ]}
    >
      <BrandText
        numberOfLines={1}
        style={{
          fontSize: 11,
          fontWeight: "200",
          letterSpacing: -1,
          color: labelColor,
        }}
      >
        {label}
      </BrandText>
      <BrandText
        numberOfLines={1}
        style={{
          fontSize: 13,
          fontWeight: secondary ? "200" : "300",
          letterSpacing: -0.5,
        }}
      >
        {value}
      </BrandText>
    </TertiaryBox>
  );
};

export const EstateCardInformations: React.FC<EstateCardInformationsProps> = ({
  card,
}) => {
  const isMobile = useIsMobile();
  return (
    <View style={{ flex: 1 }}>
      <BrandText
        numberOfLines={1}
        style={{
          fontSize: 18,
          maxWidth: isMobile ? 165 : 284,
          fontWeight: "300",
          letterSpacing: -1,
        }}
      >
        {card.title}
      </BrandText>
      <View style={{ flex: 1, flexDirection: "column", marginTop: 12 }}>
        <View style={{ flex: 1, flexDirection: "row" }}>
          <EstateCardInformationBox
            label="Total Investment"
            value={card.totalInvestment}
          />
          <EstateCardInformationBox
            label="Target APY"
            value={card.estAPY}
            style={{ marginLeft: 10 }}
          />
        </View>
        <View style={{ flex: 1, flexDirection: "row" }}>
          <EstateCardInformationBox
            label="Rental Start Date"
            value={card.rentalStartDate}
          />
          <EstateCardInformationBox
            label="Target ROI per Token"
            value={card.estAPYPerToken}
            style={{ marginLeft: 10 }}
          />
        </View>
      </View>

      {/* EstateSubmit */}
      {card.isComingSoon ? (
        <EstateCardWailistInput />
      ) : (
        <EstateCardViewProperty />
      )}
    </View>
  );
};
