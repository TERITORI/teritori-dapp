import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Dimensions, View, FlatList } from "react-native";

import ListView from "./components/ListView";
import AddNewSvg from "../../../../assets/icons/add-circle-filled.svg";
import closeSVG from "../../../../assets/icons/close.svg";
import { BrandText } from "../../../components/BrandText";
import { SVG } from "../../../components/SVG";
import { ScreenContainer } from "../../../components/ScreenContainer";
import { CustomPressable } from "../../../components/buttons/CustomPressable";
import { Separator } from "../../../components/separators/Separator";
import { SpacerColumn } from "../../../components/spacer";
import { RootStackParamList } from "../../../utils/navigation";
import { neutralA3 } from "../../../utils/style/colors";
import { fontNormal15 } from "../../../utils/style/fonts";
import { layout } from "../../../utils/style/layout";
import MiniHeader from "../Notifications/components/MiniHeader";

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
          title="Address Book"
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
          justifyContent: "flex-end",
          width: Dimensions.get("window").width,
          backgroundColor: "rgba(0,0,0,0.5)",
          paddingHorizontal: layout.spacing_x1_5,
        }}
      >
        {!addresses.length ? (
          <BrandText style={[fontNormal15, { color: neutralA3 }]}>
            No Address to Display
          </BrandText>
        ) : (
          <FlatList
            inverted
            style={{ flex: 1 }}
            data={addresses.reverse()}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <ListView
                onPress={() =>
                  navigation.navigate("EditAddressBook", { addressId: item.id })
                }
                style={{ paddingVertical: layout.spacing_x1_5 }}
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
          style={{ paddingVertical: layout.spacing_x3 }}
          options={{
            label: "Add Network",
            leftIconEnabled: true,
            leftIconOptions: {
              icon: AddNewSvg,
              fill: "#fff",
            },
          }}
        />
      </View>
    </ScreenContainer>
  );
}
