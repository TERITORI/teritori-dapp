import { useState } from "react";
import { View } from "react-native";

import teritoriSVG from "../../../../assets/icons/teritori-white.svg";
import { BrandText } from "../../../components/BrandText";
import { CustomPressable } from "../../../components/buttons/CustomPressable";
import { SpacerColumn, SpacerRow } from "../../../components/spacer";
import { ScreenFC } from "../../../utils/navigation";
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
import { BlurScreenContainer } from "../components/BlurScreenContainer";
import MiniTextInputWithDropdown from "../components/MiniTextInputWithDropdown";

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

const SendToriScreen: ScreenFC<"MiniSendTori"> = ({ navigation }) => {
  const [address, setAddress] = useState("");
  const [amount, setAmount] = useState("");

  const onClose = () =>
    navigation.canGoBack()
      ? navigation.replace("MiniSelectToken", { navigateTo: "MiniSendTori" })
      : navigation.replace("MiniTabs");

  return (
    <BlurScreenContainer
      title="Send TORI"
      reverseView={false}
      background="transparent"
      onGoBack={onClose}
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
    </BlurScreenContainer>
  );
};

export default SendToriScreen;
