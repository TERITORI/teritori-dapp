import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import React from "react";
import { View } from "react-native";

import DropdownWithCheck from "./components/DropdownWithCheck";
import chevronLeftSVG from "../../../../assets/icons/chevron-left.svg";
import { BrandText } from "../../../components/BrandText";
import { SVG } from "../../../components/SVG";
import { CustomPressable } from "../../../components/buttons/CustomPressable";
import { SpacerRow } from "../../../components/spacer";
import { RootStackParamList } from "../../../utils/navigation";
import { neutral00 } from "../../../utils/style/colors";
import { MOBILE_HEADER_HEIGHT, layout } from "../../../utils/style/layout";

type HeaderProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, "Notifications">;
};

const filterOptions = [
  {
    value: "all",
    name: "All",
  },
  {
    value: "nft_sales",
    name: "NFT sales",
  },
  {
    value: "announcements",
    name: "Announcements",
  },
  {
    value: "news",
    name: "News",
  },
  {
    value: "tranactions",
    name: "Tranactions",
  },
  {
    value: "tips",
    name: "Tips",
  },
];
export const NotificationHeader = ({ navigation }: HeaderProps) => {
  const navigateBack = () =>
    navigation.canGoBack()
      ? navigation.goBack()
      : navigation.replace("MiniTabs");

  return (
    <View
      style={{
        backgroundColor: neutral00,
        flexDirection: "row",
        justifyContent: "space-between",
        paddingVertical: layout.spacing_x1_5,
        height: MOBILE_HEADER_HEIGHT,
        maxHeight: MOBILE_HEADER_HEIGHT,
        width: "100%",
        alignItems: "center",
        paddingHorizontal: layout.spacing_x1_5,
        position: "absolute",
        top: 0,
        zIndex: 9999,
      }}
    >
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        <CustomPressable onPress={navigateBack}>
          <SVG source={chevronLeftSVG} height={28} width={28} />
        </CustomPressable>
        <SpacerRow size={2} />
        <BrandText>Notifications</BrandText>
      </View>
      <DropdownWithCheck
        filterOptions={filterOptions}
        headerOptions={{ name: "Filters" }}
      />
    </View>
  );
};
