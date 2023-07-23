import React from "react";
import { View } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { Avatar, Badge } from "react-native-paper";

import { Separator } from "../../components/Separator";
import {
  neutral22,
  neutral30,
  neutralA3,
  primaryColor,
  secondaryColor,
} from "../../utils/style/colors";
import {
  fontSemibold11,
  fontSemibold13,
  fontSemibold14,
} from "../../utils/style/fonts";
import { BrandText } from "../BrandText";
import FlexRow from "../FlexRow";
import { TertiaryBox } from "../boxes/TertiaryBox";
import { SpacerColumn, SpacerRow } from "../spacer";

type Props = {
  name: string;
  isOnline: boolean;
  avatar: any;
};
const AddFriendList: React.FC<Props> = ({ avatar, name, isOnline }) => {
  const onlineStatusBadgeColor = isOnline ? "green" : "yellow";

  const handleSendRequest = async () => {
    // await weshClient.client.ContactRequestSend({
    //   contact: {
    //     pk: accountPk,
    //     publicRendezvousSeed,
    //   },
    // });
  };
  return (
    <View>
      <FlexRow justifyContent="space-between">
        <View>
          <FlexRow>
            <Avatar.Image size={40} source={avatar} />
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
                {name}
              </BrandText>
              <SpacerColumn size={0.4} />
              <BrandText style={[fontSemibold11, { color: neutralA3 }]}>
                {isOnline ? "Online" : "Offline"}
              </BrandText>
            </View>
          </FlexRow>
        </View>

        <TouchableOpacity onPress={handleSendRequest}>
          <TertiaryBox
            height={40}
            mainContainerStyle={{
              backgroundColor: neutral30,
              padding: 10,
              alignItems: "center",
            }}
          >
            <BrandText style={[fontSemibold14, { color: primaryColor }]}>
              Send Request
            </BrandText>
          </TertiaryBox>
        </TouchableOpacity>
      </FlexRow>
      <SpacerColumn size={1.3} />
      <Separator color={neutral22} />
      <SpacerColumn size={1.3} />
    </View>
  );
};

export default AddFriendList;
