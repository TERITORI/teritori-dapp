import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { View } from "react-native";

import chevronDownSVG from "../../../../assets/icons/chevron-down-white.svg";
import closeSVG from "../../../../assets/icons/close.svg";
import teritoriCircleSVG from "../../../../assets/icons/tori-circle.svg";
import { Dropdown } from "../../../components/Dropdown";
import { SVG } from "../../../components/SVG";
import { CustomPressable } from "../../../components/buttons/CustomPressable";
import { SpacerColumn } from "../../../components/spacer";
import { RootStackParamList } from "../../../utils/navigation";
import { secondaryColor } from "../../../utils/style/colors";
import { fontMedium16 } from "../../../utils/style/fonts";
import { layout } from "../../../utils/style/layout";
import MiniButton from "../AddressBook/components/MiniButton";
import MiniHeader from "../Notifications/components/MiniHeader";
import { SettingBase } from "../Settings/components/SettingBase";
import RowDisplay from "../components/RowDisplay";

type SendingToriScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, "MiniSendingTori">;
};

export default function SendingToriScreen({
  navigation,
}: SendingToriScreenProps) {
  const onClose = () =>
    navigation.canGoBack()
      ? navigation.goBack()
      : navigation.replace("MiniTabs");

  return (
    <SettingBase
      background="transparent"
      customHeader={
        <MiniHeader
          navigation={navigation}
          backEnabled
          title="Sending TORI"
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
          justifyContent: "space-between",
        }}
      >
        <SpacerColumn size={10} />
      </View>
      <View
        style={{
          justifyContent: "space-between",
          paddingHorizontal: layout.spacing_x1_5,
          height: "90%",
        }}
      >
        <View style={{ flex: 1 }}>
          <RowDisplay
            leftLabel={
              <SVG source={teritoriCircleSVG} width={28} height={28} />
            }
            rightLabel="2000 TORI"
          />

          <SpacerColumn size={2} />

          <Dropdown
            positionStyle={{ width: "100%", top: 45 }}
            triggerComponent={
              <View style={{ alignItems: "center" }}>
                <SVG source={chevronDownSVG} width={28} height={28} />
              </View>
            }
          >
            <View style={{ flex: 1 }}>
              <RowDisplay
                leftLabel="g10nz0wchvkkj7rr09vcxj5rpt2mfdj056yd2ehvnd"
                leftLabelStyle={{ color: secondaryColor }}
              />
              <SpacerColumn size={1.5} />
              <RowDisplay
                leftLabel="Network Fee"
                rightLabel="0.0000001 TORI"
                rightLabelStyle={fontMedium16}
              />
            </View>
          </Dropdown>
        </View>

        <MiniButton title="Send" onPress={() => navigation.goBack()} />
      </View>
    </SettingBase>
  );
}
