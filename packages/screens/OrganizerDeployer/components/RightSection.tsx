import React from "react";
import { Pressable, StyleSheet, View } from "react-native";

import { BrandText } from "../../../components/BrandText";
import {
  neutral33,
  neutral77,
  neutralA3,
  primaryColor,
} from "../../../utils/style/colors";
import { fontSemibold12, fontSemibold14 } from "../../../utils/style/fonts";
import { layout } from "../../../utils/style/layout";

interface RightSectionProps {
  steps: string[];
  currentStep: number;
}

export const RightSection: React.FC<RightSectionProps> = ({
  currentStep,
  steps,
}) => {
  // variables
  const percentage = `${Math.round(((currentStep + 1) / steps.length) * 100)}%`;

  // returns
  return (
    <View style={styles.container}>
      <View style={styles.topSection}>
        <View style={styles.topRow}>
          <BrandText style={fontSemibold14}>{percentage}</BrandText>
          <BrandText style={styles.progressText}>
            {`${currentStep + 1}/${steps.length}`}
          </BrandText>
        </View>
        <View style={[styles.progressBar, { width: percentage }]} />
      </View>
      <View style={styles.section}>
        <BrandText style={styles.stepsText}>STEPS</BrandText>
        {steps.map((step, index) => (
          <Pressable key={step} style={styles.step}>
            <BrandText
              style={[
                styles.stepText,
                currentStep === index && { color: primaryColor },
              ]}
            >
              {index + 1}. {step}
            </BrandText>
          </Pressable>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 300,
    height: "100%",
    borderLeftWidth: 1,
    borderColor: neutral33,
  },
  topSection: {
    height: 64,
    position: "relative",
    borderBottomWidth: 1,
    borderColor: neutral33,
    justifyContent: "center",
  },
  topRow: {
    justifyContent: "space-between",
    flexDirection: "row",
    paddingHorizontal: layout.padding_x2,
  },
  progressText: StyleSheet.flatten([fontSemibold12, { color: neutral77 }]),
  stepsText: StyleSheet.flatten([
    fontSemibold14,
    { color: neutral77, marginBottom: layout.padding_x2_5 },
  ]),
  progressBar: {
    position: "absolute",
    bottom: 0,
    backgroundColor: primaryColor,
    height: 2,
  },
  step: { marginBottom: layout.padding_x2_5 },
  stepText: StyleSheet.flatten([
    fontSemibold14,
    {
      color: neutralA3,
    },
  ]),
  section: { padding: layout.padding_x2 },
});
