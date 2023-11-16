import React from "react";
import { View } from "react-native";

import {
  neutral00,
  neutral77,
  primaryColor,
} from "../../../utils/style/colors";
import {
  fontMedium14,
  fontSemibold16,
  fontSemibold20,
} from "../../../utils/style/fonts";
import { OrderStep } from "../../../utils/types/freelance";
import { BrandText } from "../../BrandText";
import { TertiaryBox } from "../../boxes/TertiaryBox";
import { SecondaryButton } from "../../buttons/SecondaryButton";
import { ServiceLevel } from "../types/fields";

const SERVICE_FEE_IN_TORI = 100;

export const FirstRightCard: React.FC<{
  serviceLevel: ServiceLevel;
  selected: Set<number>;
  step: OrderStep;
  nextStep: any;
}> = ({ serviceLevel, selected, step, nextStep }) => {
  const getTotalPrice = (serviceLevel: ServiceLevel, selected: Set<number>) =>
    serviceLevel.extras
      .filter((element, index) => selected.has(index))
      .reduce((previousValue, currentValue) => {
        return previousValue + currentValue.price.value;
      }, serviceLevel.price.value);

  return (
    <TertiaryBox width={440}>
      <View
        style={{
          padding: 20,
          width: 400,
        }}
      >
        <BrandText style={[fontSemibold20]}>Price summary</BrandText>
        <View
          style={{
            display: "flex",
            marginTop: 20,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <BrandText style={{ color: neutral77, fontSize: 16 }}>
            Subtotal
          </BrandText>
          <BrandText style={{ fontSize: 16 }}>
            {getTotalPrice(serviceLevel, selected)}{" "}
            {serviceLevel.price.currency}
          </BrandText>
        </View>
        <View
          style={{
            display: "flex",
            marginTop: 20,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <BrandText style={[fontSemibold16, { color: neutral77 }]}>
            Service Fee
          </BrandText>
          <BrandText style={[fontSemibold16]}>
            {SERVICE_FEE_IN_TORI} TORI
          </BrandText>
        </View>
        <View
          style={{
            display: "flex",
            marginTop: 20,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            backgroundColor: neutral77,
            height: 1,
          }}
        />
        <View
          style={{
            display: "flex",
            marginTop: 20,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <BrandText style={[fontSemibold20, { color: neutral77 }]}>
            Total
          </BrandText>
          <BrandText style={[fontSemibold20]}>
            {getTotalPrice(serviceLevel, selected) + SERVICE_FEE_IN_TORI}{" "}
            {serviceLevel.price.currency}
          </BrandText>
        </View>
        <View
          style={{
            display: "flex",
            marginTop: 20,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <BrandText style={[fontSemibold16, { color: neutral77 }]}>
            Delivery Time
          </BrandText>
          <BrandText style={[fontSemibold16]}>3 days</BrandText>
        </View>
        <SecondaryButton
          text="Continue to checkout"
          size="SM"
          fullWidth
          color={neutral00}
          backgroundColor={primaryColor}
          style={{ marginTop: 24, marginBottom: 20 }}
          onPress={() => nextStep()}
        />
        <BrandText
          style={[fontMedium14, { color: neutral77, textAlign: "center" }]}
        >
          You won"t be charged yet
        </BrandText>
      </View>
    </TertiaryBox>
  );
};
