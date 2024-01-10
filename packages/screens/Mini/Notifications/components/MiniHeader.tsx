import { useRoute } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import React, { ReactNode } from "react";
import { StyleProp, View, ViewStyle } from "react-native";

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
  headerStyle?: StyleProp<ViewStyle>;
};

const MiniHeader = ({
  navigation,
  left,
  backEnabled,
  right,
  title,
  headerStyle,
}: HeaderProps) => {
  const route = useRoute();

  const navigateBack = () => {
    if (route.params?.back) {
      navigation.replace(route.params?.back);
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
          backgroundColor: neutral00,
          flexDirection: "row",
          justifyContent: "space-between",
          paddingVertical: layout.spacing_x1_5,
          paddingHorizontal: layout.spacing_x1_5,
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
