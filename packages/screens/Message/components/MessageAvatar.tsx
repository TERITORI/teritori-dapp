import React from "react";
import { View } from "react-native";
import { Badge } from "react-native-paper";
import { useSelector } from "react-redux";

import { Avatar } from "./Avatar";
import { selectPeerById } from "../../../store/slices/message";
import { RootState } from "../../../store/store";
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
  const peerStatus = useSelector((state: RootState) =>
    selectPeerById(state, item?.peerId),
  );
  return (
    <View>
      <Avatar size={size} source={item?.avatar} />
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
