import moment from "moment";
import React from "react";
import { View, TouchableOpacity, Image } from "react-native";

import { Avatar } from "./Avatar";
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
  fontBold9,
  fontMedium10,
  fontSemibold11,
} from "../../../utils/style/fonts";
import { layout } from "../../../utils/style/layout";
import { Conversation, Message } from "../../../utils/types/message";
import { getConversationAvatar } from "../../../weshnet/messageHelpers";

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
          margin: layout.spacing_x0_5,
          width: "100%",
          padding: layout.spacing_x1,
          borderRadius: layout.spacing_x0_25,
        }}
      >
        <View
          style={{
            width: 30,
            marginRight: layout.spacing_x1,
          }}
        >
          <Avatar source={getConversationAvatar(conversation)} size={30} />
        </View>

        <FlexCol style={{}} alignItems="flex-start">
          <FlexRow
            style={{
              marginBottom: layout.spacing_x0_25,
            }}
          >
            <BrandText
              style={[
                fontBold9,
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
                { color: neutral77, marginLeft: layout.spacing_x1 },
              ]}
            >
              {moment(message.timestamp).local().format("MM/DD/YYYY hh:mm a")}
            </BrandText>
          </FlexRow>

          <View
            style={{
              paddingTop: layout.spacing_x0_5,
            }}
          >
            {!!parentMessage?.id && (
              <FlexRow>
                <View
                  style={{
                    height: "100%",
                    width: 1,
                    backgroundColor: neutralA3,
                    paddingVertical: layout.spacing_x1_5,
                    marginRight: layout.spacing_x0_5,
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
