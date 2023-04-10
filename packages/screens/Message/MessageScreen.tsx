import React, { useState } from "react";
import { View, StyleSheet, TouchableOpacity, Modal } from "react-native";

import { ScreenContainer } from "../../components/ScreenContainer";
import { Separator } from "../../components/Separator";
import MessageCard from "../../components/cards/MessageCard";
import { SpacerRow } from "../../components/spacer";
import CreateGroup from "./CreateGroup";
import { MessageHeader } from "./MessageHeader";
import MessengerGroupChat from "./MessengerGroupChat";
import SideBarChats from "./SideBarChats";
import TopHeaderButtonChat from "./TopHeaderButtonChat";
import data from "./data";
export const MessageScreen: ScreenFC<"Message"> = ({ navigation }) => {
  const [showTertiaryBox, setShowTertiaryBox] = useState(false);
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
          <TouchableOpacity
            key={item.title}
            onPress={() => {
              if (item.id === 2) {
                setShowTertiaryBox(true);
              } else {
                setShowTertiaryBox(false);
              }
            }}
          >
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
      {/* {showTertiaryBox && (
        <CreateGroup setShowTertiaryBox={setShowTertiaryBox} />
      )} */}
      <Modal visible={showTertiaryBox} animationType="none" transparent>
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
          }}
        >
          <CreateGroup setShowTertiaryBox={setShowTertiaryBox} />
        </View>
      </Modal>
      <Separator style={{ marginTop: 20, left: 0 }} horizontal={false} />
      <View style={{ flexDirection: "row" }}>
        <SideBarChats />
        <SpacerRow size={2} />
        <Separator horizontal />
        <SpacerRow size={2} />

        <View style={{ flex: 1 }}>
          {/* <TopHeaderButtonChat /> */}
          <MessengerGroupChat />
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
