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
import { BrandText } from "../../BrandText";
import { SVG } from "../../SVG";

type GigCreationHeaderProps = {
  currentStep: number;
  setCurrentStep: any;
};

export const GigCreationHeader: React.FC<GigCreationHeaderProps> = ({
  currentStep,
  setCurrentStep,
}) => {
  const stepCircleSize = layout.padding_x4;

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
      marginTop: layout.padding_x2,
      marginBottom: layout.padding_x3,
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

  const getStepStyle = (step: number, content: string): any => {
    let targetStyles: any;

    if (step === currentStep) {
      targetStyles =
        content === "circle"
          ? stepStyles.currentCircle
          : stepStyles.currentTitle;
    } else {
      if (step < currentStep) {
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
          onPress={() => setCurrentStep(1)}
        >
          <BrandText style={getStepStyle(1, "circle")}>1</BrandText>
          <BrandText style={getStepStyle(1, "title")}>Overview</BrandText>
        </Pressable>
        <SVG
          source={chevronRightSVG}
          style={{ width: 16, margin: "0 20" }}
          color={neutral77}
        />
        <Pressable
          style={generalStyles.singleBox}
          onPress={() => setCurrentStep(2)}
        >
          <BrandText style={getStepStyle(2, "circle")}>2</BrandText>
          <BrandText style={getStepStyle(2, "title")}>Pricing</BrandText>
        </Pressable>
        <SVG
          source={chevronRightSVG}
          style={{ width: 16, margin: "0 20" }}
          color={neutral77}
        />
        <Pressable
          style={generalStyles.singleBox}
          onPress={() => setCurrentStep(3)}
        >
          <BrandText style={getStepStyle(3, "circle")}>3</BrandText>
          <BrandText style={getStepStyle(3, "title")}>Description</BrandText>
        </Pressable>
        <SVG
          source={chevronRightSVG}
          style={{ width: 16, margin: "0 20" }}
          color={neutral77}
        />
        <Pressable
          style={generalStyles.singleBox}
          onPress={() => setCurrentStep(4)}
        >
          <BrandText style={getStepStyle(4, "circle")}>4</BrandText>
          <BrandText style={getStepStyle(4, "title")}>Requirement</BrandText>
        </Pressable>
        <SVG
          source={chevronRightSVG}
          style={{ width: 16, margin: "0 20" }}
          color={neutral77}
        />
        <Pressable
          style={generalStyles.singleBox}
          onPress={() => setCurrentStep(5)}
        >
          <BrandText style={getStepStyle(5, "circle")}>5</BrandText>
          <BrandText style={getStepStyle(5, "title")}>Gallery</BrandText>
        </Pressable>
        <SVG
          source={chevronRightSVG}
          style={{ width: 16, margin: "0 20" }}
          color={neutral77}
        />
        <Pressable
          style={generalStyles.singleBox}
          onPress={() => setCurrentStep(6)}
        >
          <BrandText style={getStepStyle(6, "circle")}>6</BrandText>
          <BrandText style={getStepStyle(6, "title")}>Publish</BrandText>
        </Pressable>
      </View>
      <View style={generalStyles.divideLine} />
    </View>
  );
};
