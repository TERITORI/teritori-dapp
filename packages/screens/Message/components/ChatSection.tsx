import moment from "moment";
import React, {
  RefObject,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  View,
  TouchableOpacity,
  useWindowDimensions,
  FlatList,
} from "react-native";
import { useSelector } from "react-redux";

import { ChatHeader } from "./ChatHeader";
import { Conversation } from "./Conversation";
import { UploadImage } from "./UploadImage";
import { UploadedPreview } from "./UploadedPreview";
import plus from "../../../../assets/icons/chatplus.svg";
import sent from "../../../../assets/icons/sent.svg";
import { BrandText } from "../../../components/BrandText";
import { Dropdown } from "../../../components/Dropdown";
import { SVG } from "../../../components/SVG";
import { ScreenContainer } from "../../../components/ScreenContainer";
import { Separator } from "../../../components/Separator";
import { TextInputCustom } from "../../../components/inputs/TextInputCustom";
import { SpacerColumn, SpacerRow } from "../../../components/spacer";
import { useFeedbacks } from "../../../context/FeedbacksProvider";
import { selectMessageListByGroupPk } from "../../../store/slices/message";
import { ScreenFC, useAppRoute } from "../../../utils/navigation";
import {
  neutral00,
  neutral33,
  neutral77,
  redDefault,
} from "../../../utils/style/colors";
import {
  fontSemibold10,
  fontSemibold12,
  fontSemibold14,
} from "../../../utils/style/fonts";
import { layout } from "../../../utils/style/layout";
import {
  Conversation as IConversation,
  MessageFileData,
  ReplyTo,
} from "../../../utils/types/message";
import { GroupInfo_Reply } from "../../../weshnet";
import { weshClient } from "../../../weshnet/client";
import { getNewConversationText } from "../../../weshnet/client/messageHelpers";
import { sendMessage } from "../../../weshnet/client/services";
import {
  bytesFromString,
  stringFromBytes,
} from "../../../weshnet/client/utils";

interface ChatSectionProps {
  conversation: IConversation;
}
export interface HandleSendParams {
  message: string;
  files: MessageFileData[];
}

export const ChatSection = ({ conversation }: ChatSectionProps) => {
  const [message, setMessage] = useState<any>("");
  const [inputHeight, setInputHeight] = useState(40);
  const [replyTo, setReplyTo] = useState<ReplyTo>();
  const [inputRef, setInputRef] = useState<RefObject<any> | null>(null);
  const [file, setFile] = useState<MessageFileData>();

  const [searchInput, setSearchInput] = useState("");

  const { setToastError } = useFeedbacks();
  const [groupInfo, setGroupInfo] = useState<GroupInfo_Reply>();
  const messages = useSelector(
    selectMessageListByGroupPk(stringFromBytes(groupInfo?.group?.publicKey))
  );

  const searchResults = useMemo(() => {
    if (!searchInput) {
      return [];
    }
    return messages.filter((item) =>
      item?.payload?.message?.toLowerCase().includes(searchInput?.toLowerCase())
    );
  }, [messages, searchInput]);

  const getGroupInfo = useCallback(async () => {
    let _group: GroupInfo_Reply;

    try {
      if (conversation.type === "group") {
        _group = await weshClient.client.GroupInfo({
          groupPk: bytesFromString(conversation.id),
        });
        await weshClient.client.ActivateGroup({
          groupPk: _group.group?.publicKey,
        });
      } else {
        _group = await weshClient.client.GroupInfo({
          contactPk: bytesFromString(conversation.members[0].id),
        });
        await weshClient.client.ActivateGroup({
          groupPk: _group.group?.publicKey,
        });
      }

      setGroupInfo(_group);
    } catch (err: any) {
      setToastError({
        title: "Failed to get group info",
        message: err?.message,
      });
    }
  }, [conversation.id, conversation.members, conversation.type, setToastError]);

  useEffect(() => {
    getGroupInfo();
  }, [getGroupInfo]);

  const handleSend = async (data?: any) => {
    if (!message && !data?.message) {
      return;
    }
    try {
      await sendMessage({
        groupPk: groupInfo?.group?.publicKey,
        message: {
          type: "message",
          parentId: replyTo?.id || "",
          payload: {
            message: message || data?.message,
            files: data?.files || [],
          },
        },
      });

      setMessage("");
      setFile(undefined);
      setReplyTo(undefined);
      inputRef?.current?.focus();
    } catch (err: any) {
      setToastError({
        title: "Failed to send message",
        message: err?.message,
      });
    }
  };
  const { height } = useWindowDimensions();

  return (
    <View
      style={{
        height: height - 210,
      }}
    >
      <View
        style={{
          flex: 1,
          width: "100%",
        }}
      >
        <View style={{ zIndex: 11111 }}>
          <ChatHeader
            messages={messages}
            searchInput={searchInput}
            setSearchInput={setSearchInput}
            conversation={conversation}
          />
        </View>
        <Separator color={neutral33} />
        {!!searchInput && (
          <View
            style={{
              width: 500,
              maxWidth: "100%",
              height: "100%",
              backgroundColor: neutral33,
              position: "absolute",
              top: 0,
              right: 0,
              zIndex: 99,
            }}
          >
            {!searchResults.length && (
              <View
                style={{
                  alignItems: "center",
                  justifyContent: "center",
                  height: "100%",
                }}
              >
                <BrandText style={[fontSemibold14, { color: neutral77 }]}>
                  No result found
                </BrandText>
              </View>
            )}
            <FlatList
              data={searchResults}
              style={{
                paddingTop: 50,
              }}
              contentContainerStyle={{ flexGrow: 1 }}
              renderItem={({ item, index }) => {
                return (
                  <>
                    {/* <Conversation
                      onReply={setReplyTo}
                      conversation={item}
                      groupPk={groupInfo?.group?.publicKey}
                      isMessageChain={false}
                      isNextMine={false}
                    /> */}
                  </>
                );
              }}
              keyExtractor={(item) => item.id}
            />
          </View>
        )}

        {!messages.length && (
          <View
            style={{
              alignItems: "center",
              marginTop: layout.padding_x2,
            }}
          >
            <BrandText style={[fontSemibold12]}>
              {getNewConversationText(conversation)}
            </BrandText>
          </View>
        )}

        <FlatList
          inverted
          data={messages}
          style={{
            paddingVertical: layout.padding_x1_5,
          }}
          contentContainerStyle={{ flexGrow: 1 }}
          renderItem={({ item, index }) => {
            const previousMessage =
              index < messages.length - 1 ? messages[index + 1] : undefined;
            const nextMessage = index > 0 ? messages[index - 1] : undefined;

            const separatorDate = previousMessage
              ? moment(item.timestamp).format("DD/MM/YYYY") !==
                  moment(previousMessage.timestamp).format("DD/MM/YYYY") &&
                item.timestamp
              : item.timestamp;

            const isNewSeparator = !previousMessage?.isRead && item.isRead;
            const parentMessage = item?.parentId
              ? messages.find((msg) => msg.id === item.parentId)
              : undefined;

            if (item.type === "group-join") {
              return null;
            }
            return (
              <>
                <Conversation
                  conversation={conversation}
                  onReply={setReplyTo}
                  message={item}
                  groupPk={groupInfo?.group?.publicKey}
                  isMessageChain={previousMessage?.senderId === item.senderId}
                  isNextMine={nextMessage?.senderId === item.senderId}
                  parentMessage={parentMessage}
                />
                {(!!isNewSeparator || !!separatorDate) && (
                  <View
                    style={{
                      flexDirection: "row",
                      position: "relative",
                      alignItems: "center",
                      justifyContent: "center",
                      marginVertical: layout.padding_x2,
                      width: "80%",
                      alignSelf: "center",
                    }}
                  >
                    {!!separatorDate && (
                      <BrandText
                        style={[
                          fontSemibold10,
                          {
                            backgroundColor: neutral00,
                            paddingHorizontal: layout.padding_x2,
                            zIndex: 9,
                          },
                        ]}
                      >
                        {moment(separatorDate).format("DD/MM/YYYY")}
                      </BrandText>
                    )}

                    {!!isNewSeparator && (
                      <View
                        style={{
                          backgroundColor: redDefault,
                          paddingVertical: layout.padding_x0_25,
                          paddingHorizontal: layout.padding_x0_5,
                          borderRadius: 2,
                          zIndex: 9,
                          position: "absolute",
                          right: 0,
                        }}
                      >
                        <BrandText style={[fontSemibold10]}>New</BrandText>
                      </View>
                    )}
                    <View
                      style={{
                        width: "100%",
                        backgroundColor: isNewSeparator
                          ? redDefault
                          : neutral33,
                        height: 0.5,
                        position: "absolute",
                        zIndex: 0,
                      }}
                    />
                  </View>
                )}
              </>
            );
          }}
          keyExtractor={(item) => item.id}
        />

        <SpacerColumn size={3} />
      </View>
      {!!messages.length && (
        <View
          style={{
            flexDirection: "row",
            padding: layout.padding_x1,
            alignItems: "center",
          }}
        >
          <Dropdown triggerComponent={<SVG source={plus} />}>
            {({ closeOpenedDropdown }) => (
              <UploadImage onClose={closeOpenedDropdown} setFile={setFile} />
            )}
          </Dropdown>

          <SpacerRow size={2} />
          <View style={{ flex: 1 }}>
            {!!replyTo?.message && (
              <View
                style={{
                  backgroundColor: neutral33,
                  padding: layout.padding_x1,
                  marginLeft: layout.padding_x3,
                  borderRadius: 10,
                  maxWidth: 400,
                }}
              >
                <BrandText style={[fontSemibold12, { color: "white" }]}>
                  Reply to: {replyTo?.message}
                </BrandText>
              </View>
            )}
            <TextInputCustom
              autoFocus
              fullWidth
              setRef={setInputRef}
              containerStyle={{
                marginHorizontal: layout.padding_x0_5,
              }}
              height={Math.max(40, inputHeight)}
              name="message"
              placeHolder={
                replyTo?.message ? "Add reply message" : "Add a Message"
              }
              value={message}
              onChangeText={setMessage}
              label=""
              textInputStyle={{
                height: Math.max(20, inputHeight - 20),
              }}
              onSubmitEditing={() => {
                if (message.length) {
                  handleSend();
                }
              }}
              onContentSizeChange={(event) => {
                setInputHeight(event.nativeEvent.contentSize.height);
              }}
            >
              <TouchableOpacity onPress={handleSend}>
                <SVG source={sent} />
              </TouchableOpacity>
            </TextInputCustom>
          </View>
        </View>
      )}
      {!!file && (
        <UploadedPreview
          setFile={setFile}
          file={file}
          handleSend={handleSend}
        />
      )}
    </View>
  );
};

export const ChatSectionScreen: ScreenFC<"ChatSection"> = () => {
  const { params } = useAppRoute();
  return (
    <ScreenContainer noScroll>
      <ChatSection conversation={params as IConversation} />
    </ScreenContainer>
  );
};
