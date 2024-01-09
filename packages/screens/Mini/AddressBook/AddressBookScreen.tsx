import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { FlatList } from "react-native";

import ListView from "./components/ListView";
import AddNewSvg from "../../../../assets/icons/add-circle-filled.svg";
import closeSVG from "../../../../assets/icons/close.svg";
import { BrandText } from "../../../components/BrandText";
import { SVG } from "../../../components/SVG";
import { CustomPressable } from "../../../components/buttons/CustomPressable";
import { Separator } from "../../../components/separators/Separator";
import { SpacerColumn } from "../../../components/spacer";
import { RootStackParamList } from "../../../utils/navigation";
import { neutralA3 } from "../../../utils/style/colors";
import { fontNormal15 } from "../../../utils/style/fonts";
import { layout } from "../../../utils/style/layout";
import MiniHeader from "../Notifications/components/MiniHeader";
import { SettingBase } from "../Settings/components/SettingBase";

type AddressBookScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, "AddressBook">;
};

export type AddressBookType = {
  id: string;
  label: string;
  address: string;
};

export default function AddressBookScreen({
  navigation,
}: AddressBookScreenProps) {
  const onClose = () =>
    navigation.canGoBack()
      ? navigation.goBack()
      : navigation.replace("MiniTabs");

  const addresses: AddressBookType[] = [
    { id: "asdfdasd", label: "Defi1", address: "fadfd..sdf" },
    { id: "asdfdasd8989", label: "Defi2", address: "fadfd..sdf" },
  ];

  return (
    <SettingBase
      customHeader={
        <MiniHeader
          navigation={navigation}
          backEnabled
          title="Address Book"
          right={
            <CustomPressable onPress={onClose}>
              <SVG source={closeSVG} width={24} height={24} />
            </CustomPressable>
          }
        />
      }
    >
      {!addresses.length ? (
        <BrandText
          style={[
            fontNormal15,
            {
              color: neutralA3,
              paddingTop: layout.spacing_x2,
              paddingHorizontal: layout.spacing_x1_5,
            },
          ]}
        >
          No Address to Display
        </BrandText>
      ) : (
        <FlatList
          inverted
          data={addresses.reverse()}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <ListView
              onPress={() =>
                navigation.navigate("EditAddressBook", {
                  addressId: item.id,
                })
              }
              style={{
                paddingHorizontal: layout.spacing_x1_5,
              }}
              options={{
                label: item?.label,
                iconEnabled: false,
                rightLabel: item?.address,
              }}
            />
          )}
        />
      )}
      <SpacerColumn size={1.5} />
      <Separator />
      <ListView
        onPress={() => navigation.navigate("AddAddressBook")}
        style={{
          paddingVertical: layout.spacing_x4,
          paddingHorizontal: layout.spacing_x1_5,
        }}
        options={{
          label: "Add Network",
          leftIconEnabled: true,
          leftIconOptions: {
            icon: AddNewSvg,
            fill: "#fff",
          },
        }}
      />
    </SettingBase>
  );
}
