import { BlurView } from "expo-blur";
import React, { ReactNode } from "react";
import { Dimensions, SafeAreaView, View } from "react-native";

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
  title?: string;
  onGoBack?: () => void;
  reverseView?: boolean;
  background?: string;
  customHeader?: ReactNode;
};

export const SettingBase = ({
  children,
  title,
  onGoBack,
  reverseView = true,
  background = "#000",
  customHeader,
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
        width: Dimensions.get("window").width,
        backgroundColor: "rgba(0, 0, 0, .5)",
        position: "relative",
      }}
    >
      <BlurView
        tint="dark"
        style={{
          position: "absolute",
          zIndex: 0,
          width: Dimensions.get("window").width,
          height: "100%",
        }}
      />
      <View
        style={{
          flex: 1,
        }}
      >
        {customHeader ? (
          customHeader
        ) : (
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
            <BrandText style={[fontSemibold18]}>
              {title || "Settings"}
            </BrandText>

            <CustomPressable onPress={onClose} style={{}}>
              <SVG source={closeSVG} height={28} width={28} />
            </CustomPressable>
          </View>
        )}

        <View
          style={{
            flex: 1,
            justifyContent: reverseView ? "flex-end" : "flex-start",
          }}
        >
          <View
            style={{
              width: Dimensions.get("window").width,
              backgroundColor: background,
            }}
          >
            {children}
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};
