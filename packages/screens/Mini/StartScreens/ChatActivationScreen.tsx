import React from "react";
import { Dimensions, SafeAreaView, View } from "react-native";

import messengerSVG from "../../../../assets/icons/messenger.svg";
import { BrandText } from "../../../components/BrandText";
import { SVG } from "../../../components/SVG";
import { ScreenFC } from "../../../utils/navigation";
import { neutral77 } from "../../../utils/style/colors";
import {
  fontMedium16,
  fontSemibold16,
  fontSemibold30,
} from "../../../utils/style/fonts";
import { layout } from "../../../utils/style/layout";
import { CustomButton } from "../components/CustomButton";

export const ChatActivationScreen: ScreenFC<"ChatActivation"> = ({
  navigation,
}) => {
  const onActivatePress = () => {
    navigation.navigate("NativeWallet");
  };
  const onNotNowPress = () => {
    navigation.navigate("NativeWallet");
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
          width={Dimensions.get("window").width / 2 - 16}
        />
        <CustomButton
          title="Not Now"
          type="gray"
          onPress={onNotNowPress}
          width={Dimensions.get("window").width / 2 - 16}
        />
      </View>
    </SafeAreaView>
  );
};
