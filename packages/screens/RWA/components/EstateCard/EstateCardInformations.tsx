import React from "react";
import { View } from "react-native";
import { useSelector } from "react-redux";

import { EstateCardViewProperty, EstateCardWailistInput } from "./EstateSubmit";
import {
  EstateCardInformationBoxProps,
  EstateCardInformationsProps,
} from "./types";
import { BrandText } from "../../../../components/BrandText";
import { TertiaryBox } from "../../../../components/boxes/TertiaryBox";
import { selectIsLightTheme } from "../../../../store/slices/settings";

export const EstateCardInformationBox: React.FC<
  EstateCardInformationBoxProps
> = ({ label, value, secondary = false, style }) => {
  const isLightTheme = useSelector(selectIsLightTheme);

  return (
    <TertiaryBox
      mainContainerStyle={[
        style,
        {
          flex: 1,
          paddingLeft: 10,
          flexDirection: "column",
          backgroundColor: secondary ? "#FFF" : "#F9F9F9",
          borderColor: secondary ? "#EBEBF0" : "#F9F9F9",
          borderWidth: 1.5,
          alignItems: "flex-start",
        },
      ]}
      squaresBackgroundColor={isLightTheme ? "#FFFFFF" : "#000000"}
      height={66}
      width={136}
    >
      <BrandText
        style={{
          fontSize: 11,
          fontWeight: "200",
          color: secondary ? "#777777" : "#A3A3A3",
          letterSpacing: -1,
          lineHeight: 25,
        }}
      >
        {label}
      </BrandText>
      <BrandText
        style={{
          fontSize: 13,
          fontWeight: secondary ? "200" : "300",
          letterSpacing: -1,
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
