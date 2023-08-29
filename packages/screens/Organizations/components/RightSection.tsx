import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  Pressable,
  View,
  ActivityIndicator,
  Animated,
  ViewStyle,
  TextStyle,
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
  // variables
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
      !u.includes(currentStep) ? [...u, currentStep] : u
    );
  }, [currentStep]);

  useEffect(() => {
    Animated.timing(loadingPercentAnim, {
      toValue: percentage,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, [percentage, loadingPercentAnim]);

  // returns
  const SignatureProcess = useCallback(
    ({ title, completeText, isComplete }: LaunchingProcessStepType) => (
      <View style={signatureProcessStyle}>
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
    []
  );

  return (
    <View style={containerStyle}>
      <View style={topSectionStyle}>
        <View style={topRowStyle}>
          <BrandText style={fontSemibold14}>
            {isLaunching ? "Launching your organization" : percentageText}
          </BrandText>
          {!isLaunching && (
            <BrandText style={progressTextStyle}>
              {`${currentStep + 1}/${steps.length}`}
            </BrandText>
          )}
        </View>
        <Animated.View style={[progressBarStyle, { width: loadingWidth }]} />
      </View>
      <View style={sectionStyle}>
        <BrandText style={stepsTextStyle}>
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
              )
            )
          : steps.map((step, index) => (
              <Pressable
                key={step}
                style={stepStyle}
                disabled={index === steps.length - 1}
                onPress={
                  unlockedSteps.includes(index)
                    ? () => onStepChange(index)
                    : undefined
                }
              >
                <BrandText
                  style={[
                    stepTextStyle,
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

const containerStyle: ViewStyle = {
  width: 300,
  height: "100%",
  borderLeftWidth: 1,
  borderColor: neutral33,
};
const topSectionStyle: ViewStyle = {
  height: 64,
  position: "relative",
  borderBottomWidth: 1,
  borderColor: neutral33,
  justifyContent: "center",
};
const topRowStyle: ViewStyle = {
  justifyContent: "space-between",
  flexDirection: "row",
  paddingHorizontal: layout.padding_x2,
};
const signatureProcessStyle: ViewStyle = {
  flexDirection: "row",
  alignItems: "center",
  marginBottom: layout.padding_x1_5,
};
const progressTextStyle: TextStyle = {
  ...fontSemibold12,
  color: neutral77,
};
const stepsTextStyle: TextStyle = {
  ...fontSemibold14,
  color: neutral77,
  marginBottom: layout.padding_x2_5,
  textTransform: "uppercase",
};
const progressBarStyle: ViewStyle = {
  position: "absolute",
  bottom: 0,
  backgroundColor: primaryColor,
  height: 2,
};
const stepStyle: ViewStyle = { marginBottom: layout.padding_x2_5 };
const stepTextStyle: TextStyle = {
  ...fontSemibold14,
  color: neutralA3,
};
const sectionStyle: ViewStyle = { padding: layout.padding_x2 };
