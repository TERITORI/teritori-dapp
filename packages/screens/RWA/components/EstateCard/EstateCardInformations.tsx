import React from "react";
import { TextStyle, View, ViewStyle } from "react-native";

import { EstateCardViewProperty, EstateCardWailistInput } from "./EstateSubmit";
import {
  EstateCardInformationBoxProps,
  EstateCardInformationsProps,
} from "./types";
import { BrandText } from "../../../../components/BrandText";
import { TertiaryBox } from "../../../../components/boxes/TertiaryBox";
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
      mainContainerStyle={[
        style,
        InformationsBoxCStyle,
        {
          backgroundColor,
          borderColor: secondary
            ? theme.borderColor
            : !isLightTheme
              ? theme.borderColor
              : undefined,
          borderWidth: secondary ? 1 : !isLightTheme ? 1 : 0,
        },
      ]}
      noBrokenCorners={isLightTheme}
      squaresBackgroundColor={theme.backgroundColor}
      height={66}
      width={136}
    >
      <BrandText style={{ ...InformationsBoxLabelCStyle, color: labelColor }}>
        {label}
      </BrandText>
      <BrandText
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
  return (
    <View style={{ flex: 1 }}>
      <BrandText
        numberOfLines={1}
        style={{
          fontSize: 18,
          maxWidth: 284,
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
          <View style={{ marginLeft: 10 }}>
            <EstateCardInformationBox label="Target APY" value={card.estAPY} />
          </View>
        </View>
        <View style={{ flex: 1, flexDirection: "row" }}>
          <EstateCardInformationBox
            label="Rental Start Date"
            value={card.rentalStartDate}
          />
          <View style={{ marginLeft: 10 }}>
            <EstateCardInformationBox
              label="Target ROI per Token"
              value={card.estAPYPerToken}
            />
          </View>
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

const InformationsBoxCStyle: ViewStyle = {
  flex: 1,
  paddingLeft: 10,
  flexDirection: "column",
  alignItems: "flex-start",
};

const InformationsBoxLabelCStyle: TextStyle = {
  fontSize: 11,
  fontWeight: "200",
  letterSpacing: -1,
  lineHeight: 25,
};
