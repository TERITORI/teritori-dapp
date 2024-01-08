import {
  NativeStackNavigationProp,
  NativeStackScreenProps,
} from "@react-navigation/native-stack";
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
import { useEffect, useState } from "react";
import { AddressBookType } from "./AddressBookScreen";

interface AddressBookScreenProps
  extends NativeStackScreenProps<RootStackParamList, "EditAddressBook"> {}

const addresses: AddressBookType[] = [
  { id: "asdfdasd", label: "Defi1", address: "fadfd..sdf" },
  { id: "asdfdasd8989", label: "Defi2", address: "fadfd..sdf" },
];

export default function EditAddressBookScreen({
  navigation,
  route,
}: AddressBookScreenProps) {
  const onClose = () =>
    navigation.canGoBack()
      ? navigation.goBack()
      : navigation.replace("MiniTabs");

  const [address, setAddress] = useState<{ label: string; address: string }>({
    label: "",
    address: "",
  });
  const { addressId } = route.params;

  useEffect(() => {
    const filteredAddress = addresses.filter((item) => item.id === addressId);

    if (filteredAddress.length) {
      setAddress(filteredAddress[0]);
    }
  }, [addressId]);

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
          title="Edit Address"
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
          justifyContent: "space-between",
          width: Dimensions.get("window").width,
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
          <MiniTextInput placeholder="Label" value={address.label} />

          <SpacerColumn size={1} />
          <MiniTextInput placeholder="Address" value={address.address} />
        </View>

        <MiniButton title="Save" />
      </View>
    </ScreenContainer>
  );
}
