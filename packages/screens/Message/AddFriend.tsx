import React from "react";
import { View, Text, Image } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";

import FlexRow from "../../components/FlexRow";
import { Separator } from "../../components/Separator";
import AddFriendList from "../../components/addfriend/AddFriendList";
import data from "../../components/addfriend/data";
import { TertiaryBox } from "../../components/boxes/TertiaryBox";
import { SearchInput } from "../../components/sorts/SearchInput";
import { SpacerColumn, SpacerRow } from "../../components/spacer";
const AddFriend = () => {
  return (
    <View style={{ flex: 1, backgroundColor: "#000" }}>
      <Separator horizontal={false} />
      <SpacerColumn size={2} />

      <Text
        style={{
          color: "#FFFFFF",
          fontWeight: "600",
          fontSize: 15,
          lineHeight: 18,
        }}
      >
        Add a friend
      </Text>
      <Text
        style={{
          color: "#A3A3A3",
          fontWeight: "600",
          fontSize: 12,
          lineHeight: 18,
        }}
      >
        You can find a friend using .tori directory service.
      </Text>
      <SpacerColumn size={2} />
      <View style={{ maxWidth: "84%" }}>
        <FlexRow>
          <SearchInput />
          <SpacerRow size={2} />
          <TouchableOpacity>
            <TertiaryBox
              height={40}
              mainContainerStyle={{
                backgroundColor: "#16BBFF",
                padding: 12,

                alignItems: "center",
              }}
            >
              <Text
                style={{ color: "#2B0945", fontSize: 14, fontWeight: "600" }}
              >
                Find a friend
              </Text>
            </TertiaryBox>
          </TouchableOpacity>
        </FlexRow>
      </View>
      <SpacerColumn size={2} />
      <Separator horizontal={false} />
      <SpacerColumn size={2} />
      {data.length > 0 ? (
        data.map((item) => (
          <AddFriendList
            key={item.id}
            avatar={item.avatar}
            name={item.name}
            isOnline={item.isOnline}
          />
        ))
      ) : (
        <Image
          source={require("../../../assets/icons/illustration.png")}
          style={{
            height: 300,
            width: 300,
            alignSelf: "center",
            marginTop: 40,
          }}
        />
      )}

      <SpacerColumn size={2} />
    </View>
  );
};
export default AddFriend;
