import React from "react";
import { View } from "react-native";

import { EstateCardViewProperty, EstateCardWailistInput } from "./EstateSubmit";
import {
  EstateCardInformationBoxProps,
  EstateCardInformationsProps,
} from "./types";
import { BrandText } from "../../../../components/BrandText";
import { TertiaryBox } from "../../../../components/boxes/TertiaryBox";
import { Separator } from "../../../../components/separators/Separator";
import { useIsLightTheme, useTheme } from "../../../../hooks/useTheme";
import { neutral77, neutralA3 } from "../../../../utils/style/colors";
import { layout } from "../../../../utils/style/layout";

const EstateCardInformationBox: React.FC<EstateCardInformationBoxProps> = ({
  label,
  value,
}) => {
  const isLightTheme = useIsLightTheme();

  const labelColor = isLightTheme ? neutralA3 : neutral77;
  return (
    <View
      style={{
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <BrandText
        numberOfLines={1}
        style={{
          flex: 1,
          fontSize: 12,
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
          textAlign: "right",
          flex: 1,
          fontSize: 12,
          fontWeight: "300",
          letterSpacing: -0.5,
        }}
      >
        {value}
      </BrandText>
    </View>
  );
};

export const EstateCardInformations: React.FC<EstateCardInformationsProps> = ({
  card,
}) => {
  const theme = useTheme();
  const isLightTheme = useIsLightTheme();
  const backgroundColor = isLightTheme
    ? "#F9F9F9"
    : theme.headerBackgroundColor;

  return (
    <View style={{ flex: 1 }}>
      <TertiaryBox
        style={[
          {
            height: 128,
            backgroundColor,
            justifyContent: "center",
            padding: layout.spacing_x1,
            borderColor: !isLightTheme ? theme.borderColor : undefined,
            borderWidth: !isLightTheme ? 1 : 0,
            marginBottom: layout.spacing_x2,
          },
        ]}
      >
        <EstateCardInformationBox
          label="Total Investment"
          value={card.totalInvestment}
        />
        <Separator color={theme.borderColor} />
        <EstateCardInformationBox label="Target APY" value={card.estAPY} />
        <Separator color={theme.borderColor} />
        <EstateCardInformationBox
          label="Rental Start Date"
          value={card.rentalStartDate}
        />
        <Separator color={theme.borderColor} />
        <EstateCardInformationBox
          label="Target ROI per Token"
          value={card.estAPYPerToken}
        />
      </TertiaryBox>

      {/* EstateSubmit */}
      {card.isComingSoon ? (
        <EstateCardWailistInput />
      ) : (
        <EstateCardViewProperty />
      )}
    </View>
  );
};
