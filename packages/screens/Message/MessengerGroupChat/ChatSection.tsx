import React, { Key, useEffect, useMemo, useState } from "react";
import {
  View,
  TouchableOpacity,
  ScrollView,
  useWindowDimensions,
  FlatList,
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
import { SpacerColumn, SpacerRow } from "../../../components/spacer";
import { useFeedbacks } from "../../../context/FeedbacksProvider";
import { selectMessageListByGroupPk } from "../../../store/slices/message";
import { neutral33 } from "../../../utils/style/colors";
import { layout } from "../../../utils/style/layout";
import { LocalFileData } from "../../../utils/types/feed";
import {
  Conversation as IConversation,
  Message,
} from "../../../utils/types/message";
import { GroupInfo_Reply } from "../../../weshnet";
import { weshClient, weshConfig } from "../../../weshnet/client";
import { sendMessage } from "../../../weshnet/client/services";
import {
  subscribeMessages,
  subscribeMetadata,
} from "../../../weshnet/client/subscribers";
import {
  bytesFromString,
  encodeJSON,
  stringFromBytes,
} from "../../../weshnet/client/utils";
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

interface ChatSectionProps {
  conversation: IConversation;
}
export interface HandleSendParams {
  message: string;
  files: Message["payload"]["files"];
}

export const ChatSection = ({ conversation }: ChatSectionProps) => {
  const { width } = useWindowDimensions();
  const [message, setMessage] = useState<any>("");
  const [files, setFiles] = useState([]);

  const [newMessage, setNewMessage] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [isFileUploader, setIsFileUploader] = useState(false);
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

    try {
      if (conversation.type === "group") {
        _group = await weshClient().GroupInfo({
          groupPk: bytesFromString(conversation.id),
        });
        await weshClient().ActivateGroup({
          groupPk: _group.group?.publicKey,
        });
      } else {
        _group = await weshClient().GroupInfo({
          contactPk: conversation.members[0].id,
        });
        await weshClient().ActivateGroup({
          groupPk: _group.group?.publicKey,
        });
      }
      setGroupInfo(_group);
      subsId = await subscribeMessages({
        groupPk: _group.group?.publicKey,
        untilNow: true,
      });
      await subscribeMetadata(_group.group?.publicKey);

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
  }, [conversation.id]);

  const handleSend = async (data?: HandleSendParams) => {
    console.log("send test", !message || !data?.message, message, data);
    if (!message && !data?.message) {
      return;
    }
    try {
      await sendMessage({
        groupPk: groupInfo?.group?.publicKey,
        message: {
          type: "message",
          payload: {
            message: message || data?.message,
            files: data?.files || [],
          },
        },
      });

      setMessage("");
    } catch (err) {
      setToastError({
        title: "Failed to send message",
        message: err?.message,
      });
    }
  };
  const { height } = useWindowDimensions();

  return (
    <>
      <View style={{ zIndex: 11111 }}>
        <ChatHeader
          messages={messages}
          searchInput={searchInput}
          setSearchInput={setSearchInput}
          name={conversation.name || "Anon"}
        />
      </View>
      <Separator color={neutral33} />

      <FlatList
        inverted
        data={messages}
        style={{
          height: height - 340,
          paddingVertical: layout.padding_x1_5,
        }}
        renderItem={({ item }) => (
          <Conversation
            message={item}
            data={item.message}
            height={0}
            width={0}
          />
        )}
        keyExtractor={(item) => item.id}
      />

      <SpacerColumn size={3} />

      {isFileUploader && (
        <UploadImage
          onClose={() => setIsFileUploader(false)}
          handleSend={handleSend}
        />
      )}
      <View
        style={{
          flexDirection: "row",
          padding: layout.padding_x1,
          alignItems: "center",
        }}
      >
        <TouchableOpacity onPress={() => setIsFileUploader(true)}>
          <SVG source={plus} />
        </TouchableOpacity>
        <SpacerRow size={2} />
        <TextInputCustom
          labelStyle={{ marginTop: -10 }}
          containerStyle={{
            marginHorizontal: layout.padding_x0_5,
          }}
          name="message"
          placeHolder="Add a Message"
          value={message}
          onChangeText={setMessage}
          label=""
          style={{
            width: width - 560,
          }}
          onSubmitEditing={() => {
            if (message.length) {
              handleSend();
            }
          }}
        >
          <TouchableOpacity onPress={handleSend}>
            <SVG source={sent} />
          </TouchableOpacity>
        </TextInputCustom>
      </View>
    </>
  );
};
