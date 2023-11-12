import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  Pressable,
  StyleSheet,
  View,
  ActivityIndicator,
  Animated,
} from "react-native";

import checkCircleSVG from "../../../../assets/icons/check-circle.svg";
import { BrandText } from "../../../components/BrandText";
import { SVG } from "../../../components/SVG";
import { SpacerColumn } from "../../../components/spacer";
import {
  neutral33,
  neutral77,
  neutralA3,
  primaryColor,
  secondaryColor,
} from "../../../utils/style/colors";
import { fontSemibold12, fontSemibold14 } from "../../../utils/style/fonts";
import { layout } from "../../../utils/style/layout";
import { LAUNCHING_PROCESS_STEPS } from "../OrganizationDeployerScreen";
import { LaunchingProcessStepType } from "../types";

interface RightSectionProps {
  steps: string[];
  currentStep: number;
  onStepChange: (step: number) => void;
  isLaunching?: boolean;
  launchingCompleteStep?: number;
}

export const RightSection: React.FC<RightSectionProps> = ({
  currentStep,
  steps,
  onStepChange,
  isLaunching,
  launchingCompleteStep,
}) => {
  const [unlockedSteps, setUnlockedSteps] = useState<number[]>([0]);
  const loadingPercentAnim = useRef(new Animated.Value(0)).current;

  const percentage = isLaunching
    ? launchingCompleteStep
      ? launchingCompleteStep / LAUNCHING_PROCESS_STEPS.length
      : 0
    : unlockedSteps.length / steps.length;
  const percentageText = `${percentage * 100}%`;

  const loadingWidth = loadingPercentAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 298],
    extrapolate: "clamp",
  });

  // hooks
  useEffect(() => {
    setUnlockedSteps((u) =>
      !u.includes(currentStep) ? [...u, currentStep] : u,
    );
  }, [currentStep]);

  useEffect(() => {
    Animated.timing(loadingPercentAnim, {
      toValue: percentage,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, [percentage, loadingPercentAnim]);

  const SignatureProcess = useCallback(
    ({ title, completeText, isComplete }: LaunchingProcessStepType) => (
      <View style={styles.signatureProcess}>
        {isComplete ? (
          <SVG source={checkCircleSVG} width={48} height={48} />
        ) : (
          <>
            <ActivityIndicator
              size="large"
              color={neutralA3}
              style={{
                width: 48,
                height: 48,
              }}
            />
          </>
        )}
        <SpacerColumn size={1.5} />

        <View>
          <BrandText
            style={[
              fontSemibold14,
              { color: isComplete ? secondaryColor : neutralA3 },
            ]}
          >
            {title}
          </BrandText>
          {isComplete && (
            <BrandText style={[fontSemibold12, { color: neutralA3 }]}>
              {completeText}
            </BrandText>
          )}
        </View>
      </View>
    ),
    [],
  );

  return (
    <View style={styles.container}>
      <View style={styles.topSection}>
        <View style={styles.topRow}>
          <BrandText style={fontSemibold14}>
            {isLaunching ? "Launching your organization" : percentageText}
          </BrandText>
          {!isLaunching && (
            <BrandText style={styles.progressText}>
              {`${currentStep + 1}/${steps.length}`}
            </BrandText>
          )}
        </View>
        <Animated.View style={[styles.progressBar, { width: loadingWidth }]} />
      </View>
      <View style={styles.section}>
        <BrandText style={styles.stepsText}>
          {isLaunching ? "Signature process" : `STEPS`}
        </BrandText>
        {isLaunching && launchingCompleteStep !== undefined
          ? LAUNCHING_PROCESS_STEPS.slice(0, launchingCompleteStep + 1).map(
              (launchStep, index) => (
                <SignatureProcess
                  key={`step-${index}`}
                  {...launchStep}
                  isComplete={index < launchingCompleteStep}
                />
              ),
            )
          : steps.map((step, index) => (
              <Pressable
                key={step}
                style={styles.step}
                disabled={index === steps.length - 1}
                onPress={
                  unlockedSteps.includes(index)
                    ? () => onStepChange(index)
                    : undefined
                }
              >
                <BrandText
                  style={[
                    styles.stepText,
                    unlockedSteps.includes(index) && { color: secondaryColor },
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

// FIXME: remove StyleSheet.create
// eslint-disable-next-line no-restricted-syntax
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
    paddingHorizontal: layout.spacing_x2,
  },
  signatureProcess: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: layout.spacing_x1_5,
  },
  progressText: StyleSheet.flatten([fontSemibold12, { color: neutral77 }]),
  stepsText: StyleSheet.flatten([
    fontSemibold14,
    {
      color: neutral77,
      marginBottom: layout.spacing_x2_5,
      textTransform: "uppercase",
    },
  ]),
  progressBar: {
    position: "absolute",
    bottom: 0,
    backgroundColor: primaryColor,
    height: 2,
  },
  step: { marginBottom: layout.spacing_x2_5 },
  stepText: StyleSheet.flatten([
    fontSemibold14,
    {
      color: neutralA3,
    },
  ]),
  section: { padding: layout.spacing_x2 },
});
