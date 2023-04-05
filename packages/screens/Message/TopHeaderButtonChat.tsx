import React, { useState } from "react";
import { View } from "react-native";

import plus from "../../../assets/icons/Addplus.svg";
import { Tabs } from "../../components/tabs/Tabs";
import AddFriend from "./AddFriend";
import Friends from "./Friends";
import Requests from "./Requests";

const TopHeaderButtonChat = () => {
  const tabs = {
    friends: {
      name: "Friends",
      badgeCount: "20",
      icon: "",
    },
    request: {
      name: "Requests",
      badgeCount: "150",
      icon: "",
    },
    addfriend: {
      name: "Add a friend",
      icon: plus,
    },
  };
  const [selectedTab, setSelectedTab] = useState<keyof typeof tabs>("friends");
  return (
    <View style={{ marginLeft: 10 }}>
      <Tabs items={tabs} onSelect={setSelectedTab} selected={selectedTab} />
      {selectedTab === "friends" && <Friends />}
      {selectedTab === "request" && <Requests />}
      {selectedTab === "addfriend" && <AddFriend />}
    </View>
  );
};
export default TopHeaderButtonChat;
