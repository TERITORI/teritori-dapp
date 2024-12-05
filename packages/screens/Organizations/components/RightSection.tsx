import React, { useCallback, useEffect, useRef } from "react";
import {
  ActivityIndicator,
  Animated,
  Pressable,
  TextStyle,
  View,
  ViewStyle,
} from "react-native";

import checkCircleSVG from "../../../../assets/icons/check-circle.svg";

import { BrandText } from "@/components/BrandText";
import { SVG } from "@/components/SVG";
import { SpacerColumn } from "@/components/spacer";
import {
  neutral33,
  neutral77,
  neutralA3,
  primaryColor,
  secondaryColor,
} from "@/utils/style/colors";
import { fontSemibold12, fontSemibold14 } from "@/utils/style/fonts";
import { layout } from "@/utils/style/layout";
import {
  LAUNCHING_PROCESS_STEPS,
  LaunchingProcessStepType,
} from "@/utils/types/organizations";

interface RightSectionProps {
  steps: string[];
  currentStep: number;
  onStepChange: (step: number) => void;
  isLaunching?: boolean;
  launchingCompleteStep?: number;
  unlockedSteps: number[];
  setUnlockedSteps: React.Dispatch<React.SetStateAction<number[]>>;
}

export const RightSection: React.FC<RightSectionProps> = ({
  currentStep,
  steps,
  onStepChange,
  isLaunching,
  launchingCompleteStep,
  unlockedSteps,
  setUnlockedSteps,
}) => {
  const loadingPercentAnim = useRef(new Animated.Value(0)).current;

  const percentage = isLaunching
    ? launchingCompleteStep
      ? launchingCompleteStep / LAUNCHING_PROCESS_STEPS.length
      : 0
    : unlockedSteps.length / steps.length;
  const percentageText = `${(percentage * 100).toFixed(2)}%`;

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
  }, [currentStep, setUnlockedSteps]);

  useEffect(() => {
    Animated.timing(loadingPercentAnim, {
      toValue: percentage,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, [percentage, loadingPercentAnim]);

  const SignatureProcess = useCallback(
    ({ title, completeText, isComplete }: LaunchingProcessStepType) => (
      <View style={signatureProcessCStyle}>
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
    <View style={containerCStyle}>
      <View style={topSectionCStyle}>
        <View style={topRowCStyle}>
          <BrandText style={fontSemibold14}>
            {isLaunching ? "Launching your organization" : percentageText}
          </BrandText>
          {!isLaunching && (
            <BrandText style={progressTextCStyle}>
              {`${currentStep + 1}/${steps.length}`}
            </BrandText>
          )}
        </View>
        <Animated.View style={[progressBarCStyle, { width: loadingWidth }]} />
      </View>
      <View style={sectionCStyle}>
        <BrandText style={stepsTextCStyle}>
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
                style={stepCStyle}
                disabled={index === steps.length - 1}
                onPress={
                  unlockedSteps.includes(index)
                    ? () => onStepChange(index)
                    : undefined
                }
              >
                <BrandText
                  style={[
                    stepTextCStyle,
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

const containerCStyle: ViewStyle = {
  width: 300,
  height: "100%",
  borderLeftWidth: 1,
  borderColor: neutral33,
};

const topSectionCStyle: ViewStyle = {
  height: 64,
  position: "relative",
  borderBottomWidth: 1,
  borderColor: neutral33,
  justifyContent: "center",
};

const topRowCStyle: ViewStyle = {
  justifyContent: "space-between",
  flexDirection: "row",
  paddingHorizontal: layout.spacing_x2,
};

const signatureProcessCStyle: ViewStyle = {
  flexDirection: "row",
  alignItems: "center",
  marginBottom: layout.spacing_x1_5,
};

const progressTextCStyle: TextStyle = {
  ...fontSemibold12,
  color: neutral77,
};

const stepsTextCStyle: TextStyle = {
  ...fontSemibold14,
  color: neutral77,
  marginBottom: layout.spacing_x2_5,
  textTransform: "uppercase",
};

const progressBarCStyle: ViewStyle = {
  position: "absolute",
  bottom: 0,
  backgroundColor: primaryColor,
  height: 2,
};

const stepCStyle: ViewStyle = {
  marginBottom: layout.spacing_x2_5,
};

const stepTextCStyle: TextStyle = {
  ...fontSemibold14,
  color: neutralA3,
};

const sectionCStyle: ViewStyle = {
  padding: layout.spacing_x2,
};
