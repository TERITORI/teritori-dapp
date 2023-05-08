import React, { useState } from "react";
import {
  View,
  TouchableOpacity,
  Modal,
  Platform,
  ScrollView,
} from "react-native";

import CreateGroup from "./CreateGroup";
import FriendshipManager from "./FriendshipManager";
import { MessageHeader } from "./MessageHeader";
import MessengerGroupChat from "./MessengerGroupChat";
import SideBarChats from "./SideBarChats";
import data from "./data";
import FlexRow from "../../components/FlexRow";
import { ScreenContainer } from "../../components/ScreenContainer";
import { Separator } from "../../components/Separator";
import MessageCard from "../../components/cards/MessageCard";
import { SpacerColumn, SpacerRow } from "../../components/spacer";
import { useAppNavigation } from "../../utils/navigation";
export const MessageScreen: ScreenFC<"Message"> = () => {
  const [showTertiaryBox, setShowTertiaryBox] = useState(false);
  const navigation = useAppNavigation();
  return (
    <ScreenContainer
      footerChildren
      headerChildren={<MessageHeader />}
      responsive
      fullWidth
    >
      <SpacerColumn size={3} />

      <FlexRow>
        <ScrollView horizontal>
          {data.map((item, index) => (
            <View key={item.id}>
              <TouchableOpacity
                onPress={() => {
                  if (item.id === 2) {
                    setShowTertiaryBox(true);
                  } else if (item.id === 3) {
                    // navigation.navigate("AddFriend");
                    navigation.navigate("FriendshipManager");
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
            </View>
          ))}
        </ScrollView>
      </FlexRow>
      <SpacerColumn size={3} />
      <Modal visible={showTertiaryBox} animationType="none" transparent>
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "rgba(0, 0, 0, 0.0)",
          }}
        >
          <CreateGroup setShowTertiaryBox={setShowTertiaryBox} />
        </View>
      </Modal>

      <Separator horizontal={false} />
      {["android", "ios"].includes(Platform.OS) ? (
        <SideBarChats />
      ) : (
        <View style={{ flexDirection: "row" }}>
          <SideBarChats />
          <SpacerRow size={2} />
          <Separator horizontal />
          {/* <SpacerRow size={2} /> */}

          <View style={{ flex: 1 }}>
            {/* <FriendshipManager /> */}
            <MessengerGroupChat />
          </View>
        </View>
      )}
    </ScreenContainer>
  );
};
