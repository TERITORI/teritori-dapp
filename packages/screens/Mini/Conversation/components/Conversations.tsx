import moment from "moment";
import React, { useEffect, useState } from "react";
import { FlatList, View } from "react-native";

import { ChatInput } from "./ChatInput";
import { SingleConversation } from "./SingleConversation";
import closeSVG from "../../../../../assets/icons/close.svg";
import replySVG from "../../../../../assets/icons/reply-white.svg";
import { GroupInvitationAction } from "../../../Message/components/GroupInvitationAction";
import { ChatAvatar } from "../../components/ChatAvatar";

import { BrandText } from "@/components/BrandText";
import { SVG } from "@/components/SVG";
import { CustomPressable } from "@/components/buttons/CustomPressable";
import { Separator } from "@/components/separators/Separator";
import { SpacerColumn } from "@/components/spacer";
import {
  neutral00,
  neutral09,
  neutral22,
  neutral33,
  neutral99,
  neutralA3,
} from "@/utils/style/colors";
import {
  fontMedium16,
  fontSemibold12,
  fontSemibold14,
  fontSemibold22,
} from "@/utils/style/fonts";
import { layout } from "@/utils/style/layout";
import { Conversation, Message, ReplyTo } from "@/utils/types/message";
import { weshConfig } from "@/weshnet";
import {
  getConversationAvatar,
  getConversationName,
  getNewConversationText,
} from "@/weshnet/messageHelpers";
import { stringFromBytes } from "@/weshnet/utils";

const DefaultName = "Anon";

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
  const [replyTo, setReplyTo] = useState<ReplyTo>();
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

  if (messages.length === 0) {
    return (
      <View
        style={{
          backgroundColor: neutral09,
          marginTop: 50,
          paddingHorizontal: layout.spacing_x2,
          paddingVertical: layout.spacing_x2,
          borderRadius: layout.borderRadius,
          borderColor: neutralA3,
          borderWidth: 1,
        }}
      >
        <BrandText
          style={[
            fontMedium16,
            {
              textAlign: "center",
              lineHeight: 30,
              letterSpacing: 0.5,
              color: neutralA3,
            },
          ]}
        >
          {conversationItem && getNewConversationText(conversationItem)}
        </BrandText>
      </View>
    );
  }

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

            const parentMessage = item?.parentId
              ? messages.find((msg) => msg.id === item.parentId)
              : undefined;
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
                {item.type === "accept-contact" && !previousMessage && (
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
                            : []
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
                    parentMessage={parentMessage}
                    files={item?.payload?.files}
                    showMessageOptions={
                      longPressedMessageId
                        ? longPressedMessageId === item?.id
                        : false
                    }
                    onReplyPress={(msgId) =>
                      setReplyTo({
                        id: msgId,
                        message: item?.payload?.message || "",
                      })
                    }
                  />
                )}
              </>
            );
          }}
        />
      </View>
      <SpacerColumn size={1} />
      {replyTo?.id && (
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: layout.spacing_x1,
            backgroundColor: neutral22,
            borderRadius: 20,
            marginBottom: layout.spacing_x0_5,
            padding: layout.spacing_x1,
          }}
        >
          <View
            style={{
              backgroundColor: neutral33,
              borderRadius: 20,
              padding: layout.spacing_x0_5,
            }}
          >
            <SVG source={replySVG} height={22} width={22} />
          </View>
          <View style={{ flex: 1 }}>
            <BrandText style={[fontSemibold14, { color: neutral99 }]}>
              Reply To :
            </BrandText>
            <BrandText
              numberOfLines={2}
              style={[fontSemibold12, { color: neutral99 }]}
            >
              {replyTo.message}
            </BrandText>
          </View>
          <CustomPressable
            style={{
              backgroundColor: neutral33,
              borderRadius: 20,
              padding: layout.spacing_x0_5,
            }}
            onPress={() => setReplyTo(undefined)}
          >
            <SVG source={closeSVG} height={14} width={14} />
          </CustomPressable>
        </View>
      )}
      <ChatInput
        conversationId={conversationId}
        replyTo={replyTo}
        clearReplyTo={() => setReplyTo(undefined)}
      />
    </>
  );
};
