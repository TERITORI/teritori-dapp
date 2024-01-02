import moment from "moment";
import React, { RefObject, useEffect, useMemo, useRef, useState } from "react";
import {
  View,
  TouchableOpacity,
  useWindowDimensions,
  FlatList,
  Platform,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";

import { ChatHeader } from "./ChatHeader";
import { Conversation } from "./Conversation";
import { SearchConversation } from "./SearchConversation";
import closeSVG from "../../../../assets/icons/close.svg";
import sent from "../../../../assets/icons/sent.svg";
import { BrandText } from "../../../components/BrandText";
import { KeyboardAvoidingView } from "../../../components/KeyboardAvoidingView";
import { SVG } from "../../../components/SVG";
import { ScreenContainer } from "../../../components/ScreenContainer";
import { TextInputCustom } from "../../../components/inputs/TextInputCustom";
import { Separator } from "../../../components/separators/Separator";
import { SpacerColumn, SpacerRow } from "../../../components/spacer";
import { useFeedbacks } from "../../../context/FeedbacksProvider";
import { useMessage } from "../../../context/MessageProvider";
import { useIsMobile } from "../../../hooks/useIsMobile";
import {
  selectConversationById,
  selectMessageList,
  updateConversationById,
} from "../../../store/slices/message";
import { RootState } from "../../../store/store";
import {
  ScreenFC,
  useAppNavigation,
  useAppRoute,
} from "../../../utils/navigation";
import {
  neutral00,
  neutral33,
  neutral77,
  neutralA3,
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
  Message,
  ReplyTo,
} from "../../../utils/types/message";
import { weshConfig } from "../../../weshnet";
import { getNewConversationText } from "../../../weshnet/messageHelpers";
import { sendMessage } from "../../../weshnet/services";
import { bytesFromString, stringFromBytes } from "../../../weshnet/utils";
interface ChatSectionProps {
  conversation: IConversation;
}

export const ChatSection = ({ conversation }: ChatSectionProps) => {
  const [message, setMessage] = useState<any>("");
  const [inputHeight, setInputHeight] = useState(40);
  const [replyTo, setReplyTo] = useState<ReplyTo>();
  const [inputRef, setInputRef] = useState<RefObject<any> | null>(null);
  const dispatch = useDispatch();
  const isMobile = useIsMobile();

  const [lastReadProcessedId, setLastReadProcessedId] = useState("");
  const conversationItem = useSelector((state: RootState) =>
    selectConversationById(state, conversation.id),
  );
  const [lastReadMessage, setLastReadMessage] = useState<Message | undefined>();

  const { setActiveConversation } = useMessage();

  const [searchInput, setSearchInput] = useState("");

  const flatListRef = useRef<FlatList>(null);

  const { setToastError } = useFeedbacks();
  const messages = useSelector((state: RootState) =>
    selectMessageList(state, conversation.id),
  );

  const contactMessages = useMemo(
    () =>
      messages.filter(
        (item) =>
          item.senderId !== stringFromBytes(weshConfig.config?.accountPk),
      ),
    [messages],
  );

  const lastContactReadMessageIndex = useMemo(() => {
    const message = messages.find(
      (item) => item.id === conversationItem?.lastReadIdByContact,
    );
    if (!message) {
      return null;
    }

    const index = messages.findIndex((msg) => msg.id === message?.id);
    if (index === -1) {
      return null;
    }
    return index;
  }, [conversationItem, messages]);

  const searchResults = useMemo(() => {
    if (!searchInput) {
      return [];
    }
    return messages.filter(
      (item) =>
        item?.payload?.message
          ?.toLowerCase()
          .includes(searchInput?.toLowerCase()),
    );
  }, [messages, searchInput]);

  const handleSend = async (data?: any) => {
    if (!message && !data?.message) {
      return;
    }

    try {
      await sendMessage({
        groupPk: bytesFromString(conversation.id),
        message: {
          type: "message",
          parentId: replyTo?.id || "",
          payload: {
            message: message || data?.message,
            files: [],
          },
        },
      });

      setMessage("");
      setReplyTo(undefined);
      inputRef?.current?.focus();
    } catch (err: any) {
      setToastError({
        title: "Failed to send message",
        message: err?.message,
      });
    }
  };
  const { width } = useWindowDimensions();

  const handleRead = async (lastMessageId: string) => {
    if (lastReadProcessedId === lastMessageId) {
      return;
    }

    setLastReadProcessedId(lastMessageId);
    try {
      if (!lastMessageId) {
        return;
      }
      if (conversation.type === "group") {
        dispatch(
          updateConversationById({
            id: conversation.id,
            lastReadIdByMe: lastMessageId,
          }),
        );
      } else {
        await sendMessage({
          groupPk: bytesFromString(conversation.id),
          message: {
            type: "read",
            payload: {
              message: "-",
              metadata: {
                lastReadBy: stringFromBytes(weshConfig.config?.accountPk),
                lastReadId: lastMessageId,
              },
              files: [],
            },
          },
        });
      }
    } catch {}
  };

  useEffect(() => {
    const lastReadMessageIndex = messages.findIndex(
      (item) => item?.id === conversation?.lastReadIdByMe,
    );
    if (lastReadMessageIndex === -1) {
      return;
    }

    const nextContactMessages = messages.filter(
      (item, index) =>
        index < lastReadMessageIndex &&
        item.senderId !== stringFromBytes(weshConfig.config?.accountPk),
    );

    const nextMessage = nextContactMessages[nextContactMessages.length - 1];

    if (
      nextMessage &&
      nextMessage.id !== conversation.lastReadIdByMe &&
      lastReadMessage?.id !== nextMessage.id
    ) {
      setLastReadMessage(nextMessage);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [conversation, messages]);

  useEffect(() => {
    if (!conversationItem?.id || !contactMessages?.length) {
      return;
    }

    if (contactMessages?.[0]?.id !== conversationItem.lastReadIdByMe) {
      handleRead(contactMessages?.[0]?.id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [conversationItem, contactMessages]);

  return (
    <KeyboardAvoidingView extraVerticalOffset={32}>
      <View style={[{ flex: 1, width: isMobile ? width : "100%" }]}>
        <View style={{ flex: 1 }}>
          <View style={{ zIndex: 11111 }}>
            <ChatHeader
              searchInput={searchInput}
              setSearchInput={setSearchInput}
              conversation={conversation}
              onBackPress={
                isMobile ? () => setActiveConversation(undefined) : undefined
              }
            />
          </View>
          <Separator color={neutral33} />
          {!!searchInput && (
            <View
              style={{
                width: "100%",
                maxWidth: 500,
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
                  paddingTop: 48,
                }}
                contentContainerStyle={{ flexGrow: 1 }}
                renderItem={({ item, index }) => {
                  return (
                    <>
                      <SearchConversation
                        onPress={() => {
                          setSearchInput("");
                          flatListRef.current?.scrollToIndex({
                            index: messages.findIndex(
                              (message) => message.id === item.id,
                            ),
                          });
                        }}
                        conversation={conversation}
                        message={item}
                        groupPk={bytesFromString(conversation.id)}
                      />
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
                marginTop: layout.spacing_x2,
              }}
            >
              <BrandText style={[fontSemibold12]}>
                {getNewConversationText(conversation)}
              </BrandText>
            </View>
          )}

          <FlatList
            ref={flatListRef}
            inverted
            data={messages}
            style={{
              paddingVertical: layout.spacing_x1_5,
            }}
            renderItem={({ item, index }) => {
              const previousMessage =
                index < messages.length - 1 ? messages[index + 1] : undefined;
              const nextMessage = index > 0 ? messages[index - 1] : undefined;

              const separatorDate = previousMessage
                ? moment(item.timestamp).format("DD/MM/YYYY") !==
                    moment(previousMessage.timestamp).format("DD/MM/YYYY") &&
                  item.timestamp
                : item.timestamp;

              let isNewSeparator = false;

              if (lastReadMessage?.id) {
                if (lastReadMessage.id === contactMessages?.[0]?.id) {
                  isNewSeparator = false;
                } else if (lastReadMessage.id === item?.id) {
                  isNewSeparator = true;
                }
              }
              const isReadByContact =
                lastContactReadMessageIndex === null
                  ? false
                  : index >= lastContactReadMessageIndex;

              const parentMessage = item?.parentId
                ? messages.find((msg) => msg.id === item.parentId)
                : undefined;

              if (item.type === "group-join") {
                return null;
              }

              return (
                <>
                  {item.type !== "accept-contact" && (
                    <Conversation
                      conversation={conversation}
                      onReply={setReplyTo}
                      message={item}
                      groupPk={bytesFromString(conversation.id)}
                      isMessageChain={
                        previousMessage?.senderId === item.senderId
                      }
                      isNextMine={nextMessage?.senderId === item.senderId}
                      parentMessage={parentMessage}
                      isReadByContact={isReadByContact}
                    />
                  )}
                  {item.type === "accept-contact" && (
                    <View style={{ alignItems: "center" }}>
                      <BrandText style={[fontSemibold10, { color: neutralA3 }]}>
                        Contact accepted
                      </BrandText>
                    </View>
                  )}
                  {(!!isNewSeparator || !!separatorDate) && (
                    <View
                      style={{
                        flexDirection: "row",
                        position: "relative",
                        alignItems: "center",
                        justifyContent: "center",
                        marginVertical: layout.spacing_x2,
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
                              paddingHorizontal: layout.spacing_x2,
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
                            paddingVertical: layout.spacing_x0_25,
                            paddingHorizontal: layout.spacing_x0_5,
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
              padding: layout.spacing_x1,
              alignItems: "center",
            }}
          >
            <SpacerRow size={2} />
            <View style={{ flex: 1 }}>
              {!!replyTo?.message && (
                <View
                  style={{
                    backgroundColor: neutral33,
                    padding: layout.spacing_x1,
                    marginLeft: layout.spacing_x3,
                    borderRadius: 10,
                    maxWidth: 400,
                    flexDirection: "row",
                    justifyContent: "space-between",
                  }}
                >
                  <BrandText
                    style={[fontSemibold12, { color: "white", maxWidth: 300 }]}
                    numberOfLines={1}
                  >
                    Reply to: {replyTo?.message}
                  </BrandText>
                  <TouchableOpacity
                    onPress={() => {
                      setReplyTo(undefined);
                    }}
                    activeOpacity={0.9}
                  >
                    <SVG source={closeSVG} />
                  </TouchableOpacity>
                </View>
              )}
              <TextInputCustom
                fullWidth
                setRef={setInputRef}
                autoFocus={Platform.OS === "web"}
                height={
                  Platform.OS === "web"
                    ? undefined
                    : Math.max(50, Math.min(inputHeight - 50, 120))
                }
                name="message"
                placeHolder={
                  replyTo?.message ? "Add reply message" : "Add a Message"
                }
                multiline
                numberOfLines={6}
                value={message}
                onChangeText={setMessage}
                label=""
                hideLabel
                blurOnSubmit={false}
                textInputStyle={{
                  height: Math.max(30, Math.min(inputHeight - 30, 100)),
                }}
                onSubmitEditing={() => {
                  if (message.length) {
                    handleSend();
                  }
                }}
                onContentSizeChange={(event) => {
                  setInputHeight(event.nativeEvent.contentSize.height);
                }}
                onKeyPress={(e) => {
                  if (
                    Platform.OS === "web" &&
                    e.nativeEvent.key === "Enter" &&
                    //@ts-ignore
                    !e?.shiftKey
                  ) {
                    e.preventDefault();
                    if (message.length) {
                      handleSend();
                    }
                  }
                }}
              >
                <TouchableOpacity onPress={handleSend}>
                  <SVG source={sent} />
                </TouchableOpacity>
              </TextInputCustom>
            </View>
          </View>
        )}
      </View>
    </KeyboardAvoidingView>
  );
};

export const ChatSectionScreen: ScreenFC<"ChatSection"> = () => {
  const { params } = useAppRoute();
  const { navigate } = useAppNavigation();
  return (
    <ScreenContainer
      noScroll
      fullWidth
      noMargin
      onBackPress={() => navigate("Message")}
      footerChildren={<></>}
    >
      <ChatSection conversation={params as IConversation} />
    </ScreenContainer>
  );
};
