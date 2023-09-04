import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";

import chevronRightSVG from "../../../../assets/icons/chevron-right.svg";
import {
  neutral00,
  neutral22,
  neutral77,
  primaryColor,
  secondaryColor,
} from "../../../utils/style/colors";
import { fontSemibold20 } from "../../../utils/style/fonts";
import { OrderStep } from "../../../utils/types/freelance";
import { BrandText } from "../../BrandText";
import { SVG } from "../../SVG";

type OrderDetailsHeaderProps = {
  currentStep: OrderStep;
  step: OrderStep;
  setCurrentStep: any;
};

export const OrderDetailsHeader: React.FC<OrderDetailsHeaderProps> = ({
  currentStep,
  step,
  setCurrentStep,
}) => {
  // FIXME: remove StyleSheet.create
  // eslint-disable-next-line no-restricted-syntax
  const stepStyles = StyleSheet.create({
    currentCircle: {
      width: 40,
      height: 40,
      lineHeight: 40,
      borderRadius: 20,
      backgroundColor: primaryColor,
      color: neutral00,
      textAlign: "center",
      marginRight: 12,
      fontSize: 16,
    },
    currentText: StyleSheet.flatten([fontSemibold20, { color: primaryColor }]),
    previousCircle: {
      width: 40,
      height: 40,
      lineHeight: 40,
      borderRadius: 20,
      backgroundColor: secondaryColor,
      color: neutral00,
      textAlign: "center",
      marginRight: 12,
      fontSize: 16,
    },
    previousText: StyleSheet.flatten([
      fontSemibold20,
      { color: secondaryColor },
    ]),
    nextCircle: {
      width: 40,
      height: 40,
      lineHeight: 40,
      borderRadius: 20,
      backgroundColor: neutral22,
      color: neutral77,
      textAlign: "center",
      marginRight: 12,
      fontSize: 16,
    },
    nextText: StyleSheet.flatten([fontSemibold20, { color: neutral77 }]),
  });
  const getStepStyle = (orderStep: OrderStep, content: string): any => {
    let targetStyles: any;

    if (orderStep === currentStep) {
      targetStyles =
        content === "circle"
          ? stepStyles.currentCircle
          : stepStyles.currentText;
    } else {
      if (orderStep < currentStep) {
        targetStyles =
          content === "circle"
            ? stepStyles.previousCircle
            : stepStyles.previousText;
      } else {
        targetStyles =
          content === "circle" ? stepStyles.nextCircle : stepStyles.nextText;
      }
    }
    return targetStyles;
  };

  return (
    <View style={{ flexDirection: "row", alignItems: "center" }}>
      <TouchableOpacity
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
        }}
        onPress={() => {
          setCurrentStep(OrderStep.OrderDetails);
        }}
      >
        <BrandText style={getStepStyle(OrderStep.OrderDetails, "circle")}>
          1
        </BrandText>
        <BrandText style={getStepStyle(OrderStep.OrderDetails, "text")}>
          Order Details
        </BrandText>
      </TouchableOpacity>
      <SVG
        source={chevronRightSVG}
        style={{ width: 15, margin: "0 20" }}
        color={neutral77}
      />
      <TouchableOpacity
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
        }}
        onPress={() => {
          OrderStep.ConfirmPay <= step && setCurrentStep(OrderStep.ConfirmPay);
        }}
      >
        <BrandText style={getStepStyle(OrderStep.ConfirmPay, "circle")}>
          2
        </BrandText>
        <BrandText style={getStepStyle(OrderStep.ConfirmPay, "text")}>
          Confirm & Pay
        </BrandText>
      </TouchableOpacity>
      <SVG
        source={chevronRightSVG}
        style={{ width: 15, margin: "0 20" }}
        color={neutral77}
      />

      <TouchableOpacity
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
        }}
        onPress={() => {
          OrderStep.SubmitRequirements <= step &&
            setCurrentStep(OrderStep.SubmitRequirements);
        }}
      >
        <BrandText style={getStepStyle(OrderStep.SubmitRequirements, "circle")}>
          3
        </BrandText>
        <BrandText style={getStepStyle(OrderStep.SubmitRequirements, "text")}>
          Submit Requirements
        </BrandText>
      </TouchableOpacity>
    </View>
  );
};
