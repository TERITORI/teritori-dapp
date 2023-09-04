import React from "react";
import { Pressable, StyleSheet, View } from "react-native";

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

  const generalStyles = StyleSheet.create({
    headerContainer: {
      marginTop: 24,
      flexDirection: "column",
    },
    stepContainer: {
      flexDirection: "row",
      alignItems: "center",
    },
    singleBox: {
      flexDirection: "row",
      alignItems: "center",
    },
    divideLine: {
      height: 1,
      width: "100%",
      backgroundColor: neutral33,
      marginTop: layout.spacing_x2,
      marginBottom: layout.spacing_x3,
    },
  });

  const stepStyles = StyleSheet.create({
    currentTitle: StyleSheet.flatten([
      fontSemibold14,
      {
        color: primaryColor,
      },
    ]),
    currentCircle: StyleSheet.flatten([
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
    ]),
    nextTitle: StyleSheet.flatten([
      fontSemibold14,
      {
        color: neutral77,
      },
    ]),
    nextCircle: StyleSheet.flatten([
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
    ]),
    previousTitle: StyleSheet.flatten([
      fontSemibold14,
      {
        color: secondaryColor,
      },
    ]),
    previousCircle: StyleSheet.flatten([
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
    ]),
  });

  const getStepStyle = (gigStep: GigStep, content: string): any => {
    let targetStyles: any;

    if (gigStep === currentStep) {
      targetStyles =
        content === "circle"
          ? stepStyles.currentCircle
          : stepStyles.currentTitle;
    } else {
      if (gigStep < currentStep) {
        targetStyles =
          content === "circle"
            ? stepStyles.previousCircle
            : stepStyles.previousTitle;
      } else {
        targetStyles =
          content === "circle" ? stepStyles.nextCircle : stepStyles.nextTitle;
      }
    }

    return targetStyles;
  };

  return (
    <View style={generalStyles.headerContainer}>
      <View style={generalStyles.stepContainer}>
        <Pressable
          style={generalStyles.singleBox}
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
          style={generalStyles.singleBox}
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
          style={generalStyles.singleBox}
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
          style={generalStyles.singleBox}
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
          style={generalStyles.singleBox}
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
          style={generalStyles.singleBox}
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
      <View style={generalStyles.divideLine} />
    </View>
  );
};
