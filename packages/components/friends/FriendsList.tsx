import React from "react";
import { View, Image, StyleSheet } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { Avatar, Badge } from "react-native-paper";

import chaticon from "../../../assets/icons/chaticon.svg";
import dots from "../../../assets/icons/dots.svg";
import { Separator } from "../../components/Separator";
import { neutral22, neutralA3, secondaryColor } from "../../utils/style/colors";
import { fontSemibold13, fontSemibold11 } from "../../utils/style/fonts";
import { BrandText } from "../BrandText";
import FlexRow from "../FlexRow";
import { SVG } from "../SVG";
import { SpacerColumn, SpacerRow } from "../spacer";

type Props = {
  name: string;
  isOnline: boolean;
  avatar: any;
};

const FriendList: React.FC<Props> = ({ avatar, name, isOnline }) => {
  const onlineStatusBadgeColor = isOnline ? "green" : "yellow";
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
            <TouchableOpacity>
              <SVG source={chaticon} />
            </TouchableOpacity>
            <SpacerRow size={1.5} />
            <TouchableOpacity>
              <SVG source={dots} />
            </TouchableOpacity>
          </FlexRow>
        </View>
      </FlexRow>
      <SpacerColumn size={1.3} />
      <Separator color={neutral22} />
      <SpacerColumn size={1.3} />
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    marginTop: 10,
    justifyContent: "space-between",
  },
  chatboxicon: { flexDirection: "row" },
  icon: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  online: {
    fontSize: 11,
    fontWeight: "500",
    color: "#A3A3A3",
    lineHeight: 18,
  },
  badge: {
    backgroundColor: "green",
    width: 10,
    height: 10,
    borderRadius: 5,
    position: "absolute",
    bottom: -5,
    right: -5,
  },
  name: {
    fontSize: 13,
    fontWeight: "600",
    color: "#FFFFFF",
    lineHeight: 18,
  },
  chatIcon: {
    width: 24,
    height: 24,
    marginRight: 8,
  },
  dotsIcon: {
    width: 24,
    height: 24,
  },
});

export default FriendList;
