import React from "react";
import { Pressable, StyleSheet, View, ViewStyle } from "react-native";

import chevronRightSVG from "../../../../assets/icons/chevron-right.svg";
import {
  neutral00,
  neutral22,
  neutral33,
  neutral77,
  primaryColor,
  secondaryColor,
} from "../../../utils/style/colors";
import { fontSemibold14 } from "../../../utils/style/fonts";
import { layout } from "../../../utils/style/layout";
import { GigStep } from "../../../utils/types/freelance";
import { BrandText } from "../../BrandText";
import { SVG } from "../../SVG";

type GigCreationHeaderProps = {
  currentStep: GigStep;
  step: GigStep;
  setCurrentStep: any;
};

export const GigCreationHeader: React.FC<GigCreationHeaderProps> = ({
  currentStep,
  step,
  setCurrentStep,
}) => {
  const stepCircleSize = layout.spacing_x4;

  const headerContainerStyle: ViewStyle = {
    marginTop: 24,
    flexDirection: "column",
  };
  const stepContainerStyle: ViewStyle = {
    flexDirection: "row",
    alignItems: "center",
  };
  const singleBoxStyle: ViewStyle = {
    flexDirection: "row",
    alignItems: "center",
  };
  const divideLineStyle: ViewStyle = {
    height: 1,
    width: "100%",
    backgroundColor: neutral33,
    marginTop: layout.spacing_x2,
    marginBottom: layout.spacing_x3,
  };

  const currentTitleStyle: ViewStyle = StyleSheet.flatten([
    fontSemibold14,
    {
      color: primaryColor,
    },
  ]);
  const currentCircleStyle: ViewStyle = StyleSheet.flatten([
    fontSemibold14,
    {
      width: stepCircleSize,
      height: stepCircleSize,
      borderRadius: stepCircleSize / 2,
      backgroundColor: primaryColor,
      color: neutral00,
      lineHeight: stepCircleSize,
      marginRight: 12,
      textAlign: "center",
    },
  ]);
  const nextTitleStyle: ViewStyle = StyleSheet.flatten([
    fontSemibold14,
    {
      color: neutral77,
    },
  ]);
  const nextCircleStyle: ViewStyle = StyleSheet.flatten([
    fontSemibold14,
    {
      width: stepCircleSize,
      height: stepCircleSize,
      borderRadius: stepCircleSize / 2,
      backgroundColor: neutral22,
      color: neutral77,
      lineHeight: stepCircleSize,
      marginRight: 12,
      textAlign: "center",
    },
  ]);
  const previousTitleStyle: ViewStyle = StyleSheet.flatten([
    fontSemibold14,
    {
      color: secondaryColor,
    },
  ]);
  const previousCircleStyle: ViewStyle = StyleSheet.flatten([
    fontSemibold14,
    {
      width: stepCircleSize,
      height: stepCircleSize,
      borderRadius: stepCircleSize / 2,
      backgroundColor: secondaryColor,
      color: neutral00,
      lineHeight: stepCircleSize,
      marginRight: 12,
      textAlign: "center",
    },
  ]);

  const getStepStyle = (gigStep: GigStep, content: string): any => {
    let targetStyles: any;

    if (gigStep === currentStep) {
      targetStyles =
        content === "circle" ? currentCircleStyle : currentTitleStyle;
    } else {
      if (gigStep < currentStep) {
        targetStyles =
          content === "circle" ? previousCircleStyle : previousTitleStyle;
      } else {
        targetStyles = content === "circle" ? nextCircleStyle : nextTitleStyle;
      }
    }

    return targetStyles;
  };

  return (
    <View style={headerContainerStyle}>
      <View style={stepContainerStyle}>
        <Pressable
          style={singleBoxStyle}
          onPress={() => setCurrentStep(GigStep.OverView)}
        >
          <BrandText style={getStepStyle(GigStep.OverView, "circle")}>
            1
          </BrandText>
          <BrandText style={getStepStyle(GigStep.OverView, "title")}>
            Overview
          </BrandText>
        </Pressable>
        <SVG
          source={chevronRightSVG}
          style={{ width: 16, margin: "0 20" }}
          color={neutral77}
        />
        <Pressable
          style={singleBoxStyle}
          onPress={() => {
            GigStep.Pricing <= step && setCurrentStep(GigStep.Pricing);
          }}
        >
          <BrandText style={getStepStyle(GigStep.Pricing, "circle")}>
            2
          </BrandText>
          <BrandText style={getStepStyle(GigStep.Pricing, "title")}>
            Pricing
          </BrandText>
        </Pressable>
        <SVG
          source={chevronRightSVG}
          style={{ width: 16, margin: "0 20" }}
          color={neutral77}
        />
        <Pressable
          style={singleBoxStyle}
          onPress={() => {
            GigStep.Description <= step && setCurrentStep(GigStep.Description);
          }}
        >
          <BrandText style={getStepStyle(GigStep.Description, "circle")}>
            3
          </BrandText>
          <BrandText style={getStepStyle(GigStep.Description, "title")}>
            Description & FAQ
          </BrandText>
        </Pressable>
        <SVG
          source={chevronRightSVG}
          style={{ width: 16, margin: "0 20" }}
          color={neutral77}
        />
        <Pressable
          style={singleBoxStyle}
          onPress={() => {
            GigStep.Requirement <= step && setCurrentStep(GigStep.Requirement);
          }}
        >
          <BrandText style={getStepStyle(GigStep.Requirement, "circle")}>
            4
          </BrandText>
          <BrandText style={getStepStyle(GigStep.Requirement, "title")}>
            Requirement
          </BrandText>
        </Pressable>
        <SVG
          source={chevronRightSVG}
          style={{ width: 16, margin: "0 20" }}
          color={neutral77}
        />
        <Pressable
          style={singleBoxStyle}
          onPress={() => {
            GigStep.Gallery <= step && setCurrentStep(GigStep.Gallery);
          }}
        >
          <BrandText style={getStepStyle(GigStep.Gallery, "circle")}>
            5
          </BrandText>
          <BrandText style={getStepStyle(GigStep.Gallery, "title")}>
            Gallery
          </BrandText>
        </Pressable>
        <SVG
          source={chevronRightSVG}
          style={{ width: 16, margin: "0 20" }}
          color={neutral77}
        />
        <Pressable
          style={singleBoxStyle}
          onPress={() => {
            GigStep.Publish <= step && setCurrentStep(GigStep.Publish);
          }}
        >
          <BrandText style={getStepStyle(GigStep.Publish, "circle")}>
            6
          </BrandText>
          <BrandText style={getStepStyle(GigStep.Publish, "title")}>
            Publish
          </BrandText>
        </Pressable>
      </View>
      <View style={divideLineStyle} />
    </View>
  );
};
