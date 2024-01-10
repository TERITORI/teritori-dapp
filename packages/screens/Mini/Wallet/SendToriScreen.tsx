import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useState } from "react";
import { View } from "react-native";

import { Select } from "./components/Select";
import closeSVG from "../../../../assets/icons/close.svg";
import inputAddressSVG from "../../../../assets/icons/input-address.svg";
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

type SendToriScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, "MiniSendTori">;
};

type SelectedTokenType = {
  token: string;
  symbol: string;
  path: string;
  decimals: number;
};

const tokenOptions = [
  {
    label: "Defi",
    subLabel: "f1du...2d6a",
    value: "token",
    record: {
      token: "Defi",
      symbol: "TKN",
      path: "r/demo/token",
      decimals: 4,
    },
  },
];

export default function SendToriScreen({ navigation }: SendToriScreenProps) {
  const [selectedToken, setSelectedToken] = useState<SelectedTokenType | null>(
    null,
  );
  const [searchToken, setSearchToken] = useState("");

  const onSelectTokenChange = (value: string, record: typeof selectedToken) => {
    setSelectedToken(record);
  };

  const onSearchToken = (text: string) => {
    setSearchToken(text);
  };

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

          <Select
            enableIconAnimation={false}
            selected={selectedToken?.token || ""}
            onSelect={onSelectTokenChange}
            options={tokenOptions}
            onSearchChange={onSearchToken}
            searchValue={searchToken}
            placeholder="Recepient's Teritori Address"
            icon={inputAddressSVG}
          />

          <SpacerColumn size={1} />

          <MiniTextInput
            placeholder="Amount"
            right={
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
            }
          />

          <SpacerColumn size={1.5} />
          <BrandText style={[fontMedium13, { color: neutral77 }]}>
            Balance: 62,424 TORI
          </BrandText>
        </View>
        <MiniButton title="Next" />
      </View>
    </SettingBase>
  );
}
