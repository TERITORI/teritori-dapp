import React, { useState } from "react";
import {
  View,
  TouchableOpacity,
  Modal,
  Platform,
  ScrollView,
} from "react-native";

import { CreateGroup } from "./CreateGroup";
import { FriendshipManager } from "./FriendshipManager";
import { MessageHeader } from "./MessageHeader";
import { MessageGroupChat } from "./MessengerGroupChat/MessageGroupChat";
import { SideBarChats } from "./SideBarChats";
import data from "./data";
import FlexRow from "../../components/FlexRow";
import { ScreenContainer } from "../../components/ScreenContainer";
import { Separator } from "../../components/Separator";
import MessageCard from "../../components/cards/MessageCard";
import { SpacerColumn, SpacerRow } from "../../components/spacer";
import { useAppNavigation, ScreenFC } from "../../utils/navigation";
import { layout } from "../../utils/style/layout";

export const MessageScreen: ScreenFC<"Message"> = () => {
  const [showTertiaryBox, setShowTertiaryBox] = useState(false);
  const [showAddFriend, setShowAddFriend] = useState(false);
  console.log("ShowAddFriend", showAddFriend);
  const navigation = useAppNavigation();
  return (
    <ScreenContainer
      footerChildren
      headerChildren={<MessageHeader />}
      responsive
      fullWidth
    >
      <View style={{ padding: layout.padding_x1_5 }}>
        <SpacerColumn size={3} />

        <FlexRow>
          <ScrollView horizontal>
            {data.map((item, index) => (
              <>
                <TouchableOpacity
                  key={index}
                  onPress={() => {
                    if (item.id === 1) {
                      ["android", "ios"].includes(Platform.OS)
                        ? navigation.navigate("ChatSection")
                        : setShowAddFriend(false);
                    } else if (item.id === 2) {
                      setShowTertiaryBox(true);
                    } else if (item.id === 3) {
                      ["android", "ios"].includes(Platform.OS)
                        ? navigation.navigate("FriendshipManager")
                        : setShowAddFriend(true);
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
          </ScrollView>
        </FlexRow>
        <SpacerColumn size={3} />

        <Modal visible={showTertiaryBox} animationType="none" transparent>
          <View
            style={{
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: "rgba(0, 0, 0, 0.0)",
            }}
          >
            <CreateGroup setShowTertiaryBox={setShowTertiaryBox} />
          </View>
        </Modal>

        <Separator
          horizontal={false}
          style={{ width: 9000, marginLeft: -500 }}
        />

        {["android", "ios"].includes(Platform.OS) ? (
          <SideBarChats />
        ) : (
          <View style={{ flexDirection: "row" }}>
            <SideBarChats />
            <SpacerRow size={2} />
            <Separator horizontal />

            <View style={{ flex: 1 }}>
              {showAddFriend ? <FriendshipManager /> : <MessageGroupChat />}
            </View>
          </View>
        )}
      </View>
    </ScreenContainer>
  );
};
