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

const ScreenShare: React.FC<Props> = ({ avatar, name, isOnline }) => {
  const onlineStatusBadgeColor = isOnline ? "green" : "yellow";
  return (
    <View>
      <FlexRow justifyContent="space-between">
        <View>
          <FlexRow>
            <Avatar.Image size={40} source={avatar} />

            <SpacerRow size={1.5} />

            <BrandText style={[fontSemibold13, { color: secondaryColor }]}>
              {name}
            </BrandText>
          </FlexRow>
        </View>

        <TouchableOpacity>
          <TertiaryBox
            height={40}
            mainContainerStyle={{
              backgroundColor: neutral30,
              padding: 10,
              alignItems: "center",
            }}
          >
            <BrandText style={[fontSemibold14, { color: primaryColor }]}>
              Invite
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

export default ScreenShare;
