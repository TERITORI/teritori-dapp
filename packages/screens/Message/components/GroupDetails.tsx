import React from "react";
import { View } from "react-native";

import { BrandText } from "../../../components/BrandText";
import ModalBase from "../../../components/modals/ModalBase";
import { SpacerColumn } from "../../../components/spacer";
import { Conversation } from "../../../utils/types/message";

interface GroupDetailsProps {
  conversation: Conversation;
  onClose: () => void;
}

export const GroupDetails = ({ conversation, onClose }: GroupDetailsProps) => {
  return (
    <ModalBase
      label="Group Details"
      onClose={onClose}
      visible
      hideMainSeparator
      width={450}
    >
      <SpacerColumn size={2} />
      {conversation.members.map((member) => (
        <View>
          <BrandText>{member.name}</BrandText>
        </View>
      ))}
    </ModalBase>
  );
};
