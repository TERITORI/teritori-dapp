import React from "react";
import { View } from "react-native";

import { Avatar } from "./Avatar";
import { layout } from "../../../utils/style/layout";
import { Conversation } from "../../../utils/types/message";
import { getConversationAvatar } from "../../../weshnet/messageHelpers";

interface ConversationAvatarProps {
  conversation: Conversation;
  size?: number;
}

export const ConversationAvatar = ({
  conversation,
  size = 30,
}: ConversationAvatarProps) => {
  if (conversation.members?.length > 1) {
    return (
      <View
        style={{
          marginLeft: layout.spacing_x0_5,
          display: "flex",
          flexDirection: "row",
        }}
      >
        {conversation.members.map((_, index) => (
          <Avatar
            source={getConversationAvatar(conversation, index)}
            size={size}
            style={{
              marginLeft: -layout.spacing_x0_5,
            }}
          />
        ))}
      </View>
    );
  }
  return <Avatar source={getConversationAvatar(conversation)} size={size} />;
};
