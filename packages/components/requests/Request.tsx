import React from "react";
import { View, Text, StyleSheet } from "react-native";
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
  return (
    <View>
      <FlexRow justifyContent="space-between">
        <View style={{ width: "60%" }}>
          <FlexRow>
            <Avatar.Image size={35} source={avatar} />
            <Badge
              style={{
                position: "absolute",
                top: 20,
                left: 25,

                backgroundColor: onlineStatusBadgeColor,
              }}
              size={12}
            />
            <SpacerRow size={2} />
            <View>
              <BrandText style={[fontSemibold13, { color: secondaryColor }]}>
                {name}
              </BrandText>
              <BrandText style={[fontSemibold11, { color: neutralA3 }]}>
                {isOnline ? "Online" : "Offline"}
              </BrandText>
            </View>
          </FlexRow>
        </View>

        <FlexRow style={{ width: "40%" }}>
          <View>
            <TouchableOpacity>
              <TertiaryBox
                height={40}
                mainContainerStyle={{
                  backgroundColor: primaryColor,
                  padding: 10,
                  alignItems: "center",
                }}
              >
                <Text
                  style={[
                    fontSemibold14,
                    { color: primaryTextColor, paddingHorizontal: 10 },
                  ]}
                >
                  Add
                </Text>
              </TertiaryBox>
            </TouchableOpacity>
          </View>
          <SpacerRow size={1.5} />
          <View>
            <TouchableOpacity>
              <TertiaryBox
                height={40}
                mainContainerStyle={{
                  backgroundColor: neutral30,
                  padding: 10,
                  alignItems: "center",
                }}
              >
                <Text
                  style={[
                    fontSemibold14,
                    { color: primaryColor, paddingHorizontal: 4 },
                  ]}
                >
                  Cancel
                </Text>
              </TertiaryBox>
            </TouchableOpacity>
          </View>
        </FlexRow>
      </FlexRow>
      <SpacerColumn size={1} />
      <Separator color={neutral22} />
      <SpacerColumn size={1} />
    </View>
  );
};

export default RequestList;
