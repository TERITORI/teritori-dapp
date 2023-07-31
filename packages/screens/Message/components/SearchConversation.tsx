import moment from "moment";
import React from "react";
import { View, TouchableOpacity, Image } from "react-native";
import { Avatar } from "react-native-paper";

import { FileRenderer } from "./FileRenderer";
import { BrandText } from "../../../components/BrandText";
import FlexCol from "../../../components/FlexCol";
import FlexRow from "../../../components/FlexRow";
import {
  neutral77,
  secondaryColor,
  neutralA3,
  neutral30,
} from "../../../utils/style/colors";
import {
  fontBold10,
  fontMedium10,
  fontSemibold11,
} from "../../../utils/style/fonts";
import { layout } from "../../../utils/style/layout";
import { Conversation, Message, ReplyTo } from "../../../utils/types/message";
import { getConversationAvatar } from "../../../weshnet/client/messageHelpers";

interface SearchConversationProps {
  conversation: Conversation;
  message: Message;
  groupPk?: Uint8Array;
  parentMessage?: Message;
  onPress: () => void;
}

export const SearchConversation = ({
  conversation,
  message,
  parentMessage,
  onPress,
}: SearchConversationProps) => {
  const receiverName = "Anon";

  return (
    <TouchableOpacity onPress={onPress}>
      <FlexRow
        alignItems="flex-start"
        justifyContent="flex-start"
        style={{
          backgroundColor: neutral30,
          margin: layout.padding_x0_5,
          width: "100%",
          padding: layout.padding_x1,
          borderRadius: layout.padding_x0_25,
        }}
      >
        <View
          style={{
            width: 30,
            marginRight: layout.padding_x1,
          }}
        >
          <Avatar.Image
            source={{ uri: getConversationAvatar(conversation) }}
            size={30}
          />
        </View>

        <FlexCol style={{}} alignItems="flex-start">
          <FlexRow
            style={{
              marginBottom: layout.padding_x0_25,
            }}
          >
            <BrandText
              style={[
                fontBold10,
                {
                  color: secondaryColor,
                },
              ]}
            >
              {receiverName}
            </BrandText>
            <BrandText
              style={[
                fontMedium10,
                { color: neutral77, marginLeft: layout.padding_x1 },
              ]}
            >
              {moment(message.timestamp).local().format("MM/DD/YYYY hh:mm a")}
            </BrandText>
          </FlexRow>

          <View
            style={{
              paddingTop: layout.padding_x0_5,
            }}
          >
            {!!parentMessage?.id && (
              <FlexRow>
                <View
                  style={{
                    height: "100%",
                    width: 1,
                    backgroundColor: neutralA3,
                    paddingVertical: layout.padding_x1_5,
                    marginRight: layout.padding_x0_5,
                  }}
                />
                <BrandText style={[fontSemibold11, { color: neutral77 }]}>
                  {parentMessage?.payload?.message}
                </BrandText>
              </FlexRow>
            )}

            {["message", "group-invite"].includes(message.type) ? (
              <>
                <BrandText style={[fontSemibold11, { color: secondaryColor }]}>
                  {message?.payload?.message}
                </BrandText>
                {!!message?.payload?.files?.length && (
                  <FileRenderer
                    files={message?.payload?.files || []}
                    maxWidth={400}
                    waveFormMaxWidth={340}
                  />
                )}
              </>
            ) : (
              <></>
            )}

            {message?.payload?.files?.[0]?.type === "image" && (
              <Image
                source={{ uri: message?.payload.files[0].url }}
                style={{ height: 200, width: 120, borderRadius: 10 }}
              />
            )}
          </View>
        </FlexCol>
      </FlexRow>
    </TouchableOpacity>
  );
};
