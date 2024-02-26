import React, { useEffect, useMemo, useState } from "react";
import { SafeAreaView, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";

import { ChatHeader } from "./ChatHeader";
import { Conversations } from "./Conversations";

import { KeyboardAvoidingView } from "@/components/KeyboardAvoidingView";
import { SpacerRow } from "@/components/spacer";
import {
  selectConversationById,
  selectMessageList,
  updateConversationById,
} from "@/store/slices/message";
import { RootState } from "@/store/store";
import { ScreenFC } from "@/utils/navigation";
import { layout } from "@/utils/style/layout";
import { weshConfig } from "@/weshnet";
import { sendMessage } from "@/weshnet/services";
import { bytesFromString, stringFromBytes } from "@/weshnet/utils";

export const ConversationScreeen: ScreenFC<"Conversation"> = ({
  navigation,
  route,
}) => {
  const { conversationId } = route.params;
  const dispatch = useDispatch();

  const [lastReadProcessedId, setLastReadProcessedId] = useState("");
  const conversationItem = useSelector((state: RootState) =>
    selectConversationById(state, conversationId),
  );

  const messages = useSelector((state: RootState) =>
    selectMessageList(state, conversationId),
  );

  const contactMessages = useMemo(
    () =>
      messages.filter(
        (item) =>
          item.senderId !== stringFromBytes(weshConfig.config?.accountPk),
      ),
    [messages],
  );

  const handleRead = async (lastMessageId: string) => {
    if (lastReadProcessedId === lastMessageId) {
      return;
    }

    setLastReadProcessedId(lastMessageId);
    try {
      if (!lastMessageId) {
        return;
      }
      if (conversationItem?.type === "group") {
        dispatch(
          updateConversationById({
            id: conversationId,
            lastReadIdByMe: lastMessageId,
          }),
        );
      } else {
        await sendMessage({
          groupPk: bytesFromString(conversationId),
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
    if (!conversationItem?.id || !contactMessages?.length) {
      return;
    }

    if (contactMessages?.[0]?.id !== conversationItem.lastReadIdByMe) {
      handleRead(contactMessages?.[0]?.id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [conversationItem, contactMessages, navigation.isFocused]);

  return (
    <SafeAreaView
      style={{
        flex: 1,
        width: "100%",
        backgroundColor: "#000000",
      }}
    >
      <View style={{ paddingHorizontal: layout.spacing_x2, flex: 1 }}>
        <KeyboardAvoidingView extraVerticalOffset={-10}>
          <ChatHeader navigation={navigation} conversation={conversationItem} />
          <SpacerRow size={4} />
          <Conversations
            messages={messages}
            contactMessages={contactMessages}
            isTyping={false}
            conversationItem={conversationItem}
            conversationId={conversationId}
          />
        </KeyboardAvoidingView>
      </View>
    </SafeAreaView>
  );
};
