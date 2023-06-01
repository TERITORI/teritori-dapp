import React, { Key, useState } from "react";
import {
  View,
  TouchableOpacity,
  ScrollView,
  useWindowDimensions,
} from "react-native";

import { ChatHeader } from "./ChatHeader";
import { Conversation } from "./Conversation";
import { chatData } from "./chatData";
import plus from "../../../../assets/icons/chatplus.svg";
import sent from "../../../../assets/icons/sent.svg";
import { SVG } from "../../../components/SVG";
import { Separator } from "../../../components/Separator";
import { TextInputCustom } from "../../../components/inputs/TextInputCustom";
import { SpacerColumn } from "../../../components/spacer";
import { neutral33 } from "../../../utils/style/colors";
import { layout } from "../../../utils/style/layout";
import { LocalFileData } from "../../../utils/types/feed";
import { weshClient } from "../../../weshnet/client";
import { UploadImage } from "../MessengerHomeCreateChatDropdown/UploadImage";
interface IMessage {
  id: Key | null | undefined;
  source: any;
  message: string;
  isSender: boolean;
  file: LocalFileData;

  time: string;
  name: string;
}

export const ChatSection = () => {
  const [messages, setMessages] = useState<any>(chatData);
  const [newMessage, setNewMessage] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [showAttachmentModal, setShowAttachmentModal] = useState(false);
  const [thumbnailFile, setThumbnailFile] = useState<LocalFileData>();

  const handleSend = async () => {
    // await weshClient.AppMessageSend({
    //   groupPk: groupPk,
    //   payload: "",
    // });

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
  const { height } = useWindowDimensions();

  return (
    <>
      <View style={{ zIndex: 11111 }}>
        <ChatHeader
          messages={messages}
          searchInput={searchInput}
          setSearchInput={setSearchInput}
        />
      </View>
      <Separator color={neutral33} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        style={{
          height: height - 340,
        }}
      >
        {messages.map((msg, index) => (
          <Conversation
            key={index}
            message={msg.message}
            isSender={msg.isSender}
            time={msg.time}
            receiverName={msg.isSender ? undefined : msg.name}
            source={msg.source}
            imageStyle={{ height: 200, width: 120, borderRadius: 10 }}
            height={0}
            width={0}
          />
        ))}
      </ScrollView>

      <SpacerColumn size={3} />

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
      <View>
        <TextInputCustom
          labelStyle={{ marginTop: -10 }}
          containerStyle={{
            marginHorizontal: layout.padding_x0_5,
          }}
          name="message"
          placeHolder="Add a Message"
          value={newMessage}
          onChangeText={setNewMessage}
          iconActions={
            <TouchableOpacity onPress={() => setShowAttachmentModal(true)}>
              <SVG source={plus} style={{ marginRight: 10 }} />
            </TouchableOpacity>
          }
          label=""
        >
          <TouchableOpacity onPress={handleSend}>
            <SVG source={sent} />
          </TouchableOpacity>
        </TextInputCustom>
      </View>
    </>
  );
};
