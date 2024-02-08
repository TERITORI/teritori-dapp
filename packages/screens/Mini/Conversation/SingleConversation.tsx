import { chain } from "lodash";
import React, { useMemo } from "react";
import { View } from "react-native";

import doubleCheckSVG from "../../../../assets/icons/double-check.svg";
import replySVG from "../../../../assets/icons/reply-white.svg";
import { BrandText } from "../../../components/BrandText";
import { SVG } from "../../../components/SVG";
import { CustomPressable } from "../../../components/buttons/CustomPressable";
import { EmojiSelector } from "../../../components/socialFeed/EmojiSelector";
import {
  blueDefault,
  eggWhite,
  neutral30,
  neutralA3,
  secondaryColor,
} from "../../../utils/style/colors";
import {
  fontMedium10,
  fontNormal15,
  fontSemibold11,
} from "../../../utils/style/fonts";
import { layout } from "../../../utils/style/layout";
import { Message } from "../../../utils/types/message";
import { sendMessage } from "../../../weshnet/services";
import { bytesFromString } from "../../../weshnet/utils";
import { PostReactions } from "../Feed/components/PostReactions";

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
  parentMessage?: Message | undefined;
};
export const SingleConversation = ({
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
  parentMessage,
}: ConversationType) => {
  const reactionsMade = useMemo(() => {
    if (!reactions?.length) {
      return [];
    }

    return chain(reactions || [])
      .groupBy(message)
      .map((value, key) => {
        return {
          icon: value?.[0]?.payload?.message || "",
          count: value.length,
          ownState: false,
        };
      })
      .value();
  }, [message, reactions]);

  const onEmojiSelected = async (emoji: string | null) => {
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
          {!!parentMessage?.id && (
            <View
              style={{
                flexDirection: "row",
                marginBottom: layout.spacing_x0_5,
              }}
            >
              <View
                style={{
                  height: "100%",
                  width: 3,
                  backgroundColor: neutralA3,
                  paddingVertical: layout.spacing_x1_5,
                  marginRight: layout.spacing_x0_5,
                }}
              />
              <BrandText
                style={[
                  fontSemibold11,
                  { color: isMyMessage ? neutralA3 : eggWhite },
                ]}
                numberOfLines={2}
              >
                {parentMessage?.payload?.message}
              </BrandText>
            </View>
          )}
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
      <View
        style={{ alignSelf: isMyMessage ? "flex-end" : "flex-start", flex: 1 }}
      >
        <PostReactions reactions={reactionsMade} onPressReaction={() => {}} />
      </View>
    </View>
  );
};
