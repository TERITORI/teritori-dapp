import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

import avatar from "../../../../assets/icons/avatar.svg";
import { SVG } from "../../../components/SVG";
import MessagePopup from "./MessagePopup";
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
  const [showPopup, setShowPopup] = useState(false);

  return (
    <View style={isSender ? styles.senderWrapper : styles.receiverWrapper}>
      {!isSender && <SVG source={avatar} style={{ width: 30, height: 30 }} />}
      <View
        style={[isSender ? styles.senderContainer : styles.receiverContainer]}
      >
        <TouchableOpacity onPress={() => setShowPopup(!showPopup)}>
          <Text style={styles.message}>{message}</Text>
        </TouchableOpacity>
        {!isSender && showPopup && (
          <View style={styles.popupContainer}>
            <MessagePopup />
          </View>
        )}
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
    maxWidth: "40%",
    zIndex: 1,
  },
  receiverContainer: {
    backgroundColor: "#5C26F5",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 16,
    marginHorizontal: 10,
    width: "auto",
    maxWidth: "40%",
    zIndex: 1,
    marginRight: "auto",
  },
  popupContainer: {
    backgroundColor: "rgba(41, 41, 41, 0.8)",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 16,

    width: "auto",

    zIndex: 2,

    position: "absolute",
    right: -140,
    top: -145,
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
