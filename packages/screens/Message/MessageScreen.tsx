import Seperator from "@draft-js-plugins/static-toolbar/lib/components/Separator";
import React, { useState } from "react";
import { View, TouchableOpacity, Modal } from "react-native";

import FlexRow from "../../components/FlexRow";
import { ScreenContainer } from "../../components/ScreenContainer";
import { Separator } from "../../components/Separator";
import MessageCard from "../../components/cards/MessageCard";
import { SpacerColumn, SpacerRow } from "../../components/spacer";
import CreateGroup from "./CreateGroup";
import { MessageHeader } from "./MessageHeader";
import MessengerGroupChat from "./MessengerGroupChat";
import SideBarChats from "./SideBarChats";
import TopHeaderButtonChat from "./TopHeaderButtonChat";
import data from "./data";
export const MessageScreen: ScreenFC<"Message"> = () => {
  const [showTertiaryBox, setShowTertiaryBox] = useState(false);
  return (
    <ScreenContainer
      footerChildren
      headerChildren={<MessageHeader />}
      responsive
      fullWidth
    >
      <SpacerColumn size={3} />

      <FlexRow>
        {data.map((item) => (
          <>
            <TouchableOpacity
              key={item.id}
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
              />
            </TouchableOpacity>
            <SpacerRow size={2} />
          </>
        ))}
      </FlexRow>
      <SpacerColumn size={3} />
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

      <Separator horizontal={false} />
      <View style={{ flexDirection: "row" }}>
        <SideBarChats />
        <SpacerRow size={2} />
        <Separator horizontal />
        {/* <SpacerRow size={2} /> */}

        <View style={{ flex: 1 }}>
          {/* <TopHeaderButtonChat /> */}
          <MessengerGroupChat />
        </View>
      </View>
    </ScreenContainer>
  );
};
