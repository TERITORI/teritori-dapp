import React from "react";
import { View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";

import { Separator } from "../../components/Separator";
import FriendList from "../../components/friends/FriendsList";
import data from "../../components/friends/data";
import { TextInputCustomBorder } from "../../components/inputs/TextInputCustomBorder";
import { SpacerColumn } from "../../components/spacer";
const Friends = () => {
  return (
    <View style={{ flex: 1, backgroundColor: "#000" }}>
      <Separator horizontal={false} />
      <SpacerColumn size={2} />
      <TextInputCustomBorder
        placeHolder="Search..."
        style={{ backgroundColor: "#000" }}
      />
      <SpacerColumn size={1} />
      {data.map((item) => (
        <View>
          <ScrollView>
            <FriendList
              avatar={item.avatar}
              name={item.name}
              isOnline={item.isOnline}
            />
          </ScrollView>
        </View>
      ))}
    </View>
  );
};

export default Friends;
