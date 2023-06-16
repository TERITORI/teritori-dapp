import React, { Key, useEffect, useState } from "react";
import {
  View,
  TouchableOpacity,
  ScrollView,
  useWindowDimensions,
} from "react-native";
import { useSelector } from "react-redux";

import { ChatHeader } from "./ChatHeader";
import { Conversation } from "./Conversation";
import { chatData } from "./chatData";
import plus from "../../../../assets/icons/chatplus.svg";
import sent from "../../../../assets/icons/sent.svg";
import { SVG } from "../../../components/SVG";
import { Separator } from "../../../components/Separator";
import { TextInputCustom } from "../../../components/inputs/TextInputCustom";
import { SpacerColumn } from "../../../components/spacer";
import { useFeedbacks } from "../../../context/FeedbacksProvider";
import { selectMessageListByGroupPk } from "../../../store/slices/message";
import { neutral33 } from "../../../utils/style/colors";
import { layout } from "../../../utils/style/layout";
import { LocalFileData } from "../../../utils/types/feed";
import { GroupInfo_Reply } from "../../../weshnet";
import { weshClient, weshConfig } from "../../../weshnet/client";
import { subscribeMessages } from "../../../weshnet/client/subscribers";
import { encodeJSON, stringFromBytes } from "../../../weshnet/client/utils";
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

export const ChatSection = ({ conversation }) => {
  const [message, setMessage] = useState<any>("");
  const [files, setFiles] = useState([]);

  const [newMessage, setNewMessage] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [showAttachmentModal, setShowAttachmentModal] = useState(false);
  const [thumbnailFile, setThumbnailFile] = useState<LocalFileData>();
  const { setToastError } = useFeedbacks();
  const [groupInfo, setGroupInfo] = useState<GroupInfo_Reply>();
  const messages = useSelector(
    selectMessageListByGroupPk(stringFromBytes(groupInfo?.group?.publicKey))
  );

  const [subsId, setSubsId] = useState();

  const getGroupInfo = async () => {
    let _group: GroupInfo_Reply;
    let subsId;
    if (!conversation?.payload) {
      console.log("no payload");
      return;
    }
    console.log(
      "conv",
      conversation,
      conversation?.payload?.groupPk?.length ||
        conversation?.payload?.group?.publicKey
    );
    try {
      if (
        conversation?.payload?.groupPk?.length ||
        conversation?.payload?.group?.publicKey
      ) {
        _group = await weshClient.GroupInfo({
          groupPk:
            conversation?.payload?.groupPk ||
            conversation?.payload?.group?.publicKey,
        });
      } else {
        _group = await weshClient.GroupInfo({
          contactPk:
            conversation?.payload?.contact?.pk ||
            conversation?.payload?.contactPk,
        });
      }
      setGroupInfo(_group);
      subsId = await subscribeMessages({
        groupPk: _group.group?.publicKey,
        sinceNow: true,
      });

      setSubsId(subsId);
    } catch (err) {
      setToastError({
        title: "Failed to get group info",
        message: err?.message,
      });
    }
  };

  useEffect(() => {
    getGroupInfo();
    return () => {
      subsId?.unsubscribe();
    };
  }, []);

  const handleSend = async () => {
    if (!message) {
      return;
    }
    try {
      const payload = encodeJSON({
        message,
        files: [],
        timestamp: new Date().toISOString(),
      });

      await weshClient.AppMessageSend({
        groupPk: groupInfo?.group?.publicKey,
        payload,
      });

      setMessage("");
    } catch (err) {
      setToastError({
        title: "Failed to send message",
        message: err?.message,
      });
    }

    // const newMsg: IMessage = {
    //   message: newMessage,
    //   isSender: true,
    // };

    // setMessages([
    //   ...messages,
    //   newMsg,
    //   ...(thumbnailFile?.url ? [thumbnailFile.url] : []),
    // ]);
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
        {messages.map((item, index) => (
          <Conversation
            key={stringFromBytes(item.eventContext.id)}
            data={item.message}
            isSender={
              stringFromBytes(item.headers.devicePk) ===
              stringFromBytes(weshConfig.config.devicePk)
            }
            time={item.time}
            receiverName={item.isSender ? undefined : item.name}
            source={item.source}
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
        messages={[]}
        setMessages={() => {}}
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
          value={message}
          onChangeText={setMessage}
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
