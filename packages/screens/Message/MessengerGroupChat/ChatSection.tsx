import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Modal,
  ScrollView,
} from "react-native";

import ChatData from "./ChatData";
import ChatHeader from "./ChatHeader";
import ChatMessage from "./Conversation";
import plus from "../../../../assets/icons/chatplus.svg";
import close from "../../../../assets/icons/close.svg";
import FlexRow from "../../../components/FlexRow";
import { SVG } from "../../../components/SVG";
import { ScreenContainer } from "../../../components/ScreenContainer";
import { Separator } from "../../../components/Separator";
import { TertiaryBox } from "../../../components/boxes/TertiaryBox";
import { FileUploader } from "../../../components/fileUploader";
import { TextInputCustom } from "../../../components/inputs/TextInputCustom";
import { SpacerColumn, SpacerRow } from "../../../components/spacer";
import { IMAGE_MIME_TYPES } from "../../../utils/mime";
import { additionalRed, neutral33 } from "../../../utils/style/colors";
import { LocalFileData } from "../../../utils/types/feed";

interface IMessage {
  message: string;
  isSender: boolean;
  file: LocalFileData;

  time: string;
  name: string;
}

const ChatSection = () => {
  const [messages, setMessages] = useState<IMessage[]>(ChatData);
  const [newMessage, setNewMessage] = useState("");
  console.log("first", messages);
  const [searchInput, setSearchInput] = useState("");
  const [showAttachmentModal, setShowAttachmentModal] = useState(false);
  const [thumbnailFile, setThumbnailFile] = useState<LocalFileData>();
  const [visible, setVisible] = useState(true);

  const [showImage, setShowImage] = useState(true);
  const handleSend = () => {
    const newMsg: IMessage = {
      message: newMessage,
      isSender: true,
    };
    setMessages([...messages, newMsg, ...thumbnailFile?.url]);
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
          <SpacerColumn size={3} />
          <ScrollView>
            {messages.map((msg, index) => (
              <ChatMessage
                key={index}
                message={msg.message}
                isSender={msg.isSender}
                time={msg.time}
                receiverName={msg.isSender ? undefined : msg.name}
              />
            ))}
          </ScrollView>
          <SpacerColumn size={3} />
          <View style={styles.textInputContainer}>
            {showAttachmentModal && !thumbnailFile ? (
              <FileUploader
                onUpload={(files) => {
                  setThumbnailFile(files[0]);
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

            {thumbnailFile ? (
              <Modal visible={visible} animationType="none" transparent>
                <View
                  style={{
                    flex: 1,
                    justifyContent: "center",
                    alignItems: "center",
                    backgroundColor: "rgba(0, 0, 0, 0.8)",
                  }}
                >
                  <TertiaryBox
                    mainContainerStyle={{
                      minWidth: showImage ? 300 : 200,
                      minHeight: showImage ? 400 : 200,
                      maxWidth: showImage ? 300 : 350,
                      flex: 1,
                    }}
                  >
                    <View
                      style={{
                        flex: 1,
                        flexDirection: "row",
                        justifyContent: "space-between",
                        width: "100%",
                        padding: 10,
                      }}
                    >
                      <View>
                        <FlexRow>
                          <TouchableOpacity onPress={() => setShowImage(true)}>
                            <Image
                              source={require("../../../../assets/icons/image.png")}
                              style={{ height: 30, width: 30 }}
                            />
                          </TouchableOpacity>
                          <TouchableOpacity onPress={() => setShowImage(false)}>
                            <Image
                              source={require("../../../../assets/icons/closeimage.png")}
                              style={{ height: 30, width: 30 }}
                            />
                          </TouchableOpacity>
                        </FlexRow>
                      </View>
                      <TouchableOpacity onPress={() => setVisible(!visible)}>
                        <SVG source={close} height={20} width={20} />
                      </TouchableOpacity>
                    </View>
                    {showImage ? (
                      <View
                        style={{
                          backgroundColor: additionalRed,
                          width: "90%",
                          borderRadius: 6,
                        }}
                      >
                        <Image
                          source={{ uri: thumbnailFile.url }}
                          style={styles.image}
                          resizeMode="cover"
                        />
                      </View>
                    ) : (
                      <View
                        style={{
                          flexDirection: "row",
                          alignItems: "center",
                          width: "100%",
                          padding: 20,
                        }}
                      >
                        <Image
                          source={{ uri: thumbnailFile.url }}
                          style={styles.imagesmall}
                          resizeMode="stretch"
                        />
                        <Text
                          style={{
                            color: "red",
                            marginLeft: 10,
                            width: "60%",
                          }}
                        >
                          {thumbnailFile.fileName}:
                        </Text>
                      </View>
                    )}

                    <SpacerColumn size={2} />
                    <View style={{ flex: 1, width: "100%" }}>
                      <TextInputCustom
                        noBrokenCorners
                        fullWidth
                        squaresBackgroundColor="red"
                        name="message"
                        placeHolder="Type your Message"
                        value={newMessage}
                        onChangeText={setNewMessage}
                      >
                        <TouchableOpacity onPress={handleSend}>
                          <Image
                            style={styles.sendButton}
                            source={require("../../../../assets/icons/sent.png")}
                          />
                        </TouchableOpacity>
                      </TextInputCustom>
                    </View>
                  </TertiaryBox>
                </View>
              </Modal>
            ) : null}
            {/* <UploadImage
            showAttachmentModal={showAttachmentModal}
            setShowAttachmentModal={setShowAttachmentModal}
          /> */}

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
    top: -50,
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

  attach: {
    fontSize: 13,
    fontWeight: "600",
    lineHeight: 10,
    color: "#A3A3A3",
  },
  background: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modal: {
    backgroundColor: "white",
    borderRadius: 8,
    width: "90%",
    maxWidth: 400,
    paddingHorizontal: 16,
    paddingTop: 24,
    paddingBottom: 16,
    alignItems: "center",
  },
  imageContainer: {
    borderRadius: 4,
    overflow: "hidden",
    marginVertical: 16,
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
  deleteButton: {
    backgroundColor: "red",
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginTop: 16,
  },
  deleteText: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  closeButton: {
    backgroundColor: "gray",
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginTop: 8,
  },
  closeText: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
});

export default ChatSection;
