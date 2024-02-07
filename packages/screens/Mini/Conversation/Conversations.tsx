import { chain } from "lodash";
import moment from "moment";
import React, { useEffect, useMemo, useState } from "react";
import { FlatList, View } from "react-native";

import { ChatInput } from "./ChatInput";
import doubleCheckSVG from "../../../../assets/icons/double-check.svg";
import replySVG from "../../../../assets/icons/reply-white.svg";
import { BrandText } from "../../../components/BrandText";
import { SVG } from "../../../components/SVG";
import { CustomPressable } from "../../../components/buttons/CustomPressable";
import { Separator } from "../../../components/separators/Separator";
import { EmojiSelector } from "../../../components/socialFeed/EmojiSelector";
import { SpacerColumn } from "../../../components/spacer";
import {
  blueDefault,
  neutral00,
  neutral30,
  secondaryColor,
} from "../../../utils/style/colors";
import {
  fontMedium10,
  fontNormal15,
  fontSemibold14,
  fontSemibold22,
} from "../../../utils/style/fonts";
import { layout } from "../../../utils/style/layout";
import { Conversation, Message } from "../../../utils/types/message";
import { weshConfig } from "../../../weshnet";
import {
  getConversationAvatar,
  getConversationName,
} from "../../../weshnet/messageHelpers";
import { sendMessage } from "../../../weshnet/services";
import { bytesFromString, stringFromBytes } from "../../../weshnet/utils";
import { GroupInvitationAction } from "../../Message/components/GroupInvitationAction";
import { PostReactions } from "../Feed/components/PostReactions";
import { ChatAvatar } from "../components/ChatAvatar";

const DefaultName = "Anon";

type ConversationType = {
  messageId: string;
  conversationId: string;
  date: string;
  message: string;
  isMyMessage: boolean;
  status: string;
  reactions?: any;
  onLongPress?: (messageId: string) => void;
  onReplyPress?: (messageId: string) => void;
  showMessageOptions?: boolean;
};

type Props = {
  messages: Message[];
  isTyping: boolean;
  conversationItem?: Conversation;
  contactMessages: Message[];
  conversationId: string;
};

export const Conversations = ({
  isTyping,
  messages,
  conversationItem,
  conversationId,
  contactMessages,
}: Props) => {
  const [lastReadMessage, setLastReadMessage] = useState<Message | undefined>();
  const [replyTo, setReplyTo] = useState("");
  const [longPressedMessageId, setLongPressedMessageId] = useState("");

  useEffect(() => {
    const lastReadMessageIndex = messages.findIndex(
      (item) => item?.id === conversationItem?.lastReadIdByMe,
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
      nextMessage.id !== conversationItem?.lastReadIdByMe &&
      lastReadMessage?.id !== nextMessage.id
    ) {
      setLastReadMessage(nextMessage);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [conversationItem, messages]);

  const handleLongPressMessage = (msgId: string) => {
    setLongPressedMessageId(msgId);
  };

  return (
    <>
      <View
        style={{
          flex: 1,
          paddingBottom: layout.spacing_x2,
        }}
      >
        <FlatList
          data={messages}
          inverted
          keyExtractor={(item) => item.id}
          renderItem={({ item, index }) => {
            const previousMessage =
              index < messages.length - 1 ? messages[index + 1] : undefined;

            const separatorDate = previousMessage
              ? moment(item.timestamp).format("DD/MM/YYYY") !==
                  moment(previousMessage.timestamp).format("DD/MM/YYYY") &&
                item.timestamp
              : item.timestamp;

            if (item.type === "group-join") {
              return null;
            }

            const isSender =
              item?.senderId === stringFromBytes(weshConfig?.config?.accountPk);

            return (
              <>
                {!!separatorDate && (
                  <View
                    style={{
                      position: "relative",
                      flexDirection: "row",
                      justifyContent: "center",
                    }}
                  >
                    <Separator style={{ position: "absolute", top: 10 }} />
                    <BrandText
                      style={[
                        fontSemibold14,
                        {
                          backgroundColor: neutral00,
                          zIndex: 10,
                          paddingHorizontal: layout.spacing_x2,
                          textAlign: "center",
                          marginBottom: layout.spacing_x3,
                        },
                      ]}
                    >
                      {moment(separatorDate).format("YYYY, MMM DD")}
                    </BrandText>
                  </View>
                )}
                {item.type === "accept-contact" && (
                  <View style={{ marginBottom: layout.spacing_x5 }}>
                    <View
                      style={{
                        alignItems: "center",
                        marginTop: layout.spacing_x2_5,
                      }}
                    >
                      <ChatAvatar
                        membersAvatar={
                          conversationItem
                            ? conversationItem?.members.map((_, index) =>
                                getConversationAvatar(conversationItem, index),
                              )
                            : [""]
                        }
                        size="xlg"
                        hideStatusIndicator
                      />
                      <BrandText
                        style={[
                          fontSemibold22,
                          { marginTop: layout.spacing_x1 },
                        ]}
                      >
                        {conversationItem
                          ? getConversationName(conversationItem)
                          : DefaultName}
                      </BrandText>
                    </View>
                  </View>
                )}

                {item?.type === "group-invite" && !isSender && (
                  <GroupInvitationAction message={item} />
                )}

                {item.type !== "accept-contact" && (
                  <SingleConversation
                    date={moment(item?.timestamp).format("hh:mm a")}
                    conversationId={item.groupId}
                    messageId={item.id}
                    isMyMessage={isSender}
                    message={item?.payload?.message || ""}
                    status=""
                    reactions={item?.reactions}
                    onLongPress={handleLongPressMessage}
                    showMessageOptions={
                      longPressedMessageId
                        ? longPressedMessageId === item?.id
                        : false
                    }
                    onReplyPress={setReplyTo}
                  />
                )}
              </>
            );
          }}
        />
      </View>
      <SpacerColumn size={1} />
      <ChatInput conversationId={conversationId} />
    </>
  );
};

const SingleConversation = ({
  date,
  isMyMessage,
  message,
  status,
  reactions,
  messageId,
  conversationId,
  onLongPress,
  onReplyPress,
  showMessageOptions,
}: ConversationType) => {
  const reactionsMade = useMemo(() => {
    if (reactions?.length) {
      return [];
    }
    return chain(reactions || [])
      .groupBy(message)
      .map((value, key) => ({
        icon: value?.[0]?.payload?.message || "",
        count: value.length,
        ownState: false,
      }))
      .value();
  }, [message, reactions]);

  const onEmojiSelected = async (emoji: string | null) => {
    console.log(emoji);

    if (emoji) {
      await sendMessage({
        groupPk: bytesFromString(conversationId),
        message: {
          type: "reaction",
          parentId: messageId,
          payload: {
            message: emoji,
            files: [],
          },
        },
      });
      if (onLongPress) {
        onLongPress("");
      }
    }
  };

  const onLongPressMessage = () => {
    if (onLongPress) {
      onLongPress(showMessageOptions ? "" : messageId);
    }
  };

  const onMessageReplyPress = () => {
    if (onReplyPress) {
      onReplyPress(messageId);
    }
    if (onLongPress) {
      onLongPress("");
    }
  };

  return (
    <View
      style={{
        marginBottom: reactionsMade.length > 0 ? layout.spacing_x1_5 : "auto",
      }}
    >
      <CustomPressable
        onLongPress={onLongPressMessage}
        style={{
          flex: 1,
          flexDirection: isMyMessage ? "row-reverse" : "row",
          alignItems: "center",
          gap: layout.spacing_x1,
        }}
      >
        <View
          style={{
            borderTopStartRadius: isMyMessage ? 10 : 2,
            borderBottomStartRadius: isMyMessage ? 10 : 2,
            borderTopEndRadius: isMyMessage ? 2 : 10,
            borderBottomEndRadius: isMyMessage ? 2 : 10,
            backgroundColor: isMyMessage ? neutral30 : blueDefault,
            paddingHorizontal: layout.spacing_x2,
            paddingVertical: 6,
            alignSelf: isMyMessage ? "flex-end" : "flex-start",
            marginBottom: layout.spacing_x0_5,
            maxWidth: "90%",
          }}
        >
          <BrandText
            style={[
              fontNormal15,
              {
                color: secondaryColor,
                width: "auto",
                paddingRight: 38,
              },
            ]}
          >
            {message}
          </BrandText>
          <View
            style={{
              flexDirection: "row",
              gap: layout.spacing_x0_25,
              alignSelf: "flex-end",
            }}
          >
            <BrandText
              style={[
                fontMedium10,
                {
                  color: secondaryColor,
                  width: "auto",
                  margin: layout.spacing_x0_25,
                },
              ]}
            >
              {date}
            </BrandText>
            <SVG source={doubleCheckSVG} height={16} width={16} />
          </View>
        </View>
        {showMessageOptions && (
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: layout.spacing_x0_75,
            }}
          >
            <EmojiSelector onEmojiSelected={onEmojiSelected} />
            <CustomPressable onPress={onMessageReplyPress}>
              <SVG source={replySVG} height={22} width={22} />
            </CustomPressable>
          </View>
        )}
      </CustomPressable>
      <PostReactions reactions={reactionsMade} onPressReaction={() => {}} />
    </View>
  );
};
