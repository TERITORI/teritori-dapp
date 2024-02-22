import React, { useState } from "react";
import { View } from "react-native";

import { MessageAvatar } from "./MessageAvatar";
import { BrandText } from "../../../components/BrandText";
import FlexRow from "../../../components/FlexRow";
import { PrimaryButton } from "../../../components/buttons/PrimaryButton";
import { SecondaryButton } from "../../../components/buttons/SecondaryButton";
import { Separator } from "../../../components/separators/Separator";
import { SpacerColumn, SpacerRow } from "../../../components/spacer";
import { useFeedbacks } from "../../../context/FeedbacksProvider";
import { neutral22, secondaryColor } from "../../../utils/style/colors";
import { fontSemibold13 } from "../../../utils/style/fonts";
import { ContactRequest } from "../../../utils/types/message";
import { weshClient } from "../../../weshnet/client";
import {
  acceptFriendRequest,
  activateGroup,
  sendMessage,
} from "../../../weshnet/services";
import { bytesFromString } from "../../../weshnet/utils";

type Props = {
  name: string;

  avatar: any;
  data: ContactRequest;
};

export const Request = ({ data }: Props) => {
  const { setToastError } = useFeedbacks();
  const [addLoading, setAddLoading] = useState(false);

  const handleAddFriend = async () => {
    setAddLoading(true);
    try {
      const contactPk = bytesFromString(data?.contactId);
      await acceptFriendRequest(contactPk);
      const groupInfo = await activateGroup({ contactPk });
      await sendMessage({
        groupPk: groupInfo?.group?.publicKey,
        message: {
          type: "accept-contact",
        },
      });
    } catch (err) {
      console.error("add friend err", err);
      setToastError({
        title: "Failed",
        message: "Failed to accept contact. Please try again later.",
      });
    }
    setAddLoading(false);
  };

  const handleCancelFriend = async () => {
    try {
      await weshClient.client.ContactRequestDiscard({
        contactPk: bytesFromString(data?.contactId),
      });
    } catch {
      setToastError({
        title: "Failed",
        message: "Failed to reject contact. Please try again later.",
      });
    }
  };

  return (
    <View>
      <FlexRow justifyContent="space-between" style={{ flex: 1 }}>
        <FlexRow style={{ flex: 1 }}>
          <MessageAvatar item={data} />
          <SpacerRow size={1.5} />
          <View>
            <BrandText style={[fontSemibold13, { color: secondaryColor }]}>
              {data?.name || "Anon"}
            </BrandText>
          </View>
        </FlexRow>

        <FlexRow justifyContent="flex-end" style={{ flex: 1 }}>
          <PrimaryButton
            onPress={handleAddFriend}
            isLoading={addLoading}
            text="Add"
            size="SM"
          />
          <SpacerRow size={1.5} />

          <SecondaryButton
            width={100}
            onPress={handleCancelFriend}
            loader
            text="Reject"
            size="SM"
          />
        </FlexRow>
      </FlexRow>
      <SpacerColumn size={1.3} />
      <Separator color={neutral22} />
      <SpacerColumn size={1.3} />
    </View>
  );
};
