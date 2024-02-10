import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import React, { ReactNode } from "react";
import { SafeAreaView, useWindowDimensions, View } from "react-native";

import chevronSVG from "../../../../assets/icons/chevron-left.svg";
import closeSVG from "../../../../assets/icons/close.svg";
import { BrandText } from "../../../components/BrandText";
import { SVG } from "../../../components/SVG";
import { CustomPressable } from "../../../components/buttons/CustomPressable";
import { fontSemibold18 } from "../../../utils/style/fonts";
import { MOBILE_HEADER_HEIGHT, layout } from "../../../utils/style/layout";

import { useAppNavigation } from "@/hooks/navigation/useAppNavigation";

type Props = {
  children: ReactNode;
  title?: string;
  onGoBack?: () => void;
  background?: string | "transparent";
  customHeader?: ReactNode;
};

export const BlurScreenContainer = ({
  children,
  title,
  onGoBack,
  background = "transparent",
  customHeader,
}: Props) => {
  const { width: windowWidth } = useWindowDimensions();
  const navigation = useAppNavigation();
  const onClose = () => navigation.goBack();
  const navigateToProfile = () => {
    if (onGoBack) {
      onGoBack();
    } else {
      navigation.replace("MiniProfile");
    }
  };

  return (
    <SafeAreaView
      style={{
        flex: 1,
        width: windowWidth,
        backgroundColor: "rgba(0, 0, 0, .2)",
        position: "relative",
      }}
    >
      <BlurView
        tint="dark"
        style={{
          position: "absolute",
          zIndex: 0,
          width: windowWidth,
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
        }}
      />
      <LinearGradient
        start={{ x: 1, y: 1 }}
        end={{ x: 1, y: 0 }}
        colors={[
          "rgba(0,0,0,1)",
          "rgba(0,0,0,1)",
          "rgba(0,0,0,0.6)",
          "rgba(0,0,0,0.2)",
        ]}
        style={{
          flex: 1,
          borderRadius: 6,
          position: "absolute",
          zIndex: 0,
          width: windowWidth,
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
        }}
      />
      <View
        style={{
          flex: 1,
        }}
      >
        {customHeader ? (
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              height: MOBILE_HEADER_HEIGHT,
            }}
          >
            {customHeader}
          </View>
        ) : (
          <View
            style={{
              width: "100%",
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              paddingHorizontal: layout.spacing_x2,
              height: MOBILE_HEADER_HEIGHT,
            }}
          >
            {onGoBack && (
              <CustomPressable onPress={navigateToProfile}>
                <SVG source={chevronSVG} height={24} width={24} />
              </CustomPressable>
            )}
            <BrandText style={[fontSemibold18, { lineHeight: 0 }]}>
              {title || "Settings"}
            </BrandText>

            <CustomPressable onPress={onClose}>
              <SVG source={closeSVG} height={24} width={24} />
            </CustomPressable>
          </View>
        )}

        <View
          style={{
            flex: 1,
            backgroundColor: background,
          }}
        >
          {children}
        </View>
      </View>
    </SafeAreaView>
  );
};
