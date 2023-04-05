import React from "react";
import { View, StyleSheet, TouchableOpacity, Text } from "react-native";

import { ScreenContainer } from "../../components/ScreenContainer";
import { Separator } from "../../components/Separator";
import { TertiaryBox } from "../../components/boxes/TertiaryBox";
import MessageCard from "../../components/cards/MessageCard";
import { SpacerRow } from "../../components/spacer";
import { MessageHeader } from "./MessageHeader";
import SideBarChats from "./SideBarChats";
import TopHeaderButtonChat from "./TopHeaderButtonChat";
import data from "./data";
export const MessageScreen: ScreenFC<"Message"> = ({ navigation }) => {
  return (
    <ScreenContainer
      footerChildren
      headerChildren={<MessageHeader />}
      responsive
      smallMargin={false}
    >
      <View
        style={{
          flexDirection: "row",
          marginTop: 30,
        }}
      >
        {data.map((item) => (
          <TouchableOpacity key={item.title} onPress={item.onPress}>
            <MessageCard
              text={item.title}
              icon={item.icon}
              subtext={item.subtitle}
              containerStyle={{
                height: 56,
              }}
            />
          </TouchableOpacity>
        ))}
      </View>
      <TertiaryBox
        mainContainerStyle={{
          flexDirection: "row",
          paddingHorizontal: 12,
        }}
        height={400}
        width={200}
      />
      <Separator style={{ marginTop: 20, left: 0 }} horizontal={false} />
      <View style={{ flexDirection: "row" }}>
        <SideBarChats />
        <SpacerRow size={2} />
        <Separator horizontal />
        <SpacerRow size={2} />

        <View style={{ flex: 1 }}>
          <TopHeaderButtonChat />
        </View>
      </View>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  friendText: {
    color: "#FFFFFF",
    marginLeft: 6,
    fontWeight: "600",
    fontSize: 13,
    lineHeight: 18,
  },
  number: {
    color: "#FFFFFF",
    marginRight: 15,
    fontWeight: "600",
    fontSize: 13,
    lineHeight: 18,
  },
  friendBox: {
    flexDirection: "row",
    backgroundColor: "#222222",
    width: 230,
    padding: 8,
    height: 30,
    borderRadius: 10,
    justifyContent: "space-between",
    marginTop: 20,
  },
  iconandText: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 10,
    marginLeft: 10,
  },
});
