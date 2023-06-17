import React, { useState } from "react";
import { View, StyleSheet, TouchableOpacity, Image } from "react-native";

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
import { GroupInfo_Reply } from "../../../weshnet";
import { weshClient } from "../../../weshnet/client";

interface IChatMessageProps {
  message: string;
  isSender: boolean;
  time: string;
  receiverName?: string;
  source?: any;
  height: number;
  width: number;
  imageStyle?: any;
  data: any;
}

export const Conversation = ({
  message,
  isSender,
  time,
  receiverName,
  source,
  height,
  width,
  imageStyle,
  data,
}: IChatMessageProps) => {
  const { setToastError, setToastSuccess } = useFeedbacks();
  const senderName = "me";

  const [showPopup, setShowPopup] = useState(false);
  const [isForwarding, setIsForwarding] = useState(false);
  const [showFarward, setShowFarward] = useState(false);

  const handleAcceptGroup = async () => {
    try {
      const group = data.group;
      console.log("group info", data);
      const groupInfo = GroupInfo_Reply.fromJSON(group);

      console.log("group info accpet", groupInfo);
      await weshClient().MultiMemberGroupJoin({
        group: groupInfo.group,
      });

      await weshClient().ActivateGroup({
        groupPk: groupInfo.group?.publicKey,
      });
    } catch (err) {
      setToastError({
        title: "Failed to accept group",
        message: err?.message,
      });
    }
  };

  const handleRejectGroup = async () => {};

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

  return (
    <>
      <View style={isSender ? styles.senderWrapper : styles.receiverWrapper}>
        {!isSender && <SVG source={avatar} style={{ width: 30, height: 30 }} />}
        <View
          style={[isSender ? styles.senderContainer : styles.receiverContainer]}
        >
          <TouchableOpacity onPress={() => setShowPopup(!showPopup)}>
            {!data?.type ? (
              <BrandText style={[fontSemibold11, { color: secondaryColor }]}>
                {data.message}
              </BrandText>
            ) : (
              <>
                {data?.type === "group-invitation" && !isSender && (
                  <BrandText
                    style={[fontSemibold11, { color: secondaryColor }]}
                  >
                    Anon has invited you to a group ${data.message.name}
                  </BrandText>
                )}
                {data?.type === "group-invitation" && isSender && (
                  <BrandText
                    style={[fontSemibold11, { color: secondaryColor }]}
                  >
                    You have invited Anon to a group ${data.message.name}
                  </BrandText>
                )}
              </>
            )}
          </TouchableOpacity>
          {data?.type === "group-invitation" && !isSender && (
            <>
              <SpacerColumn size={1} />
              <FlexRow>
                <PrimaryButton
                  text="Accept"
                  size="SM"
                  squaresBackgroundColor={purpleDark}
                  onPress={handleAcceptGroup}
                />
                <SpacerRow size={1} />
                <TertiaryButton
                  onPress={handleRejectGroup}
                  text="Cancel"
                  size="SM"
                  squaresBackgroundColor={purpleDark}
                />
              </FlexRow>
            </>
          )}

          {!!source && (
            <Image source={source} style={{ height, width, ...imageStyle }} />
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
                {senderName}
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
