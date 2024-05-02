import React, { Dispatch, FC, useRef } from "react";
import {
  LayoutChangeEvent,
  ScrollView,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";

import ChevronRightSvg from "@/assets/icons/chevron-right.svg";
import { BrandText } from "@/components/BrandText";
import { SVG } from "@/components/SVG";
import { PrimaryBox } from "@/components/boxes/PrimaryBox";
import { useIsMobile } from "@/hooks/useIsMobile";
import {
  neutral17,
  neutral22,
  neutral77,
  primaryColor,
  primaryTextColor,
} from "@/utils/style/colors";
import { fontSemibold14 } from "@/utils/style/fonts";
import { layout } from "@/utils/style/layout";
export type LaunchpadCreateStepKey = number;
export interface LaunchpadCreateStep {
  key: LaunchpadCreateStepKey;
  title: string;
}

interface LaunchpadStepperProps {
  selectedStepKey: LaunchpadCreateStepKey;
  steps: LaunchpadCreateStep[];
  setSelectedStepKey: Dispatch<React.SetStateAction<LaunchpadCreateStepKey>>;
}

export const LaunchpadStepper: FC<LaunchpadStepperProps> = ({
  selectedStepKey,
  steps,
  setSelectedStepKey,
}) => {
  const { width: windowWidth } = useWindowDimensions();
  const scrollViewRef = useRef<ScrollView>(null);
  const isMobile = useIsMobile();

  const onSelectedItemLayout = (e: LayoutChangeEvent) => {
    scrollViewRef.current?.scrollTo({
      x: e.nativeEvent.layout.x,
      animated: false,
    });
  };

  return (
    <PrimaryBox
      style={{
        flexDirection: "row",
        alignItems: "center",
        height: 56,
        backgroundColor: neutral17,
        justifyContent: "center",
        marginHorizontal: isMobile ? 0 : layout.spacing_x3,
        borderWidth: 0,
      }}
    >
      <ScrollView
        ref={scrollViewRef}
        showsHorizontalScrollIndicator={false}
        horizontal
        contentContainerStyle={{
          alignItems: "center",
          width: "100%",
          justifyContent: "center",
        }}
      >
        <View
          style={[
            windowWidth >= 1240 && { justifyContent: "center" },
            {
              flexDirection: "row",
              width: "100%",
            },
          ]}
        >
          {steps.map((step, index) => {
            const isSelected = selectedStepKey === step.key;
            return (
              <TouchableOpacity
                key={step.key}
                onLayout={(e) => {
                  if (isSelected) onSelectedItemLayout(e);
                }}
                onPress={() => setSelectedStepKey(step.key)}
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
                    backgroundColor: isSelected ? primaryColor : neutral22,
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
                        color: isSelected ? primaryTextColor : neutral77,
                      },
                    ]}
                  >
                    {step.key}
                  </BrandText>
                </View>
                <BrandText
                  style={[
                    fontSemibold14,
                    {
                      lineHeight: layout.spacing_x2,
                      marginLeft: 12,
                      color: isSelected ? primaryColor : neutral77,
                      marginRight: layout.spacing_x2,
                    },
                  ]}
                >
                  {step.title}
                </BrandText>
                {steps.length !== index + 1 && (
                  <SVG
                    source={ChevronRightSvg}
                    width={16}
                    height={16}
                    color={neutral77}
                  />
                )}
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>
    </PrimaryBox>
  );
};
