import { useEffect, useState } from "react";
import { View } from "react-native";

import { AddressBookType } from "./AddressBookScreen";
import CircularImgOrIcon from "./components/CircularImgOrIcon";
import MiniButton from "./components/MiniButton";
import MiniTextInput from "./components/MiniTextInput";
import addSVG from "../../../../assets/icons/add-circle-outline.svg";
import closeSVG from "../../../../assets/icons/close.svg";
import { SVG } from "../../../components/SVG";
import { CustomPressable } from "../../../components/buttons/CustomPressable";
import { SpacerColumn } from "../../../components/spacer";
import { ScreenFC } from "../../../utils/navigation";
import MiniHeader from "../Notifications/components/MiniHeader";
import { SettingBase } from "../Settings/components/SettingBase";

const addresses: AddressBookType[] = [
  { id: "asdfdasd", label: "Defi1", address: "fadfd..sdf" },
  { id: "asdfdasd8989", label: "Defi2", address: "fadfd..sdf" },
];

const EditAddressBookScreen: ScreenFC<"EditAddressBook"> = ({
  navigation,
  route,
}) => {
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
    <SettingBase
      background="transparent"
      reverseView={false}
      customHeader={
        <MiniHeader
          navigation={navigation}
          backEnabled
          title="Edit Address"
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
          icon={addSVG}
        />
      </View>
      <View
        style={{
          justifyContent: "space-between",
          backgroundColor: "rgba(0,0,0,0.8)",
          height: "70%",
        }}
      >
        <View>
          <SpacerColumn size={3} />
          <MiniTextInput placeholder="Label" value={address.label} />

          <SpacerColumn size={1} />
          <MiniTextInput placeholder="Address" value={address.address} />
        </View>
        <MiniButton title="Save" />
      </View>
    </SettingBase>
  );
};

export default EditAddressBookScreen;
