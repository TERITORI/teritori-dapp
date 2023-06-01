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
  primaryTextColor,
  secondaryColor,
} from "../../utils/style/colors";
import {
  fontSemibold11,
  fontSemibold13,
  fontSemibold14,
} from "../../utils/style/fonts";
import { weshClient } from "../../weshnet/client";
import { BrandText } from "../BrandText";
import FlexRow from "../FlexRow";
import { TertiaryBox } from "../boxes/TertiaryBox";
import { SpacerColumn, SpacerRow } from "../spacer";
type Props = {
  name: string;
  isOnline: boolean;
  avatar: any;
};

const RequestList: React.FC<Props> = ({ avatar, name, isOnline }) => {
  const onlineStatusBadgeColor = isOnline ? "green" : "yellow";

  const handleAddFriend = async () => {
    // await weshClient.ContactRequestAccept({
    //   contactPk: accountPk,
    // });
  };

  const handleCancelFriend = async () => {
    // await weshClient.ContactRequestDiscard({
    //   contactPk: accountPk,
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
        <View>
          <FlexRow>
            <View>
              <TouchableOpacity onPress={handleAddFriend}>
                <TertiaryBox
                  height={40}
                  mainContainerStyle={{
                    backgroundColor: primaryColor,
                    padding: 10,
                    alignItems: "center",
                  }}
                >
                  <BrandText
                    style={[
                      fontSemibold14,
                      { color: primaryTextColor, paddingHorizontal: 10 },
                    ]}
                  >
                    Add
                  </BrandText>
                </TertiaryBox>
              </TouchableOpacity>
            </View>
            <SpacerRow size={1.5} />
            <View>
              <TouchableOpacity onPress={handleCancelFriend}>
                <TertiaryBox
                  height={40}
                  mainContainerStyle={{
                    backgroundColor: neutral30,
                    padding: 10,
                    alignItems: "center",
                  }}
                >
                  <BrandText
                    style={[
                      fontSemibold14,
                      { color: primaryColor, paddingHorizontal: 4 },
                    ]}
                  >
                    Cancel
                  </BrandText>
                </TertiaryBox>
              </TouchableOpacity>
            </View>
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
