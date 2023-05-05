import React, { useState } from "react";
import { View } from "react-native";

import AddFriend from "./AddFriend";
import Friends from "./Friends";
import Requests from "./Requests";
import plus from "../../../assets/icons/Addplus.svg";
import { ScreenContainer } from "../../components/ScreenContainer";
import friendData from "../../components/friends/data";
import data from "../../components/requests/data";
import { SpacerColumn } from "../../components/spacer";
import { Tabs } from "../../components/tabs/Tabs";
const FriendshipManager = () => {
  const tabs = {
    friends: {
      name: "Friends",
      badgeCount: friendData?.length,
      icon: "",
    },
    request: {
      name: "Requests",
      badgeCount: data?.length,
      icon: "",
    },
    addfriend: {
      name: "Add a friend",
      icon: plus,
    },
  };
  const [selectedTab, setSelectedTab] = useState<keyof typeof tabs>("friends");
  return (
    <ScreenContainer>
      <View>
        <SpacerColumn size={2} />
        <Tabs items={tabs} onSelect={setSelectedTab} selected={selectedTab} />
        <SpacerColumn size={2} />
        {selectedTab === "friends" && <Friends items={friendData} />}
        {selectedTab === "request" && <Requests items={data} />}
        {selectedTab === "addfriend" && <AddFriend />}
      </View>
    </ScreenContainer>
  );
};
export default FriendshipManager;
