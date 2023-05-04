import React from "react";
import { View, Text, Image } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";

import FlexRow from "../../components/FlexRow";
import { ScreenContainer } from "../../components/ScreenContainer";
import { Separator } from "../../components/Separator";
import AddFriendList from "../../components/addfriend/AddFriendList";
import data from "../../components/addfriend/data";
import { TertiaryBox } from "../../components/boxes/TertiaryBox";
import { SearchInput } from "../../components/sorts/SearchInput";
import { SpacerColumn, SpacerRow } from "../../components/spacer";
import {
  neutral33,
  neutralA3,
  primaryColor,
  primaryTextColor,
  secondaryColor,
} from "../../utils/style/colors";
import {
  fontSemibold13,
  fontSemibold14,
  fontSemibold16,
} from "../../utils/style/fonts";
const AddFriend = () => {
  return (
    <ScreenContainer>
      <View style={{ backgroundColor: "#000" }}>
        <Separator horizontal={false} />
        <SpacerColumn size={2} />

        <Text style={[fontSemibold16, { color: secondaryColor }]}>
          Add a friend
        </Text>
        <Text style={[fontSemibold13, { color: neutralA3 }]}>
          You can find a friend using .tori directory service.
        </Text>
        <SpacerColumn size={2} />
        <FlexRow justifyContent="space-between">
          <View style={{ width: "70%" }}>
            <SearchInput />
          </View>
          <SpacerRow size={1} />
          <View style={{ width: "30%" }}>
            <TouchableOpacity>
              <TertiaryBox
                height={36}
                mainContainerStyle={{
                  backgroundColor: primaryColor,
                  padding: 8,
                }}
              >
                <Text style={[fontSemibold14, { color: primaryTextColor }]}>
                  Find a friend
                </Text>
              </TertiaryBox>
            </TouchableOpacity>
          </View>
        </FlexRow>
        <SpacerColumn size={2} />
        <Separator horizontal={false} color={neutral33} />
        <SpacerColumn size={1} />
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
    </ScreenContainer>
  );
};
export default AddFriend;
