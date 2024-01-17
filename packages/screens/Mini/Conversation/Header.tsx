import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import React from "react";
import { View } from "react-native";

import chevronLeftSVG from "../../../../assets/icons/chevron-left.svg";
import phoneCellSVG from "../../../../assets/icons/phone-cell.svg";
import { BrandText } from "../../../components/BrandText";
import { SVG } from "../../../components/SVG";
import { CustomPressable } from "../../../components/buttons/CustomPressable";
import { SpacerRow } from "../../../components/spacer";
import { RootStackParamList } from "../../../utils/navigation";
import { ChatAvatar } from "../components/ChatAvatar";

type HeaderProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, "Conversation">;
};
export const Header = ({ navigation }: HeaderProps) => {
  const navigateBack = () =>
    navigation.canGoBack()
      ? navigation.goBack()
      : navigation.replace("MiniTabs");

  const handlePhoneCellPress = () => {
    alert("Phone cell");
  };
  return (
    <View
      style={{
        flexDirection: "row",
        height: 44,
        alignItems: "center",
        justifyContent: "space-between",
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
        <ChatAvatar
          membersAvatar={[
            "https://sm.ign.com/ign_nordic/cover/a/avatar-gen/avatar-generations_prsz.jpg",
          ]}
          isActive
          size="sm"
        />
        <SpacerRow size={1.5} />
        <BrandText>Eleanor Pena</BrandText>
      </View>
      <CustomPressable onPress={handlePhoneCellPress}>
        <SVG source={phoneCellSVG} height={28} width={28} />
      </CustomPressable>
    </View>
  );
};
