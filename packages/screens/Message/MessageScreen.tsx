import React from "react";
import { View, StyleSheet, Text } from "react-native";

import { ScreenContainer } from "../../components/ScreenContainer";
import { Separator } from "../../components/Separator";
import MessageCard from "../../components/cards/MessageCard";
import { SearchInput } from "../../components/sorts/SearchInput";
import { MessageHeader } from "./MessageHeader";
import SideBarChats from "./SideBarChats";
import TopHeaderButtonChat from "./TopHeaderButtonChat";
import data from "./data";
export const MessageScreen: ScreenFC<"Message"> = () => {
  return (
    <ScreenContainer
      footerChildren
      headerChildren={<MessageHeader />}
      style={{ flex: 1 }}
    >
      <View
        style={{
          flexDirection: "row",
          marginTop: 30,
        }}
      >
        {data.map((item) => (
          <MessageCard
            text={item.title}
            icon={item.icon}
            subtext={item.subtitle}
            containerStyle={{
              height: 56,
            }}
          />
        ))}
      </View>

      <Separator style={{ marginTop: 20, left: 0 }} horizontal={false} />
      <View style={{ flexDirection: "row" }}>
        <SideBarChats />

        <Separator style={{ marginLeft: 20, height: 500 }} horizontal />
        <View style={{ flex: 1 }}>
          <TopHeaderButtonChat />
          {/* <SearchInput style={{ top: -100 }} /> */}
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
