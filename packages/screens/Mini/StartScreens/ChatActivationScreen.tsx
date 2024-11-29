import React from "react";
import { SafeAreaView, useWindowDimensions, View } from "react-native";

import messengerSVG from "../../../../assets/icons/messenger.svg";

import { BrandText } from "@/components/BrandText";
import { SVG } from "@/components/SVG";
import { CustomButton } from "@/components/buttons/CustomButton";
import { useAppMode } from "@/hooks/useAppMode";
import { ScreenFC } from "@/utils/navigation";
import { neutral77 } from "@/utils/style/colors";
import {
  fontMedium16,
  fontSemibold16,
  fontSemibold30,
} from "@/utils/style/fonts";
import { layout } from "@/utils/style/layout";
import { checkAndBootWeshModule } from "@/weshnet/services";

export const ChatActivationScreen: ScreenFC<"ChatActivation"> = ({
  navigation,
  route,
}) => {
  const { width: windowWidth } = useWindowDimensions();
  const [, handleSet] = useAppMode();

  const onActivatePress = () => {
    navigation.navigate("NativeWallet");
    checkAndBootWeshModule();
    handleSet(route.params.appMode);
  };

  const onNotNowPress = () => {
    navigation.navigate("NativeWallet");
    handleSet(route.params.appMode);
  };
  return (
    <SafeAreaView
      style={{
        flex: 1,
        width: "100%",
        backgroundColor: "#000000",
        alignItems: "center",
      }}
    >
      <View
        style={{
          justifyContent: "center",
          alignItems: "center",
          flex: 1,
          width: 233,
        }}
      >
        <SVG
          source={messengerSVG}
          height={148}
          width={148}
          style={{ marginBottom: layout.spacing_x4 }}
        />
        <BrandText
          style={[fontSemibold16, { marginBottom: layout.spacing_x0_5 }]}
        >
          Do you want to active
        </BrandText>
        <BrandText
          style={[
            fontSemibold30,
            {
              textAlign: "center",
              marginBottom: layout.spacing_x2,
            },
          ]}
        >
          Decentralized Messenger?
        </BrandText>
        <BrandText
          style={[
            fontMedium16,
            {
              color: neutral77,
              textAlign: "center",
              marginBottom: layout.spacing_x2,
              lineHeight: 22,
              paddingHorizontal: layout.spacing_x1_5,
            },
          ]}
        >
          Decentralized Messenger is experimental, spend a lot of battery with
          Bluetooth & Wifi to look for peers around you.
        </BrandText>
        <BrandText
          style={[
            fontMedium16,
            {
              color: neutral77,
              textAlign: "center",
              lineHeight: 22,
              paddingHorizontal: layout.spacing_x2,
            },
          ]}
        >
          You can activate and deactivate it when you want to save battery and
          use it only when you want!
        </BrandText>
      </View>
      <View
        style={{
          position: "absolute",
          bottom: 50,
          left: 10,
          right: 10,
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        <CustomButton
          title="Activate"
          onPress={onActivatePress}
          width={windowWidth / 2 - 16}
        />
        <CustomButton
          title="Not Now"
          type="gray"
          onPress={onNotNowPress}
          width={windowWidth / 2 - 16}
        />
      </View>
    </SafeAreaView>
  );
};
