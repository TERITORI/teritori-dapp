import React, { useState } from "react";
import { View, StyleSheet, TouchableOpacity, Image } from "react-native";

import { FileRenderer } from "./FileRenderer";
import { GroupInvitationAction } from "./GroupInvitationAction";
import { MessagePopup } from "./MessagePopup";
import avatar from "../../../../assets/icons/avatar.svg";
import reply from "../../../../assets/icons/reply.svg";
import { BrandText } from "../../../components/BrandText";
import FlexRow from "../../../components/FlexRow";
import { SVG } from "../../../components/SVG";
import { PrimaryButton } from "../../../components/buttons/PrimaryButton";
import { SecondaryButton } from "../../../components/buttons/SecondaryButton";
import { TertiaryButton } from "../../../components/buttons/TertiaryButton";
import { EmojiSelector } from "../../../components/socialFeed/EmojiSelector";
import { SocialMessageContent } from "../../../components/socialFeed/SocialThread/SocialMessageContent";
import { SpacerColumn, SpacerRow } from "../../../components/spacer";
import { useFeedbacks } from "../../../context/FeedbacksProvider";
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
  fontSemibold11,
} from "../../../utils/style/fonts";
import { Message } from "../../../utils/types/message";
import { GroupInfo_Reply } from "../../../weshnet";
import { weshClient, weshConfig } from "../../../weshnet/client";
import { sendMessage } from "../../../weshnet/client/services";
import { stringFromBytes } from "../../../weshnet/client/utils";

interface ConversationProps {
  message: Message;
}

export const Conversation = ({ message }: ConversationProps) => {
  const [showPopup, setShowPopup] = useState(false);
  const [isForwarding, setIsForwarding] = useState(false);
  const [showFarward, setShowFarward] = useState(false);
  const isSender =
    message.senderId === stringFromBytes(weshConfig.config.accountPk);

  const onEmojiSelected = (emoji: string | null) => {
    if (emoji) {
      // let copiedValue = `${formValues.message}`;
      // copiedValue = replaceBetweenString(
      //   copiedValue,
      //   selection.start,
      //   selection.end,
      //   emoji
      // );
      // setValue("message", copiedValue);
    }
  };

  const receiverName = "Anon";
  const time = "";

  console.log("message", message);

  return (
    <>
      <View style={isSender ? styles.senderWrapper : styles.receiverWrapper}>
        {!isSender && <SVG source={avatar} style={{ width: 30, height: 30 }} />}
        <View
          style={[isSender ? styles.senderContainer : styles.receiverContainer]}
        >
          <TouchableOpacity onPress={() => setShowPopup(!showPopup)}>
            {message.type === "message" ? (
              <>
                <BrandText style={[fontSemibold11, { color: secondaryColor }]}>
                  {message.payload.message}
                </BrandText>
                {!!message.payload.files.length && (
                  <FileRenderer files={message.payload.files || []} />
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
          {!isSender && showPopup && !showFarward && (
            <View style={styles.popupContainerIconAndReply}>
              <FlexRow>
                <EmojiSelector
                  onEmojiSelected={onEmojiSelected}
                  optionsContainer={{ marginLeft: 30 }}
                />
                <SpacerRow size={1} />
                <TouchableOpacity onPress={() => setShowFarward(true)}>
                  <SVG
                    source={reply}
                    height={16}
                    width={16}
                    color={neutralA3}
                  />
                </TouchableOpacity>
              </FlexRow>
            </View>
          )}
          {!isSender && showFarward && (
            <View style={styles.popupContainer}>
              <MessagePopup
                isForwarding={isForwarding}
                setIsForwarding={setIsForwarding}
              />
            </View>
          )}
          <View
            style={{
              flexDirection: "row",
              position: "absolute",
              top: -15,
              left: 10,
            }}
          >
            {!isSender && !!receiverName && (
              <BrandText style={[fontBold10, { color: secondaryColor }]}>
                {receiverName}
              </BrandText>
            )}
            {!!isSender && (
              <BrandText style={[fontBold10, { color: secondaryColor }]}>
                me
              </BrandText>
            )}
            <SpacerRow size={0.5} />
            <BrandText style={[fontMedium10, { color: neutral77 }]}>
              {time}
            </BrandText>
          </View>
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  senderWrapper: {
    flexDirection: "row",
    // flex: 1,
    marginBottom: 20,
    marginTop: 25,
  },
  receiverWrapper: {
    flexDirection: "row",
    marginBottom: 8,
    marginLeft: 10,
  },
  senderContainer: {
    backgroundColor: neutral17,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 16,
    marginHorizontal: 10,
    marginLeft: "auto",
    width: "auto",
    maxWidth: "40%",
    zIndex: 1,
    marginTop: 15,
  },
  receiverContainer: {
    backgroundColor: purpleDark,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 16,
    marginHorizontal: 10,
    width: "auto",
    maxWidth: "40%",
    zIndex: 1,
    marginRight: "auto",
    marginTop: 15,
  },
  popupContainer: {
    backgroundColor: "rgba(41, 41, 41, 0.8)",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 16,

    width: "auto",

    zIndex: 11111,

    position: "absolute",
    right: -50,
    top: -170,
  },
  popupContainerIconAndReply: {
    backgroundColor: "rgba(41, 41, 41, 0.8)",
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 6,

    width: "auto",

    zIndex: 11111,

    position: "absolute",
    right: -77,
    bottom: 0,
  },
});
