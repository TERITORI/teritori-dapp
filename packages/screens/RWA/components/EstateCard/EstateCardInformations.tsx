import React from "react";
import { View } from "react-native";
import { useSelector } from "react-redux";

import { EstateCardViewProperty, EstateCardWailistInput } from "./EstateSubmit";
import { BrandText } from "../../../../components/BrandText";
import { TertiaryBox } from "../../../../components/boxes/TertiaryBox";
import { selectIsLightTheme } from "../../../../store/slices/settings";

type EstateCardInformationBoxProps = {
  label: string;
  value: string;
};

const EstateCardInformationBox: React.FC<EstateCardInformationBoxProps> = ({
  label,
  value,
}) => {
  const isLightTheme = useSelector(selectIsLightTheme);

  return (
    <TertiaryBox
      mainContainerStyle={{
        flex: 1,
        paddingLeft: 10,
        flexDirection: "column",
        backgroundColor: "#F9F9F9",
        borderColor: "#F9F9F9",
        alignItems: "flex-start",
      }}
      squaresBackgroundColor={isLightTheme ? "#FFFFFF" : "#000000"}
      height={66}
      width={136}
    >
      <BrandText
        style={{
          fontSize: 11,
          fontWeight: "200",
          color: "#A3A3A3",
          letterSpacing: -1,
          lineHeight: 25,
        }}
      >
        {label}
      </BrandText>
      <BrandText style={{ fontSize: 13, fontWeight: "300", letterSpacing: -1 }}>
        {value}
      </BrandText>
    </TertiaryBox>
  );
};

type EstateInformations = {
  id: string;
  title: string;
  totalInvestment: string;
  estAPY: string;
  rentalStartDate: string;
  estAPYPerToken: string;
  isComingSoon?: boolean;
};

export type EstateCardInformationsProps = {
  card: EstateInformations;
};

export const EstateCardInformations: React.FC<EstateCardInformationsProps> = ({
  card,
}) => {
  return (
    <View style={{ flex: 1 }}>
      <BrandText style={{ fontSize: 18, fontWeight: "300", letterSpacing: -1 }}>
        {card.title}
      </BrandText>
      <View style={{ flex: 1, flexDirection: "column", marginTop: 12 }}>
        <View style={{ flex: 1, flexDirection: "row" }}>
          <EstateCardInformationBox
            label="Total Investment"
            value={card.totalInvestment}
          />
          <View style={{ marginLeft: 10 }}>
            <EstateCardInformationBox label="Est. APY" value={card.estAPY} />
          </View>
        </View>
        <View style={{ flex: 1, flexDirection: "row" }}>
          <EstateCardInformationBox
            label="Rental Start Date"
            value={card.rentalStartDate}
          />
          <View style={{ marginLeft: 10 }}>
            <EstateCardInformationBox
              label="Est. APY per Token"
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
