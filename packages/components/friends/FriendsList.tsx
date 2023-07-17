import React from "react";
import { View, Image, StyleSheet } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { Avatar, Badge } from "react-native-paper";

import chaticon from "../../../assets/icons/chaticon.svg";
import dots from "../../../assets/icons/dots.svg";
import { Separator } from "../../components/Separator";
import { useNSUserInfo } from "../../hooks/useNSUserInfo";
import { neutral22, neutralA3, secondaryColor } from "../../utils/style/colors";
import { fontSemibold13, fontSemibold11 } from "../../utils/style/fonts";
import { Conversation } from "../../utils/types/message";
import {
  getConversationAvatar,
  getConversationName,
} from "../../weshnet/client/messageHelpers";
import { BrandText } from "../BrandText";
import FlexRow from "../FlexRow";
import { SVG } from "../SVG";
import { SpacerColumn, SpacerRow } from "../spacer";

type FriendListProps = {
  item: Conversation;
  handleChatPress: () => void;
};

const isOnline = true;
const FriendList = ({ item, handleChatPress }: FriendListProps) => {
  const onlineStatusBadgeColor = isOnline ? "green" : "yellow";
  return (
    <View>
      <FlexRow justifyContent="space-between">
        <View>
          <FlexRow>
            <Avatar.Image
              size={40}
              source={getConversationAvatar(item) || ""}
            />
            <Badge
              style={{
                position: "absolute",
                top: 30,
                left: 30,

                backgroundColor: onlineStatusBadgeColor,
              }}
              size={12}
            />
            <SpacerRow size={1.5} />
            <View>
              <BrandText style={[fontSemibold13, { color: secondaryColor }]}>
                {getConversationName(item)}
              </BrandText>
            </View>
          </FlexRow>
        </View>
        <View>
          <FlexRow>
            <TouchableOpacity onPress={handleChatPress}>
              <SVG source={chaticon} />
            </TouchableOpacity>
            <SpacerRow size={1.5} />
            <TouchableOpacity>
              <SVG source={dots} />
            </TouchableOpacity>
          </FlexRow>
        </View>
      </FlexRow>
      <SpacerColumn size={1.3} />
      <Separator color={neutral22} />
      <SpacerColumn size={1.3} />
    </View>
  );
};

export default FriendList;
