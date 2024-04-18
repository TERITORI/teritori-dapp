import React from "react";
import { TouchableOpacity, View } from "react-native";

import ChevronRightSvg from "@/assets/icons/chevron-right.svg";
import { BrandText } from "@/components/BrandText";
import { SVG } from "@/components/SVG";
import { PrimaryBox } from "@/components/boxes/PrimaryBox";
import {
  neutral17,
  neutral22,
  neutral77,
  primaryColor,
  primaryTextColor,
} from "@/utils/style/colors";
import { fontSemibold14 } from "@/utils/style/fonts";
import { layout } from "@/utils/style/layout";

export interface StepOption {
  key: number;
  title: string;
}

interface LaunchpadStepperProps {
  step: number;
  onStepPress: (item: number) => void;
  stepOptions: StepOption[];
}

export const LaunchpadStepper = ({
  step,
  onStepPress,
  stepOptions,
}: LaunchpadStepperProps) => {
  return (
    <PrimaryBox
      style={{
        flexDirection: "row",
        alignItems: "center",
        minHeight: 56,
        minWidth: 1290,
        backgroundColor: neutral17,
        justifyContent: "center",
        marginHorizontal: layout.spacing_x3,
        borderWidth: 0,
      }}
    >
      {stepOptions.map((item, index) => (
        <TouchableOpacity
          onPress={() => {
            onStepPress(item.key);
          }}
          key={index}
          style={[
            {
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              paddingHorizontal: layout.spacing_x2,
              paddingVertical: layout.spacing_x1,
            },
          ]}
        >
          {/*TODO: Get which step has invalid fields, show the warning and hide it when the step's fields are valid*/}
          {/*{!!item.invalidFields.length && (*/}
          {/*  <SVG*/}
          {/*    source={warningSVG}*/}
          {/*    height={24}*/}
          {/*    width={24}*/}
          {/*    style={{ position: "absolute", top: 0, left: 0, zIndex: 1 }}*/}
          {/*  />*/}
          {/*)}*/}
          <View
            style={{
              width: layout.iconButton,
              height: layout.iconButton,
              borderRadius: layout.iconButton / 2,
              backgroundColor: step === item.key ? primaryColor : neutral22,
              alignItems: "center",
              justifyContent: "center",
              marginRight: layout.spacing_x0_75,
            }}
          >
            <BrandText
              style={[
                fontSemibold14,
                {
                  lineHeight: layout.spacing_x2,
                  color: step === item.key ? primaryTextColor : neutral77,
                },
              ]}
            >
              {item.key}
            </BrandText>
          </View>
          <BrandText
            style={[
              fontSemibold14,
              {
                lineHeight: layout.spacing_x2,
                marginLeft: 12,
                color: step === item.key ? primaryColor : neutral77,
                marginRight: layout.spacing_x2,
              },
            ]}
          >
            {item.title}
          </BrandText>
          {stepOptions.length !== index + 1 && (
            <SVG
              source={ChevronRightSvg}
              width={16}
              height={16}
              color={neutral77}
            />
          )}
        </TouchableOpacity>
      ))}
    </PrimaryBox>
  );
};
