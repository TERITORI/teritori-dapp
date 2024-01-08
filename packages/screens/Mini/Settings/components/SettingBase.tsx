import React, { ReactNode } from "react";
import { SafeAreaView, View } from "react-native";

import closeSVG from "../../../../../assets/icons/close.svg";
import { BrandText } from "../../../../components/BrandText";
import { SVG } from "../../../../components/SVG";
import { CustomPressable } from "../../../../components/buttons/CustomPressable";
import { BackButton } from "../../../../components/navigation/components/BackButton";
import { useAppNavigation } from "../../../../utils/navigation";
import { fontSemibold18 } from "../../../../utils/style/fonts";
import { layout } from "../../../../utils/style/layout";

type Props = {
  children: ReactNode;
  title: string;
  onGoBack?: () => void;
  reverseView?: boolean;
};

export const SettingBase = ({
  children,
  title,
  onGoBack,
  reverseView = true,
}: Props) => {
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
        width: "100%",
        backgroundColor: "rgba(0, 0, 0, .9)",
        position: "relative",
      }}
    >
      <View
        style={{
          flex: 1,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            paddingHorizontal: layout.spacing_x2,
          }}
        >
          {onGoBack && (
            <BackButton type="chevron" onPress={navigateToProfile} />
          )}
          <BrandText style={[fontSemibold18]}>{title || "Settings"}</BrandText>

          <CustomPressable onPress={onClose} style={{}}>
            <SVG source={closeSVG} height={28} width={28} />
          </CustomPressable>
        </View>

        <View
          style={{
            flex: 1,
            justifyContent: reverseView ? "flex-end" : "flex-start",
          }}
        >
          <View style={{ backgroundColor: "#000" }}>{children}</View>
        </View>
      </View>
    </SafeAreaView>
  );
};
