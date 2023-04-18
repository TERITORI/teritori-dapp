import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";

import plus from "../../../../assets/icons/chatplus.svg";
import { Separator } from "../../../components/Separator";
import { FileUploader } from "../../../components/fileUploader";
import { TextInputCustom } from "../../../components/inputs/TextInputCustom";
import { SpacerColumn } from "../../../components/spacer";
import { IMAGE_MIME_TYPES } from "../../../utils/mime";
import { neutral33 } from "../../../utils/style/colors";
import { LocalFileData } from "../../../utils/types/feed";
import ChatData from "./ChatData";
import ChatHeader from "./ChatHeader";
import ChatMessage from "./Conversation";

interface IMessage {
  message: string;
  isSender: boolean;
  file: LocalFileData;

  onDelete: (file: LocalFileData) => void;
  onUploadThumbnail: (updatedFile: LocalFileData) => void;
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
    setMessages([...messages, newMsg]);
    setNewMessage("");
  };

  return (
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
        <SpacerColumn size={3} />

        {messages.map((msg, index) => (
          <ChatMessage
            key={index}
            message={msg.message}
            isSender={msg.isSender}
            time={msg.time}
            receiverName={msg.isSender ? undefined : msg.name}
          />
        ))}
        <SpacerColumn size={3} />

        <View style={styles.textInputContainer}>
          {showAttachmentModal ? (
            <FileUploader
              onUpload={(files) => {
                setThumbnailFile(files[0]);
                onUploadThumbnail({ ...file, thumbnailFileData: files[0] });
              }}
              mimeTypes={IMAGE_MIME_TYPES}
            >
              {({ onPress }) => (
                <View style={styles.attachmentModal}>
                  <TouchableOpacity
                    style={styles.attachmentItem}
                    // onPress={() => handleAttachment("file")}
                    onPress={onPress}
                  >
                    <Text style={styles.attach}>Attach file</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.attachmentItem}
                    // onPress={() => handleAttachment("image")}
                    onPress={onPress}
                  >
                    <Text style={styles.attach}>Attach image/video</Text>
                  </TouchableOpacity>
                </View>
              )}
            </FileUploader>
          ) : null}
          <View>
            {thumbnailFile?.fileName ? (
              <Text>{thumbnailFile?.fileName}</Text>
            ) : null}
            {thumbnailFile?.url ? (
              <Image
                source={{ uri: thumbnailFile.url }}
                style={{
                  height: 80,
                  width: 80,
                  borderTopLeftRadius: 4,
                  borderBottomLeftRadius: 4,
                }}
                resizeMode="cover"
              />
            ) : null}
          </View>

          <TextInputCustom
            name="message"
            placeHolder="Type your Message"
            value={newMessage}
            onChangeText={setNewMessage}
            iconSVG={plus}
            onPress={() => setShowAttachmentModal(true)}
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
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 24,
  },
  modalContainer: {
    borderWidth: 1,
    borderColor: "green",
    position: "absolute",
    alignSelf: "flex-end",
    backgroundColor: "red",
    width: 300,
  },
  sendButton: { height: 20, width: 20, marginRight: 10 },
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
