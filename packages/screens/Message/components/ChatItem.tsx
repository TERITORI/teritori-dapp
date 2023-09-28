import moment from "moment";
import React, { useMemo } from "react";
import { Platform, TouchableOpacity, View } from "react-native";
import { Avatar } from "react-native-paper";
import { useSelector } from "react-redux";

import { MessageAvatar } from "./MessageAvatar";
import { BrandText } from "../../../components/BrandText";
import FlexRow from "../../../components/FlexRow";
import { SpacerColumn, SpacerRow } from "../../../components/spacer";
import {
  selectConversationById,
  selectLastMessageByGroupPk,
} from "../../../store/slices/message";
import { useAppNavigation } from "../../../utils/navigation";
import {
  neutral00,
  neutral22,
  neutralA3,
  secondaryColor,
} from "../../../utils/style/colors";
import {
  fontMedium10,
  fontSemibold11,
  fontSemibold13,
} from "../../../utils/style/fonts";
import { layout } from "../../../utils/style/layout";
import { Conversation } from "../../../utils/types/message";
import { getConversationName } from "../../../weshnet/client/messageHelpers";
interface ChatItemProps {
  data: Conversation;
  onPress: () => void;
  isActive: boolean;
  isLastItem: boolean;
}

export const ChatItem = ({
  data,
  onPress,
  isActive,
  isLastItem,
}: ChatItemProps) => {
  const navigation = useAppNavigation();
  const lastMessage = useSelector(selectLastMessageByGroupPk(data.id));
  const contactInfo = data.members?.[0];
  const conversation = useSelector(selectConversationById(data.id));

  const isAllMessageRead = useMemo(() => {
    return lastMessage?.id === conversation.lastReadIdByMe;
  }, [conversation.lastReadIdByMe, lastMessage?.id]);

  return (
    <TouchableOpacity
      activeOpacity={0.9}
      style={{
        backgroundColor:
          isActive && Platform.OS === "web" ? neutral22 : neutral00,
        padding: layout.spacing_x1,
        borderRadius: 4,
        borderBottomWidth:
          ["android", "ios"].includes(Platform.OS) && !isLastItem ? 1 : 0,
        borderBottomColor: neutral22,
        width: "100%",
      }}
      onPress={() =>
        ["android", "ios"].includes(Platform.OS)
          ? navigation.navigate("ChatSection", data)
          : onPress()
      }
    >
      {!isAllMessageRead && (
        <View
          style={{
            backgroundColor: "white",
            width: 2,
            position: "absolute",
            left: 0,
            top: 10,
            bottom: 10,
          }}
        />
      )}
      <FlexRow justifyContent="space-between">
        <View>
          <FlexRow>
            <MessageAvatar item={contactInfo} />
            {/* <Avatar.Image
              size={40}
              source={{ uri: contactInfo?.avatar || "" }}
            /> */}
            <SpacerRow size={1.5} />
            <View>
              <FlexRow>
                <BrandText
                  style={[
                    fontSemibold13,
                    { color: isAllMessageRead ? secondaryColor : "white" },
                  ]}
                >
                  {getConversationName(data)}
                </BrandText>
              </FlexRow>
              <SpacerColumn size={0.5} />
              <BrandText
                numberOfLines={1}
                style={[
                  fontSemibold11,
                  {
                    color: isAllMessageRead ? neutralA3 : "white",
                    maxWidth: 100,
                  },
                ]}
              >
                {lastMessage?.payload?.message}
              </BrandText>
            </View>
          </FlexRow>
        </View>
        {!!lastMessage && (
          <View>
            <FlexRow>
              <BrandText style={[fontMedium10, { color: secondaryColor }]}>
                {moment(lastMessage?.timestamp).fromNow()}
              </BrandText>
            </FlexRow>
          </View>
        )}
      </FlexRow>
    </TouchableOpacity>
  );
};
