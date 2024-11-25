import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import React from "react";
import { View } from "react-native";
import { useSelector } from "react-redux";

import chevronLeftSVG from "@/assets/icons/chevron-left.svg";
import dotSVG from "@/assets/icons/dots.svg";
import phoneCellSVG from "@/assets/icons/phone-cell.svg";
import { ChatAvatar } from "../../components/ChatAvatar";

import { BrandText } from "@/components/BrandText";
import { SVG } from "@/components/SVG";
import { CustomPressable } from "@/components/buttons/CustomPressable";
import { SpacerRow } from "@/components/spacer";
import { selectPeerById } from "@/store/slices/message";
import { RootState } from "@/store/store";
import { RootStackParamList } from "@/utils/navigation";
import { MOBILE_HEADER_HEIGHT, layout } from "@/utils/style/layout";
import { Conversation } from "@/utils/types/message";
import {
  getConversationAvatar,
  getConversationName,
} from "@/weshnet/messageHelpers";

type HeaderProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, "Conversation">;
  conversation?: Conversation;
};
export const ChatHeader = ({ navigation, conversation }: HeaderProps) => {
  const navigateBack = () =>
    navigation.canGoBack()
      ? navigation.goBack()
      : navigation.replace("MiniTabs", { screen: "MiniChats" });

  const handlePhoneCellPress = () => {
    alert("Phone cell");
  };

  const contactInfo = conversation ? conversation.members?.[0] : "";
  const peerId = contactInfo ? contactInfo?.peerId : "";

  const peerStatus = useSelector((state: RootState) =>
    selectPeerById(state, peerId),
  );

  const handleMoreActionPress = () => {
    if (conversation?.id) {
      navigation.navigate("MiniGroupActions", {
        conversationId: conversation?.id,
      });
    }
  };

  return (
    <View
      style={{
        flexDirection: "row",
        height: MOBILE_HEADER_HEIGHT,
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
        <CustomPressable
          onPress={navigateBack}
          style={{
            alignItems: "flex-start",
            justifyContent: "flex-start",
          }}
        >
          <SVG source={chevronLeftSVG} height={28} width={28} />
        </CustomPressable>
        <SpacerRow size={2} />
        <ChatAvatar
          membersAvatar={
            conversation &&
            conversation?.members &&
            Array.isArray(conversation?.members) &&
            conversation?.members.length > 0
              ? conversation?.members.map((_, index) =>
                  getConversationAvatar(conversation, index),
                )
              : [""]
          }
          isActive={peerStatus?.isActive}
          size="sm"
        />
        <SpacerRow size={1.5} />
        <BrandText>
          {conversation && getConversationName(conversation)}
        </BrandText>
      </View>
      <View style={{ flexDirection: "row", gap: layout.spacing_x2_5 }}>
        <CustomPressable onPress={handlePhoneCellPress}>
          <SVG source={phoneCellSVG} height={28} width={28} />
        </CustomPressable>
        {conversation?.type === "group" && (
          <CustomPressable onPress={handleMoreActionPress}>
            <SVG
              source={dotSVG}
              height={28}
              width={28}
              style={{ transform: [{ rotateZ: "90deg" }] }}
            />
          </CustomPressable>
        )}
      </View>
    </View>
  );
};
