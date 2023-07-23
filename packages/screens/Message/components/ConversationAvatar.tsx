import React from "react";
import { View } from "react-native";
import { Avatar } from "react-native-paper";

import { Conversation } from "../../../utils/types/message";
import { getConversationAvatar } from "../../../weshnet/client/messageHelpers";

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
      <View>
        {conversation.members.map((conv, index) => (
          <Avatar.Image
            source={getConversationAvatar(conversation, index)}
            size={size}
          />
        ))}
      </View>
    );
  }
  return (
    <>
      <Avatar.Image source={getConversationAvatar(conversation)} size={size} />
    </>
  );
};
