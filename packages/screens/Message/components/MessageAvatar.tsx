import React from "react";
import { View } from "react-native";
import { Avatar, Badge } from "react-native-paper";
import { useSelector } from "react-redux";

import { selectPeerListById } from "../../../store/slices/message";
import { Contact } from "../../../utils/types/message";

type MessageAvatarProps = {
  item: Contact;
  size?: number;
  disableStatus?: boolean;
};

export const MessageAvatar = ({
  item,
  size = 40,
  disableStatus = false,
}: MessageAvatarProps) => {
  const peerStatus = useSelector(selectPeerListById(item?.peerId));
  return (
    <View>
      <Avatar.Image size={size} source={{ uri: item?.avatar || "" }} />
      {!disableStatus && (
        <Badge
          style={{
            position: "absolute",
            top: 30,
            left: 30,
            backgroundColor: peerStatus?.isActive ? "green" : "yellow",
          }}
          size={12}
        />
      )}
    </View>
  );
};
