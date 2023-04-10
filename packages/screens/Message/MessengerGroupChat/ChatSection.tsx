import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

import plus from "../../../../assets/icons/chatplus.svg";
import search from "../../../../assets/icons/search.svg";
import { TextInputCustom } from "../../../components/inputs/TextInputCustom";
import { SpacerColumn } from "../../../components/spacer";
interface IMessage {
  message: string;
  isSender: boolean;
}

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
    <View style={isSender ? styles.senderContainer : styles.receiverContainer}>
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
  );
};

const ChatSection = () => {
  const [messages, setMessages] = useState<IMessage[]>([
    { message: "Hello! Intosoft", isSender: true },
    {
      message:
        "Hi guys,Let’s start organization of the open Beta here! Some mates are waiting",
      isSender: false,
    },
    { message: "How are you?", isSender: true },
    { message: "I'm good, thanks!", isSender: false },
  ]);
  const [newMessage, setNewMessage] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const handleSend = () => {
    const newMsg: IMessage = {
      message: newMessage,
      isSender: true,
    };
    setMessages([...messages, newMsg]);
    setNewMessage("");
  };
  const filteredMessages = messages.filter((msg) =>
    msg.message.toLowerCase().includes(searchInput.toLowerCase())
  );
  return (
    <View style={styles.container}>
      <TextInputCustom
        name="search"
        placeHolder="Search by message"
        value={searchInput}
        onChangeText={setSearchInput}
        iconSVG={search}
        iconStyle={{ width: 20, height: 40 }}
      />

      <SpacerColumn size={3} />

      {filteredMessages.map((msg, index) => (
        <ChatMessage
          key={index}
          message={msg.message}
          isSender={msg.isSender}
          time="10:30 AM"
          receiverName={msg.isSender ? undefined : "John Doe"}
        />
      ))}
      <SpacerColumn size={3} />
      <TextInputCustom
        name="message"
        placeHolder="Type your Message"
        value={newMessage}
        onChangeText={setNewMessage}
        iconSVG={plus}
        onPress={() => alert("Comming soon...")}
      >
        <TouchableOpacity onPress={handleSend}>
          <Text style={styles.sendButtonText}>Send</Text>
        </TouchableOpacity>
      </TextInputCustom>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 24,
  },

  sendButtonText: { color: "#fff" },
  senderContainer: {
    backgroundColor: "#171717",
    alignSelf: "flex-end",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 16,
    marginBottom: 40,
  },
  receiverContainer: {
    backgroundColor: "#5C26F5",
    alignSelf: "flex-start",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 16,
    marginBottom: 8,
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

export default ChatSection;
