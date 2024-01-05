import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import React, { ReactNode } from "react";
import { View } from "react-native";

import chevronLeftSVG from "../../../../../assets/icons/chevron-left.svg";
import { BrandText } from "../../../../components/BrandText";
import { SVG } from "../../../../components/SVG";
import { CustomPressable } from "../../../../components/buttons/CustomPressable";
import { SpacerRow } from "../../../../components/spacer";
import { RootStackParamList } from "../../../../utils/navigation";
import { neutral00 } from "../../../../utils/style/colors";
import { fontSemibold18 } from "../../../../utils/style/fonts";
import { MOBILE_HEADER_HEIGHT, layout } from "../../../../utils/style/layout";

type HeaderProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, any>;
  left?: ReactNode;
  backEnabled?: boolean;
  title?: string;
  right?: ReactNode;
};

const MiniHeader = ({
  navigation,
  left,
  backEnabled,
  right,
  title,
}: HeaderProps) => {
  const navigateBack = () =>
    navigation.canGoBack()
      ? navigation.goBack()
      : navigation.replace("MiniTabs");

  return (
    <View
      style={{
        backgroundColor: neutral00,
        flexDirection: "row",
        justifyContent: "space-between",
        paddingVertical: layout.spacing_x1_5,
        height: MOBILE_HEADER_HEIGHT,
        maxHeight: MOBILE_HEADER_HEIGHT,
        width: "100%",
        alignItems: "center",
        paddingHorizontal: layout.spacing_x1_5,
        position: "absolute",
        top: 0,
        zIndex: 9999,
      }}
    >
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        {backEnabled && (
          <CustomPressable onPress={navigateBack}>
            <SVG source={chevronLeftSVG} height={24} width={24} />
          </CustomPressable>
        )}
        {backEnabled && left && <SpacerRow size={1} />}
        {left && left}
      </View>
      {title && <BrandText style={fontSemibold18}>{title}</BrandText>}
      {right && right}
    </View>
  );
};

export default MiniHeader;
