import React from "react";
import { View } from "react-native";

import FriendList from "../../components/friends/FriendsList";
import data from "../../components/friends/data";
const Friends = () => {
  return (
    <View style={{ flex: 1, backgroundColor: "#000" }}>
      {data.map((item) => (
        <FriendList
          avatar={item.avatar}
          name={item.name}
          isOnline={item.isOnline}
        />
      ))}
    </View>
  );
};

export default Friends;
