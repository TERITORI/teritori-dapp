import React, { useState } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
} from "react-native";

import ChatData from "./ChatData";
import ChatHeader from "./ChatHeader";
import ChatMessage from "./Conversation";
import plus from "../../../../assets/icons/chatplus.svg";
import { SVG } from "../../../components/SVG";
import { ScreenContainer } from "../../../components/ScreenContainer";
import { Separator } from "../../../components/Separator";
import { TextInputCustom } from "../../../components/inputs/TextInputCustom";
import { RichText } from "../../../components/socialFeed/RichText/RichText.web";
import { SpacerColumn } from "../../../components/spacer";
import { neutral33 } from "../../../utils/style/colors";
import { LocalFileData } from "../../../utils/types/feed";
import UploadImage from "../MessengerHomeCreateChatDropdown/UploadImage";

interface IMessage {
  id: Key | null | undefined;
  source: any;
  message: string;
  isSender: boolean;
  file: LocalFileData;

  time: string;
  name: string;
}

const ChatSection = () => {
  const [messages, setMessages] = useState<IMessage[]>(ChatData);
  const [newMessage, setNewMessage] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [showAttachmentModal, setShowAttachmentModal] = useState(false);
  const [thumbnailFile, setThumbnailFile] = useState<LocalFileData>();

  const handleSend = () => {
    const newMsg: IMessage = {
      message: newMessage,
      isSender: true,
    };
    setMessages([
      ...messages,
      newMsg,
      ...(thumbnailFile?.url ? [thumbnailFile.url] : []),
    ]);
    setNewMessage("");
  };

  return (
    <ScreenContainer>
      <View style={{ position: "relative" }}>
        <View style={{ zIndex: 11111 }}>
          <ChatHeader
            messages={messages}
            searchInput={searchInput}
            setSearchInput={setSearchInput}
          />
        </View>
        <Separator color={neutral33} />
        <View style={styles.container}>
          <SpacerColumn size={2} />
          <ScrollView>
            {messages.map((msg, index) => (
              <ChatMessage
                key={msg.id}
                message={msg.message}
                isSender={msg.isSender}
                time={msg.time}
                receiverName={msg.isSender ? undefined : msg.name}
                source={msg.source}
                imageStyle={{ height: 200, width: 120, borderRadius: 10 }}
              />
            ))}
          </ScrollView>
          <SpacerColumn size={3} />
          <View style={styles.textInputContainer}>
            <UploadImage
              showAttachmentModal={showAttachmentModal}
              setShowAttachmentModal={setShowAttachmentModal}
              thumbnailFile={thumbnailFile}
              setThumbnailFile={setThumbnailFile}
              messages={messages}
              setMessages={setMessages}
              newMessage={newMessage}
              setNewMessage={setNewMessage}
            />

            <TextInputCustom
              name="message"
              placeHolder="Add a Message"
              value={newMessage}
              onChangeText={setNewMessage}
              iconActions={
                <TouchableOpacity onPress={() => setShowAttachmentModal(true)}>
                  <View style={{ marginRight: 10 }}>
                    <SVG source={plus} />
                  </View>
                </TouchableOpacity>
              }
              maxLength={1000}
            >
              <TouchableOpacity onPress={handleSend}>
                <Image
                  style={styles.sendButton}
                  source={require("../../../../assets/icons/sent.png")}
                />
              </TouchableOpacity>
            </TextInputCustom>
          </View>
        </View>
      </View>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  sendButton: { height: 20, width: 20, marginRight: 10 },

  attachmentModal: {
    position: "absolute",
    top: -55,
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

  image: {
    height: 300,
    width: 200,
    alignSelf: "center",
  },
  imagesmall: {
    height: 100,
    width: "40%",
    alignSelf: "center",
    borderRadius: 10,
  },
});

export default ChatSection;
