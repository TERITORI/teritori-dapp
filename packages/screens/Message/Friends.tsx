import React, { useState } from "react";
import { View, ScrollView } from "react-native";

import nullIcon from "../../../assets/icons/illustration.svg";
import { SVG } from "../../components/SVG";
import { Separator } from "../../components/Separator";
import FriendList from "../../components/friends/FriendsList";
import { TextInputCustomBorder } from "../../components/inputs/TextInputCustomBorder";
import { SpacerColumn } from "../../components/spacer";
import { neutral00, neutral33 } from "../../utils/style/colors";
const Friends = ({ items }) => {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredItems = items.filter((item) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <View>
      {/* FIXME: remaining in web */}
      {/* <Separator horizontal={false} /> */}
      {/* <SpacerColumn size={1} /> */}
      <TextInputCustomBorder
        placeHolder="Search..."
        style={{ backgroundColor: neutral00 }}
        value={searchQuery}
        onChangeText={setSearchQuery}
      />
      <SpacerColumn size={2} />
      <Separator horizontal={false} color={neutral33} />
      <SpacerColumn size={1} />
      {filteredItems?.length > 0 ? (
        filteredItems?.map((item) => (
          <View key={item.id}>
            <ScrollView>
              <FriendList
                avatar={item.avatar}
                name={item.name}
                isOnline={item.isOnline}
              />
            </ScrollView>
          </View>
        ))
      ) : (
        <>
          <SpacerColumn size={15} />

          <SVG source={nullIcon} style={{ alignSelf: "center" }} />
        </>
      )}
    </View>
  );
};

export default Friends;
