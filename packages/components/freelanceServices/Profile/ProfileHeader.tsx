import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";

import chevronRightSVG from "../../../../assets/icons/chevron-right.svg";
import {
  neutral00,
  neutral22,
  neutral33,
  neutral77,
  primaryColor,
} from "../../../utils/style/colors";
import { fontSemibold14 } from "../../../utils/style/fonts";
import { ProfileStep } from "../../../utils/types/freelance";
import { BrandText } from "../../BrandText";
import { SVG } from "../../SVG";
const CompletionRate = ["0%", "25%", "50%", "75%"];

export const ProfileHeader: React.FC<{
  currentStep: ProfileStep;
  step: ProfileStep;
  setCurrentStep: (step: ProfileStep) => void;
}> = ({ currentStep, step, setCurrentStep }) => {
  return (
    <View
      style={{
        marginTop: 24,
        flexDirection: "column",
      }}
    >
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <TouchableOpacity
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
          }}
          onPress={() => {
            setCurrentStep(ProfileStep.PersonalInfo);
          }}
        >
          <BrandText
            style={
              ProfileStep.PersonalInfo <= step
                ? currentStyle.circle
                : nextStyle.circle
            }
          >
            1
          </BrandText>
          <BrandText
            style={[
              fontSemibold14,
              step <= ProfileStep.PersonalInfo
                ? currentStyle.text
                : nextStyle.text,
            ]}
          >
            Personal Info
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
            ProfileStep.ProfessionalInfo <= step &&
              setCurrentStep(ProfileStep.ProfessionalInfo);
          }}
        >
          <BrandText
            style={
              ProfileStep.ProfessionalInfo <= step
                ? currentStyle.circle
                : nextStyle.circle
            }
          >
            2
          </BrandText>
          <BrandText
            style={[
              fontSemibold14,
              ProfileStep.ProfessionalInfo <= step
                ? currentStyle.text
                : nextStyle.text,
            ]}
          >
            Professional Info
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
            ProfileStep.LinkedAccounts <= step &&
              setCurrentStep(ProfileStep.LinkedAccounts);
          }}
        >
          <BrandText
            style={
              ProfileStep.LinkedAccounts <= step
                ? currentStyle.circle
                : nextStyle.circle
            }
          >
            3
          </BrandText>
          <BrandText
            style={[
              fontSemibold14,
              ProfileStep.LinkedAccounts <= step
                ? currentStyle.text
                : nextStyle.text,
            ]}
          >
            Linked Accounts
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
            ProfileStep.AccountSecurity <= step &&
              setCurrentStep(ProfileStep.AccountSecurity);
          }}
        >
          <BrandText
            style={
              ProfileStep.AccountSecurity <= step
                ? currentStyle.circle
                : nextStyle.circle
            }
          >
            4
          </BrandText>
          <BrandText
            style={[
              fontSemibold14,
              ProfileStep.AccountSecurity <= step
                ? currentStyle.text
                : nextStyle.text,
            ]}
          >
            Account Security
          </BrandText>
        </TouchableOpacity>
        <View
          style={{
            right: 30,
            position: "absolute",
            width: 205,
            flexDirection: "column",
          }}
        >
          <View
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            <BrandText style={[fontSemibold14]}>Completion Rate</BrandText>
            <BrandText style={[fontSemibold14]}>
              {CompletionRate[step]}
            </BrandText>
          </View>
          <View
            style={{
              height: 2,
              borderRadius: 6,
              backgroundColor: neutral33,
              marginTop: 12,
            }}
          >
            <LinearGradient
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={{
                height: "100%",
                width: CompletionRate[step],
                borderRadius: 24,
              }}
              colors={["#5433FF", "#20BDFF", "#A5FECB"]}
            />
          </View>
        </View>
      </View>
      <View
        style={{
          width: "100%",
          height: 1,
          backgroundColor: neutral33,
          marginTop: 24,
          marginBottom: 24,
        }}
      />
    </View>
  );
};

const currentStyle = StyleSheet.create({
  circle: {
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
  text: { color: primaryColor },
});

const nextStyle = StyleSheet.create({
  circle: {
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
  text: { color: neutral77 },
});
