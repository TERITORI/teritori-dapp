import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { FlatList, View } from "react-native";

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
import ListView from "../AddressBook/components/ListView";
import Checkbox from "../Notifications/components/Checkbox";
import MiniHeader from "../Notifications/components/MiniHeader";
import { SettingBase } from "../components/SettingBase";

type ChangeNetworkScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, "ChangeNetwork">;
};

export type ChangeNetworkType = {
  id: string;
  label: string;
  url: string;
};

export default function ChangeNetworkScreen({
  navigation,
}: ChangeNetworkScreenProps) {
  const onClose = () =>
    navigation.canGoBack()
      ? navigation.goBack()
      : navigation.replace("MiniTabs");

  const addresses: ChangeNetworkType[] = [
    {
      id: "asdfdasd",
      label: "Testnet 3",
      url: "https://rpc.test3.teritori.com",
    },
    { id: "asdfdasd8989", label: "Local", url: "https://127.0.0.1:27000" },
    {
      id: "asdfdasd8989909",
      label: "Teritori-Testnet",
      url: "https://testnet.teritori.com:27000",
    },
  ];

  return (
    <SettingBase
      customHeader={
        <MiniHeader
          navigation={navigation}
          backEnabled
          title="Change Network"
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
          No Network to Display
        </BrandText>
      ) : (
        <FlatList
          inverted
          data={addresses.reverse()}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <ListView
              onPress={() =>
                navigation.navigate("EditChangeNetwork", {
                  addressId: item.id,
                })
              }
              style={{
                paddingHorizontal: layout.spacing_x1_5,
              }}
              options={{
                label: item?.label,
                iconEnabled: false,
                rightLabel: (
                  <View>
                    <Checkbox
                      isChecked
                      value={item?.label}
                      onPress={() => {}}
                      checkboxStyle={{
                        borderRadius: 12,
                        width: 24,
                        height: 24,
                      }}
                    />
                  </View>
                ),
                bottomLabel: item?.url,
              }}
            />
          )}
        />
      )}
      <SpacerColumn size={1.5} />
      <Separator />
      <ListView
        onPress={() => {}}
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
