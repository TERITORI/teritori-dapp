import { chain } from "lodash";
import moment from "moment";
import React, { useMemo, useState } from "react";
import { View, StyleSheet, TouchableOpacity, Image } from "react-native";

import { FileRenderer } from "./FileRenderer";
import { GroupInvitationAction } from "./GroupInvitationAction";
import { MessagePopup } from "./MessagePopup";
import avatar from "../../../../assets/icons/avatar.svg";
import reply from "../../../../assets/icons/reply.svg";
import { BrandText } from "../../../components/BrandText";
import { Dropdown } from "../../../components/Dropdown";
import FlexCol from "../../../components/FlexCol";
import FlexRow from "../../../components/FlexRow";
import { SVG } from "../../../components/SVG";
import { EmojiSelector } from "../../../components/socialFeed/EmojiSelector";
import { Reactions } from "../../../components/socialFeed/SocialActions/Reactions";
import { DateTime } from "../../../components/socialFeed/SocialThread/DateTime";
import { SpacerRow } from "../../../components/spacer";
import {
  neutral77,
  secondaryColor,
  purpleDark,
  neutral17,
  neutralA3,
} from "../../../utils/style/colors";
import {
  fontBold10,
  fontMedium10,
  fontSemibold10,
  fontSemibold11,
} from "../../../utils/style/fonts";
import { layout } from "../../../utils/style/layout";
import { Message, ReplyTo } from "../../../utils/types/message";
import { weshConfig } from "../../../weshnet/client";
import { sendMessage } from "../../../weshnet/client/services";
import { stringFromBytes } from "../../../weshnet/client/utils";

interface ConversationProps {
  message: Message;
  groupPk: Uint8Array;
  isMessageChain: boolean;
  isNextMine: boolean;
  onReply: (params: ReplyTo) => void;
  parentMessage?: Message;
}

export const Conversation = ({
  message,
  groupPk,
  isMessageChain,
  isNextMine,
  onReply,
  parentMessage,
}: ConversationProps) => {
  const [showPopup, setShowPopup] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [isForwarding, setIsForwarding] = useState(false);

  const isSender =
    message.senderId === stringFromBytes(weshConfig.config.accountPk);

  const reactions = useMemo(() => {
    if (!message?.reactions?.length) {
      return [];
    }
    return chain(message.reactions || [])
      .groupBy(message.payload.message)
      .map((value, key) => ({
        icon: value?.[0]?.payload?.message || "",
        count: value.length,
      }))
      .value();
  }, [message?.reactions]);

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

  if (message.type === "accept-contact") {
    return (
      <View style={{ alignItems: "center" }}>
        <BrandText style={[fontSemibold10, { color: neutralA3 }]}>
          Contact accepted
        </BrandText>
      </View>
    );
  }

  return (
    <FlexRow
      alignItems="flex-start"
      justifyContent={isSender ? "flex-end" : "flex-start"}
      style={{
        paddingHorizontal: layout.padding_x1,
        marginBottom:
          reactions.length && isNextMine
            ? layout.padding_x3_5
            : layout.padding_x0_25,
      }}
    >
      {!isSender && (
        <View
          style={{
            width: 30,
            marginRight: layout.padding_x1_5,
            marginTop: layout.padding_x1,
          }}
        >
          {!isMessageChain && (
            <SVG source={avatar} style={{ width: 30, height: 30 }} />
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
        {!isMessageChain && (
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
              {isSender ? "me" : receiverName}
            </BrandText>
            <BrandText
              style={[
                fontMedium10,
                { color: neutral77, marginLeft: layout.padding_x0_5 },
              ]}
            >
              {moment(message.timestamp).local().format("HH:mm")}
            </BrandText>
          </FlexRow>
        )}
        <View
          style={{
            backgroundColor: isSender ? neutral17 : purpleDark,
            paddingVertical: 8,
            paddingHorizontal: 16,
            borderBottomLeftRadius: layout.padding_x0_75,
            borderBottomRightRadius: layout.padding_x0_75,
            borderTopRightRadius: layout.padding_x0_75,
          }}
        >
          {parentMessage?.id && (
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
                {parentMessage.payload.message}
              </BrandText>
            </FlexRow>
          )}
          <TouchableOpacity onPress={() => setShowPopup(true)}>
            {message.type === "message" ? (
              <>
                <BrandText style={[fontSemibold11, { color: secondaryColor }]}>
                  {message?.payload?.message}
                </BrandText>
                {!!message.payload?.files?.length && (
                  <FileRenderer
                    files={message?.payload?.files || []}
                    maxWidth={400}
                    waveFormMaxWidth={340}
                  />
                )}
              </>
            ) : (
              <>
                {message?.type === "group-invite" && !isSender && (
                  <BrandText
                    style={[fontSemibold11, { color: secondaryColor }]}
                  >
                    Anon has invited you to a group ${message.payload.message}
                  </BrandText>
                )}
                {/* {message?.type === "group-invitation" && isSender && (
                  <BrandText
                    style={[fontSemibold11, { color: secondaryColor }]}
                  >
                    You have invited Anon to a group ${message.message.name}
                  </BrandText>
                )} */}
              </>
            )}
          </TouchableOpacity>

          {message?.type === "group-invite" && !isSender && (
            <GroupInvitationAction message={message} />
          )}

          {!!message.payload.files?.[0]?.type === "image" && (
            <Image
              source={{ uri: message.payload.files[0].url }}
              style={{ height: 200, width: 120, borderRadius: 10 }}
            />
          )}
          {!isSender && (
            <>
              {showPopup && (
                <Dropdown
                  onDropdownClosed={() => setShowPopup(false)}
                  positionStyle={{
                    top: -40,
                    right: -100,
                  }}
                >
                  <View style={styles.popupContainerIconAndReply}>
                    <FlexRow>
                      <EmojiSelector onEmojiSelected={onEmojiSelected} />
                      <SpacerRow size={1} />
                      <TouchableOpacity onPress={() => setShowMenu(true)}>
                        <SVG
                          source={reply}
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
                <Dropdown onDropdownClosed={() => setShowMenu(false)}>
                  <View style={styles.popupContainer}>
                    <MessagePopup
                      onClose={() => setShowMenu(false)}
                      message={message.payload.message}
                      onReply={() =>
                        onReply({
                          id: message.id,
                          message: message.payload.message,
                        })
                      }
                      isForwarding={isForwarding}
                      setIsForwarding={setIsForwarding}
                    />
                  </View>
                </Dropdown>
              )}
            </>
          )}
        </View>
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

const styles = StyleSheet.create({
  popupContainer: {
    backgroundColor: "rgba(41, 41, 41, 0.8)",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 16,
    width: "auto",
  },
  popupContainerIconAndReply: {
    backgroundColor: "rgba(41, 41, 41, 0.8)",
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 6,
    width: "auto",
  },
});
