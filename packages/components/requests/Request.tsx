import React, { useEffect, useState } from "react";
import { View } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { Avatar, Badge } from "react-native-paper";

import { Separator } from "../../components/Separator";
import { useFeedbacks } from "../../context/FeedbacksProvider";
import { useTNS } from "../../context/TNSProvider";
import { useNSUserInfo } from "../../hooks/useNSUserInfo";
import {
  neutral22,
  neutral30,
  neutralA3,
  primaryColor,
  primaryTextColor,
  secondaryColor,
} from "../../utils/style/colors";
import {
  fontSemibold11,
  fontSemibold13,
  fontSemibold14,
} from "../../utils/style/fonts";
import { ContactRequest } from "../../utils/types/message";
import { GroupMetadataEvent } from "../../weshnet";
import { weshClient } from "../../weshnet/client";
import {
  acceptFriendRequest,
  activateGroup,
  sendMessage,
} from "../../weshnet/client/services";
import {
  bytesFromString,
  decode,
  decodeJSON,
  stringFromBytes,
} from "../../weshnet/client/utils";
import { BrandText } from "../BrandText";
import FlexRow from "../FlexRow";
import { TertiaryBox } from "../boxes/TertiaryBox";
import { PrimaryButton } from "../buttons/PrimaryButton";
import { SecondaryButton } from "../buttons/SecondaryButton";
import { SpacerColumn, SpacerRow } from "../spacer";
type Props = {
  name: string;
  isOnline: boolean;
  avatar: any;
  data: ContactRequest;
};

const RequestList = ({ isOnline, data }: Props) => {
  const { setToastSuccess, setToastError } = useFeedbacks();
  const [addLoading, setAddLoading] = useState(false);
  const [rejectLoading, setRejectLoading] = useState(false);

  const onlineStatusBadgeColor = isOnline ? "green" : "yellow";

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
      console.log("add friend err", err);
      setToastError({
        title: "Failed",
        message: "Failed to accept contact. Please try again later.",
      });
    }
    setAddLoading(false);
  };

  const handleCancelFriend = async () => {
    setRejectLoading(true);
    try {
      await weshClient().ContactRequestDiscard({
        contactPk: bytesFromString(data?.contactId),
      });
    } catch (err) {
      setToastError({
        title: "Failed",
        message: "Failed to reject contact. Please try again later.",
      });
    }
    setRejectLoading(false);
  };

  return (
    <View>
      <FlexRow justifyContent="space-between">
        <View>
          <FlexRow>
            <Avatar.Image size={40} source={data.avatar} />
            <Badge
              style={{
                position: "absolute",
                top: 30,
                left: 30,

                backgroundColor: onlineStatusBadgeColor,
              }}
              size={12}
            />
            <SpacerRow size={1.5} />
            <View>
              <BrandText style={[fontSemibold13, { color: secondaryColor }]}>
                {data?.name || "Anon"}
              </BrandText>
            </View>
          </FlexRow>
        </View>
        <View>
          <FlexRow>
            <PrimaryButton
              onPress={handleAddFriend}
              isLoading={addLoading}
              text="Add"
              size="SM"
            />
            <SpacerRow size={1.5} />
            <SecondaryButton
              onPress={handleCancelFriend}
              isLoading={rejectLoading}
              text="Reject"
              size="SM"
            />
          </FlexRow>
        </View>
      </FlexRow>
      <SpacerColumn size={1.3} />
      <Separator color={neutral22} />
      <SpacerColumn size={1.3} />
    </View>
  );
};

export default RequestList;
