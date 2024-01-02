import { chain } from "lodash";
import moment from "moment";
import React, { useMemo, useState } from "react";
import { View, TouchableOpacity } from "react-native";

import { Avatar } from "./Avatar";
import { FileRenderer } from "./FileRenderer";
import { GroupInvitationAction } from "./GroupInvitationAction";
import { MessagePopup } from "./MessagePopup";
import doubleCheckSVG from "../../../../assets/icons/double-check.svg";
import replySVG from "../../../../assets/icons/reply.svg";
import { BrandText } from "../../../components/BrandText";
import { Dropdown } from "../../../components/Dropdown";
import FlexCol from "../../../components/FlexCol";
import FlexRow from "../../../components/FlexRow";
import { SVG } from "../../../components/SVG";
import { EmojiSelector } from "../../../components/socialFeed/EmojiSelector";
import { Reactions } from "../../../components/socialFeed/SocialActions/Reactions";
import { SpacerRow } from "../../../components/spacer";
import {
  neutral77,
  secondaryColor,
  purpleDark,
  neutral17,
  neutralA3,
} from "../../../utils/style/colors";
import {
  fontBold9,
  fontMedium10,
  fontSemibold11,
  fontSemibold13,
} from "../../../utils/style/fonts";
import { layout } from "../../../utils/style/layout";
import {
  Conversation as IConversation,
  Message,
  ReplyTo,
} from "../../../utils/types/message";
import { weshConfig } from "../../../weshnet";
import { getConversationAvatar } from "../../../weshnet/messageHelpers";
import { sendMessage } from "../../../weshnet/services";
import { stringFromBytes } from "../../../weshnet/utils";

interface ConversationProps {
  conversation: IConversation;
  message: Message;
  groupPk?: Uint8Array;
  isMessageChain: boolean;
  isNextMine: boolean;
  onReply: (params: ReplyTo) => void;
  parentMessage?: Message;
  isReadByContact?: boolean;
}

export const Conversation = ({
  conversation,
  message,
  groupPk,
  isMessageChain,
  isNextMine,
  onReply,
  parentMessage,
  isReadByContact,
}: ConversationProps) => {
  const [showPopup, setShowPopup] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  const isSender =
    message.senderId === stringFromBytes(weshConfig?.config?.accountPk);

  const reactions = useMemo(() => {
    if (!message?.reactions?.length) {
      return [];
    }
    return chain(message.reactions || [])
      .groupBy(message?.payload?.message)
      .map((value, key) => ({
        icon: value?.[0]?.payload?.message || "",
        count: value.length,
        ownState: false,
      }))
      .value();
  }, [message?.payload?.message, message?.reactions]);

  const onEmojiSelected = async (emoji: string | null) => {
    if (emoji) {
      await sendMessage({
        groupPk,
        message: {
          type: "reaction",
          parentId: message.id,
          payload: {
            message: emoji,
            files: [],
          },
        },
      });
    }
  };

  const receiverName = "Anon";

  return (
    <FlexRow
      alignItems="flex-start"
      justifyContent={isSender ? "flex-end" : "flex-start"}
      style={{
        paddingHorizontal: layout.spacing_x1,
        marginBottom:
          reactions.length && isNextMine
            ? layout.spacing_x3_5
            : layout.spacing_x0_25,
      }}
    >
      {!isSender && (
        <View
          style={{
            width: 30,
            marginRight: layout.spacing_x1_5,
            marginTop: layout.spacing_x1,
          }}
        >
          {!isMessageChain && (
            <Avatar source={getConversationAvatar(conversation)} size={30} />
          )}
        </View>
      )}
      <FlexCol
        style={{
          maxWidth: "40%",
          width: "auto",
        }}
        alignItems={isSender ? "flex-end" : "flex-start"}
      >
        {(!isMessageChain || isSender) && (
          <FlexRow
            style={{
              marginBottom: layout.spacing_x0_25,
              justifyContent: "space-between",
            }}
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
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
                {isSender ? "Me" : receiverName}
              </BrandText>
              <BrandText
                style={[
                  fontMedium10,
                  { color: neutral77, marginLeft: layout.spacing_x0_5 },
                ]}
              >
                {moment(message.timestamp).local().format("HH:mm")}
              </BrandText>
            </View>
            {isSender && !!isReadByContact && (
              <SVG
                source={doubleCheckSVG}
                height={16}
                width={16}
                style={{
                  marginLeft: layout.spacing_x0_5,
                }}
              />
            )}
          </FlexRow>
        )}
        <TouchableOpacity
          style={{
            backgroundColor: isSender ? neutral17 : purpleDark,
            paddingVertical: 8,
            paddingHorizontal: 16,
            borderBottomLeftRadius: layout.spacing_x0_75,
            borderBottomRightRadius: layout.spacing_x0_75,
            borderTopRightRadius: layout.spacing_x0_75,
          }}
          onPress={() => setShowPopup(true)}
          activeOpacity={0.9}
          disabled={isSender}
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

          {["message", "group-invite"].includes(message.type) && (
            <>
              <BrandText style={[fontSemibold13, { color: secondaryColor }]}>
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
          )}

          {message?.type === "group-invite" && !isSender && (
            <GroupInvitationAction message={message} />
          )}

          {!isSender && (
            <>
              {showPopup && (
                <Dropdown
                  onDropdownClosed={() => setShowPopup(false)}
                  positionStyle={{
                    bottom: -10,
                    right: -100,
                  }}
                >
                  <View
                    style={{
                      backgroundColor: "rgba(41, 41, 41, 0.8)",
                      paddingVertical: 6,
                      paddingHorizontal: 10,
                      borderRadius: 6,
                      width: "auto",
                    }}
                  >
                    <FlexRow>
                      <EmojiSelector
                        onEmojiSelected={(emoji) => {
                          onEmojiSelected(emoji);
                          setShowPopup(false);
                        }}
                      />
                      <SpacerRow size={1} />
                      <TouchableOpacity onPress={() => setShowMenu(true)}>
                        <SVG
                          source={replySVG}
                          height={16}
                          width={16}
                          color={neutralA3}
                        />
                      </TouchableOpacity>
                    </FlexRow>
                  </View>
                </Dropdown>
              )}
              {showMenu && (
                <Dropdown
                  onDropdownClosed={() => setShowMenu(false)}
                  positionStyle={{
                    bottom: -10,
                    right: -240,
                  }}
                >
                  <MessagePopup
                    onClose={() => setShowMenu(false)}
                    message={message?.payload?.message || ""}
                    onReply={() => {
                      onReply({
                        id: message.id,
                        message: message?.payload?.message || "",
                      });
                    }}
                  />
                </Dropdown>
              )}
            </>
          )}
        </TouchableOpacity>
        <View
          style={{
            position: "absolute",
            right: 0,
            bottom: -22,
          }}
        >
          <Reactions reactions={reactions} onPressReaction={() => {}} />
        </View>
      </FlexCol>
    </FlexRow>
  );
};
