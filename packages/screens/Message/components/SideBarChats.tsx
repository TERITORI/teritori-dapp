import React, { useEffect } from "react";
import { Platform, View } from "react-native";
import { useSelector } from "react-redux";

import { ChatItem } from "./ChatItem";
import add from "../../../../assets/icons/add-circle-filled.svg";
import chevronDownSVG from "../../../../assets/icons/chevron-down.svg";
import Search from "../../../../assets/icons/search.svg";
import { BrandText } from "../../../components/BrandText";
import FlexRow from "../../../components/FlexRow";
import { SVG } from "../../../components/SVG";
import { Separator } from "../../../components/Separator";
import { FriendsBar } from "../../../components/sidebarchat/FriendsBar";
import { SpacerColumn, SpacerRow } from "../../../components/spacer";
import { selectConversationList } from "../../../store/slices/message";
import {
  primaryColor,
  secondaryColor,
  neutral22,
} from "../../../utils/style/colors";
import { fontSemibold14 } from "../../../utils/style/fonts";
import { layout } from "../../../utils/style/layout";
import { Conversation } from "../../../utils/types/message";

interface SideBarChatsProps {
  setActiveConversation: (conv: Conversation) => void;
  activeConversation?: Conversation;
}

export const SideBarChats = ({
  setActiveConversation,
  activeConversation,
}: SideBarChatsProps) => {
  const conversationList = useSelector(selectConversationList);

  useEffect(() => {
    if (!activeConversation && conversationList.length) {
      setActiveConversation(conversationList[0]);
    }
  }, [activeConversation, conversationList, setActiveConversation]);
  return (
    <View
      style={{
        paddingHorizontal: layout.padding_x1_5,
      }}
    >
      <SpacerColumn size={2} />
      {Platform.OS === "web" && (
        <>
          <FriendsBar />
          <SpacerColumn size={2.5} />
          <FlexRow justifyContent="space-between">
            <View>
              <FlexRow>
                <BrandText style={[fontSemibold14, { color: secondaryColor }]}>
                  All conversation
                </BrandText>
                <SpacerRow size={0.8} />
                <SVG
                  source={chevronDownSVG}
                  height={20}
                  width={20}
                  color={secondaryColor}
                />
              </FlexRow>
            </View>
            <View>
              <FlexRow>
                <SVG source={add} color={primaryColor} />
                <SpacerRow size={2} />
                <SVG
                  source={Search}
                  height={20}
                  width={20}
                  color={secondaryColor}
                />
              </FlexRow>
            </View>
          </FlexRow>
        </>
      )}

      <SpacerColumn size={2.5} />

      <Separator horizontal={false} color={neutral22} />
      <SpacerColumn size={1.5} />
      {conversationList.map((item, index) => (
        <ChatItem
          data={item}
          key={index}
          isActive={item.id === activeConversation?.id}
          onPress={() => {
            setActiveConversation(item);
          }}
        />
      ))}
    </View>
  );
};
