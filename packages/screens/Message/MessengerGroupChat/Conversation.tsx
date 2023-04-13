import React from "react";
import { View, Text, StyleSheet } from "react-native";

import avatar from "../../../../assets/icons/avatar.svg";
import { SVG } from "../../../components/SVG";

interface IChatMessageProps {
  message: string;
  isSender: boolean;
  time: string;
  receiverName?: string;
}

const ChatMessage = ({
  message,
  isSender,
  time,
  receiverName,
}: IChatMessageProps) => {
  const senderName = "me";

  return (
    <View style={isSender ? styles.senderWrapper : styles.receiverWrapper}>
      {!isSender && <SVG source={avatar} style={{ width: 30, height: 30 }} />}
      <View
        style={[isSender ? styles.senderContainer : styles.receiverContainer]}
      >
        <Text style={styles.message}>{message}</Text>

        <View
          style={{
            flexDirection: "row",
            position: "absolute",
            top: -20,
            left: 10,
          }}
        >
          {!isSender && receiverName && (
            <Text style={styles.name}>{receiverName}</Text>
          )}
          {isSender && <Text style={styles.name}>{senderName}</Text>}
          <Text style={styles.time}>{time}</Text>
        </View>
      </View>
    </View>
  );
};

export default ChatMessage;

const styles = StyleSheet.create({
  senderWrapper: {
    flexDirection: "row",

    marginBottom: 40,
  },
  receiverWrapper: {
    flexDirection: "row",
    marginBottom: 8,
  },
  senderContainer: {
    backgroundColor: "#171717",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 16,
    marginHorizontal: 10,
    marginLeft: "auto",
    width: "auto",
    maxWidth: "60%",
  },
  receiverContainer: {
    backgroundColor: "#5C26F5",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 16,
    marginHorizontal: 10,
    width: "auto",
    maxWidth: "60%",
    marginRight: "auto",
  },
  message: {
    color: "#FFFFFF",
    fontSize: 11,
    lineHeight: 18,
    fontWeight: "500",
  },
  time: {
    fontSize: 10,
    color: "#808080",
    marginLeft: 5,
  },
  name: {
    fontSize: 10,
    color: "#808080",
  },
});
