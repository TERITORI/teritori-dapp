import React, { useEffect, useState } from "react";
import { View, StyleSheet, TouchableOpacity, Image } from "react-native";
import { useSelector } from "react-redux";

import { FileRenderer } from "./FileRenderer";
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
import { selectConversationList } from "../../../store/slices/message";
import {
  neutral77,
  secondaryColor,
  purpleDark,
  neutral17,
  neutralA3,
  successColor,
} from "../../../utils/style/colors";
import {
  fontBold10,
  fontMedium10,
  fontSemibold11,
} from "../../../utils/style/fonts";
import { layout } from "../../../utils/style/layout";
import { Message } from "../../../utils/types/message";
import { GroupInfo_Reply } from "../../../weshnet";
import { weshClient, weshConfig } from "../../../weshnet/client";
import { sendMessage } from "../../../weshnet/client/services";
import { stringFromBytes } from "../../../weshnet/client/utils";

interface GroupInvitationActionProps {
  message: Message;
}

export const GroupInvitationAction = ({
  message,
}: GroupInvitationActionProps) => {
  const { setToastError, setToastSuccess } = useFeedbacks();
  const conversations = useSelector(selectConversationList);

  const [isAccepted, setIsAccepted] = useState(false);

  console.log("invite msg", message);
  useEffect(() => {
    if (message.payload?.metadata?.group) {
      const group = message.payload?.metadata?.group;
      const groupInfo = GroupInfo_Reply.fromJSON({ group });

      const hasAlreadyAccepted = conversations.find(
        (item) => item.id === stringFromBytes(groupInfo.group?.publicKey)
      );
      if (hasAlreadyAccepted?.id) {
        setIsAccepted(true);
      }
    }
  }, [conversations]);

  const handleAcceptGroup = async () => {
    try {
      const group = message.payload?.metadata?.group;
      const groupInfo = GroupInfo_Reply.fromJSON({ group });

      await weshClient.client.MultiMemberGroupJoin({
        group: groupInfo.group,
      });

      await weshClient.client.ActivateGroup({
        groupPk: groupInfo.group?.publicKey,
      });

      await sendMessage({
        groupPk: groupInfo.group?.publicKey,
        message: {
          type: "group-join",
          payload: {
            message: "",
            files: [],
            metadata: {
              contact: {
                id: stringFromBytes(weshConfig.config.accountPk),
                rdvSeed: stringFromBytes(weshConfig.metadata.rdvSeed),
                tokenId: weshConfig.metadata.tokenId,
              },
              groupName: message?.payload?.metadata?.groupName,
            },
          },
        },
      });
    } catch (err) {
      setToastError({
        title: "Failed to accept group",
        message: err?.message,
      });
    }
  };

  const handleRejectGroup = async () => {
    await weshClient.client.MultiMemberGroupLeave({});
  };

  if (isAccepted) {
    return (
      <BrandText
        style={[
          fontMedium10,
          {
            marginTop: layout.padding_x0_5,
            color: successColor,
          },
        ]}
      >
        You have already accepted the group invitation
      </BrandText>
    );
  }
  return (
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
        {/* <TertiaryButton
          onPress={handleRejectGroup}
          text="Cancel"
          size="SM"
          squaresBackgroundColor={purpleDark}
        /> */}
      </FlexRow>
    </>
  );
};
