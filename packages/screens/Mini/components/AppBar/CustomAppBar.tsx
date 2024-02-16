import React, { ReactNode } from "react";
import { StyleProp, View, ViewStyle } from "react-native";

import chevronLeftSVG from "../../../../../assets/icons/chevron-left.svg";

import { BrandText } from "@/components/BrandText";
import { SVG } from "@/components/SVG";
import { CustomPressable } from "@/components/buttons/CustomPressable";
import { SpacerRow } from "@/components/spacer";
import { useAppNavigation } from "@/hooks/navigation/useAppNavigation";
import { neutral00 } from "@/utils/style/colors";
import { fontSemibold18 } from "@/utils/style/fonts";
import { layout, MOBILE_HEADER_HEIGHT } from "@/utils/style/layout";

type HeaderProps = {
  left?: ReactNode;
  backEnabled?: boolean;
  title?: string;
  right?: ReactNode;
  headerStyle?: StyleProp<ViewStyle>;
  background?: string;
  onBack?: () => void;
};

const CustomAppBar = ({
  left,
  backEnabled,
  right,
  title,
  headerStyle,
  background,
  onBack,
}: HeaderProps) => {
  const navigation = useAppNavigation();

  const navigateBack = () => {
    if (onBack) {
      onBack();
      return;
    }

    if (navigation.canGoBack()) {
      navigation.goBack();
      return;
    }

    navigation.replace("MiniTabs");
  };

  return (
    <View
      style={[
        {
          backgroundColor: background ?? neutral00,
          flexDirection: "row",
          justifyContent: "space-between",
          paddingHorizontal: layout.spacing_x2,
          height: MOBILE_HEADER_HEIGHT,
          maxHeight: MOBILE_HEADER_HEIGHT,
          width: "100%",
          alignItems: "center",
          position: "absolute",
          top: 0,
          zIndex: 9999,
        },
        headerStyle,
      ]}
    >
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        {backEnabled && (
          <CustomPressable
            onPress={navigateBack}
            style={{ height: 24, width: 24 }}
          >
            <SVG source={chevronLeftSVG} height={24} width={24} />
          </CustomPressable>
        )}
        {backEnabled && left && <SpacerRow size={1} />}
        {left && left}
      </View>
      {title && (
        <BrandText
          style={[fontSemibold18, { marginLeft: layout.spacing_x1_5, flex: 1 }]}
        >
          {title}
        </BrandText>
      )}
      {right && right}
    </View>
  );
};

export default CustomAppBar;
