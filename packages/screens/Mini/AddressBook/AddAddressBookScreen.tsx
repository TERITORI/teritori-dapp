import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Dimensions, View } from "react-native";

import CircularImgOrIcon from "./components/CircularImgOrIcon";
import MiniButton from "./components/MiniButton";
import MiniTextInput from "./components/MiniTextInput";
import addSVG from "../../../../assets/icons/add-new.svg";
import closeSVG from "../../../../assets/icons/close.svg";
import { SVG } from "../../../components/SVG";
import { ScreenContainer } from "../../../components/ScreenContainer";
import { CustomPressable } from "../../../components/buttons/CustomPressable";
import { SpacerColumn } from "../../../components/spacer";
import { RootStackParamList } from "../../../utils/navigation";
import { layout } from "../../../utils/style/layout";
import MiniHeader from "../Notifications/components/MiniHeader";

type AddressBookScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, "AddressBook">;
};

export default function AddAddressBookScreen({
  navigation,
}: AddressBookScreenProps) {
  const onClose = () =>
    navigation.canGoBack()
      ? navigation.goBack()
      : navigation.replace("MiniTabs");

  return (
    <ScreenContainer
      headerChildren={<></>}
      responsive
      fullWidth
      footerChildren={null}
      noScroll
      headerMini={
        <MiniHeader
          navigation={navigation}
          backEnabled
          title="Add Address"
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
          flex: 1,
          width: Dimensions.get("window").width,
          justifyContent: "space-between",
          backgroundColor: "rgba(0,0,0,0.5)",
          paddingHorizontal: layout.spacing_x1_5,
        }}
      >
        <View>
          <View style={{ justifyContent: "center", alignItems: "center" }}>
            <SpacerColumn size={2} />
            <CircularImgOrIcon
              style={{ alignItems: "center", justifyContent: "center" }}
              icon={addSVG}
            />
          </View>

          <SpacerColumn size={3} />
          <MiniTextInput placeholder="Label" />

          <SpacerColumn size={1} />
          <MiniTextInput placeholder="Address" />
        </View>

        <MiniButton title="Add" />
      </View>
    </ScreenContainer>
  );
}
