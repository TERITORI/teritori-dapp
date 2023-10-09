import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

import { BrandText } from "../../../components/BrandText";
import FlexRow from "../../../components/FlexRow";
import { PrimaryButton } from "../../../components/buttons/PrimaryButton";
import { SpacerColumn, SpacerRow } from "../../../components/spacer";
import { useFeedbacks } from "../../../context/FeedbacksProvider";
import {
  selectContactInfo,
  selectConversationList,
} from "../../../store/slices/message";
import { purpleDark, successColor } from "../../../utils/style/colors";
import { fontMedium10 } from "../../../utils/style/fonts";
import { layout } from "../../../utils/style/layout";
import { CONVERSATION_TYPES, Message } from "../../../utils/types/message";
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
  const { setToastError } = useFeedbacks();

  const contactInfo = useSelector(selectContactInfo);
  const conversations = useSelector(
    selectConversationList(CONVERSATION_TYPES.ALL)
  );

  const [isAccepted, setIsAccepted] = useState(false);

  useEffect(() => {
    if (!isAccepted && message.payload?.metadata?.group) {
      const group = message.payload?.metadata?.group;
      const groupInfo = GroupInfo_Reply.fromJSON({ group });

      const hasAlreadyAccepted = conversations.find(
        (item) => item.id === stringFromBytes(groupInfo.group?.publicKey)
      );
      if (hasAlreadyAccepted?.id) {
        setIsAccepted(true);
      }
    }
  }, [conversations, isAccepted, message.payload?.metadata?.group]);

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
                id: stringFromBytes(weshConfig.config?.accountPk),
                rdvSeed: stringFromBytes(weshConfig.metadata.rdvSeed),
                tokenId: weshConfig.metadata.tokenId,
                name: contactInfo.name,
                avatar: contactInfo.avatar,
                peerId: weshConfig.config?.peerId,
              },
              groupName: message?.payload?.metadata?.groupName,
            },
          },
        },
      });
    } catch (err: any) {
      setToastError({
        title: "Failed to accept group",
        message: err?.message,
      });
    }
  };

  if (isAccepted) {
    return (
      <BrandText
        style={[
          fontMedium10,
          {
            marginTop: layout.spacing_x0_5,
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
      </FlexRow>
    </>
  );
};
