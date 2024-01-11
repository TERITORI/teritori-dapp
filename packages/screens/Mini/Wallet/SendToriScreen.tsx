import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useState } from "react";
import { View } from "react-native";

import closeSVG from "../../../../assets/icons/close.svg";
import teritoriSVG from "../../../../assets/icons/teritori-white.svg";
import { BrandText } from "../../../components/BrandText";
import { SVG } from "../../../components/SVG";
import { CustomPressable } from "../../../components/buttons/CustomPressable";
import { SpacerColumn, SpacerRow } from "../../../components/spacer";
import { RootStackParamList } from "../../../utils/navigation";
import { neutral39, neutral77 } from "../../../utils/style/colors";
import {
  fontMedium13,
  fontMedium15,
  fontMedium16,
} from "../../../utils/style/fonts";
import { layout } from "../../../utils/style/layout";
import CircularImgOrIcon from "../AddressBook/components/CircularImgOrIcon";
import MiniButton from "../AddressBook/components/MiniButton";
import MiniTextInput from "../AddressBook/components/MiniTextInput";
import MiniHeader from "../Notifications/components/MiniHeader";
import { SettingBase } from "../Settings/components/SettingBase";
import MiniTextInputWithDropdown from "../components/MiniTextInputWithDropdown";

type SendToriScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, "MiniSendTori">;
};

const tokenOptions = [
  {
    label: "Defi",
    subLabel: "f1du...2d6a",
    value: "f1duasdjfanjansjbasd2d6a",
  },
  {
    label: "Defi1",
    subLabel: "f1du...2d6aasdf",
    value: "f1dunasdhjfashdf2d6aasdf",
  },
];

const BALANCE = 62424;

export default function SendToriScreen({ navigation }: SendToriScreenProps) {
  const [address, setAddress] = useState("");
  const [amount, setAmount] = useState("");

  const onClose = () =>
    navigation.canGoBack()
      ? navigation.goBack()
      : navigation.replace("MiniTabs");

  return (
    <SettingBase
      background="transparent"
      reverseView={false}
      customHeader={
        <MiniHeader
          navigation={navigation}
          backEnabled
          title="Send TORI"
          headerStyle={{ backgroundColor: "transparent" }}
          right={
            <CustomPressable onPress={onClose}>
              <SVG source={closeSVG} width={24} height={24} />
            </CustomPressable>
          }
        />
      }
    >
      <View
        style={{
          width: "100%",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <SpacerColumn size={10} />
        <CircularImgOrIcon
          style={{ alignItems: "center", justifyContent: "center" }}
          icon={teritoriSVG}
        />
      </View>
      <View
        style={{
          justifyContent: "space-between",
          backgroundColor: "rgba(0,0,0,0.8)",
          paddingHorizontal: layout.spacing_x1_5,
          height: "70%",
        }}
      >
        <View>
          <SpacerColumn size={3} />

          <MiniTextInputWithDropdown
            options={tokenOptions}
            value={address}
            onChangeText={(value) => setAddress(value)}
          />

          <SpacerColumn size={1} />

          <MiniTextInput
            placeholder="Amount"
            keyboardType="numeric"
            type="number"
            value={amount}
            onChangeText={(value) => setAmount(value)}
            right={
              <CustomPressable onPress={() => setAmount(BALANCE.toString())}>
                <View style={{ alignItems: "center", flexDirection: "row" }}>
                  <BrandText style={[fontMedium15, { color: neutral77 }]}>
                    TORI
                  </BrandText>
                  <SpacerRow size={1.5} />
                  <View
                    style={{
                      backgroundColor: neutral39,
                      borderRadius: 18,
                      paddingHorizontal: 14,
                      paddingVertical: 4,
                    }}
                  >
                    <BrandText style={fontMedium16}>Max</BrandText>
                  </View>
                </View>
              </CustomPressable>
            }
          />

          <SpacerColumn size={1.5} />
          <BrandText style={[fontMedium13, { color: neutral77 }]}>
            Balance: {BALANCE} TORI
          </BrandText>
        </View>
        <MiniButton
          title="Next"
          onPress={() =>
            navigation.replace("MiniSendingTori", { back: "MiniSendTori" })
          }
        />
      </View>
    </SettingBase>
  );
}
