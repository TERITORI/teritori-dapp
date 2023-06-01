import React from "react";
import { Platform, TouchableOpacity, View } from "react-native";

import add from "../../../assets/icons/add-circle-filled.svg";
import chevronDownSVG from "../../../assets/icons/chevron-down.svg";
import Search from "../../../assets/icons/search.svg";
import { BrandText } from "../../components/BrandText";
import FlexRow from "../../components/FlexRow";
import { SVG } from "../../components/SVG";
import { Separator } from "../../components/Separator";
import ConversationData from "../../components/sidebarchat/ConversationData";
import FriendListWithNewMessages from "../../components/sidebarchat/FriendListNewMessagesCard";
import SideBarChatConversation from "../../components/sidebarchat/SideBarChatConversation";
import { SpacerColumn, SpacerRow } from "../../components/spacer";
import { useAppNavigation } from "../../utils/navigation";
import {
  primaryColor,
  secondaryColor,
  neutral22,
} from "../../utils/style/colors";
import { fontSemibold14 } from "../../utils/style/fonts";

export const SideBarChats: React.FC = () => {
  const navigation = useAppNavigation();
  const MAX_WIDTH = 110;
  return (
    <View>
      <SpacerColumn size={2} />
      <FriendListWithNewMessages />
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

      <SpacerColumn size={2.5} />

      <Separator horizontal={false} color={neutral22} />
      <SpacerColumn size={1.5} />
      {ConversationData.map((item, index) => (
        <TouchableOpacity
          onPress={() =>
            ["android", "ios"].includes(Platform.OS)
              ? navigation.navigate("ChatSection")
              : null
          }
          key={index}
        >
          <SideBarChatConversation
            avatar={item.avatar}
            name={item.name}
            isOnline={item.isOnline}
            chat={
              item.chat.length > 0.5 * MAX_WIDTH
                ? `${item.chat.slice(0, MAX_WIDTH / 2)}...`
                : item.chat
            }
            time={item.time}
            iconCheck={item?.icon}
          />
        </TouchableOpacity>
      ))}
    </View>
  );
};
