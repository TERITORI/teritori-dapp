import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

import calender from "../../../../assets/icons/calendar.svg";
import plus from "../../../../assets/icons/chatplus.svg";
import close from "../../../../assets/icons/close.svg";
import search from "../../../../assets/icons/search.svg";
import { SVG } from "../../../components/SVG";
import { TextInputCustom } from "../../../components/inputs/TextInputCustom";
import { SpacerColumn } from "../../../components/spacer";
import Calendars from "./Calendar";
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
    { message: "okay nice, thanks!", isSender: true },
  ]);
  const [newMessage, setNewMessage] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [showTextInput, setShowTextInput] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  const [showAttachmentModal, setShowAttachmentModal] = useState(false);

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
  const handleSearchIconPress = () => {
    setShowTextInput(true);
    setShowCalendar(false);
  };
  const handleCancelPress = () => {
    setShowTextInput(false);
    setSearchInput("");
    setShowCalendar(false);
  };
  const handleAttachment = (type) => {
    // Handle attaching a file, image, or video of the given type
    setShowAttachmentModal(false);
  };

  return (
    <View style={styles.container}>
      <View
        style={{
          position: "absolute",
          top: -40,
          alignSelf: "flex-end",
          flexDirection: "row",
          // alignItems: "center",
        }}
      >
        {showTextInput ? (
          <>
            <TextInputCustom
              name="search"
              placeHolder="Search..."
              value={searchInput}
              onChangeText={setSearchInput}
              iconSVG={search}
              iconStyle={{ width: 20, height: 40 }}
              height={30}
              noBrokenCorners
            />
            <TouchableOpacity onPress={() => setShowCalendar(!showCalendar)}>
              <SVG source={calender} />
            </TouchableOpacity>
          </>
        ) : (
          <>
            <TouchableOpacity onPress={handleSearchIconPress}>
              <SVG
                source={search}
                style={{
                  height: 20,
                  width: 20,
                  marginTop: 4,
                  marginRight: 15,
                }}
              />
            </TouchableOpacity>
            <Text style={{ color: "#fff" }}>...</Text>
          </>
        )}
        {showTextInput && (
          <TouchableOpacity onPress={handleCancelPress}>
            <SVG source={close} height={20} style={{ marginTop: 6 }} />
          </TouchableOpacity>
        )}

        {showCalendar && (
          <View style={{ position: "absolute", marginTop: -90 }}>
            <Calendars />
          </View>
        )}
      </View>
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

      <View style={styles.textInputContainer}>
        {showAttachmentModal ? (
          <View style={styles.attachmentModal}>
            <TouchableOpacity
              style={styles.attachmentItem}
              onPress={() => handleAttachment("file")}
            >
              <Text style={styles.attach}>Attach file</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.attachmentItem}
              onPress={() => handleAttachment("image")}
            >
              <Text style={styles.attach}>Attach image/video</Text>
            </TouchableOpacity>
          </View>
        ) : null}
        <TextInputCustom
          name="message"
          placeHolder="Type your Message"
          value={newMessage}
          onChangeText={setNewMessage}
          iconSVG={plus}
          onPress={() => setShowAttachmentModal(true)}
        >
          <TouchableOpacity onPress={handleSend}>
            <Text style={styles.sendButtonText}>Send</Text>
          </TouchableOpacity>
        </TextInputCustom>
      </View>
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
  attachmentModal: {
    position: "absolute",
    top: -64,
    left: 10,
    backgroundColor: "rgba(41, 41, 41, 0.8)",
    padding: 6,
    borderRadius: 6,
    borderWidth: 1,

    zIndex: 111,
  },
  attachmentItem: {
    height: 25,
  },
  textInputContainer: {
    position: "relative",
  },
  textInputContainer: {
    position: "relative",
  },
  attach: {
    fontSize: 13,
    fontWeight: "600",
    lineHeight: 10,
    color: "#A3A3A3",
  },
});

export default ChatSection;
