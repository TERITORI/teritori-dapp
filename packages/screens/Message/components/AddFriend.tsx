import React, { useState } from "react";
import { View } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";

import AddFriendList from "./AddFriendList";
import nullIcon from "../../../../assets/icons/illustration.svg";
import { BrandText } from "../../../components/BrandText";
import FlexRow from "../../../components/FlexRow";
import { SVG } from "../../../components/SVG";
import { Separator } from "../../../components/Separator";
import { TertiaryBox } from "../../../components/boxes/TertiaryBox";
import { TextInputCustomBorder } from "../../../components/inputs/TextInputCustomBorder";
import { SpacerColumn, SpacerRow } from "../../../components/spacer";
import {
  neutral33,
  neutralA3,
  primaryColor,
  primaryTextColor,
  secondaryColor,
} from "../../../utils/style/colors";
import {
  fontSemibold13,
  fontSemibold14,
  fontSemibold16,
} from "../../../utils/style/fonts";

export const AddFriend = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const filteredData = [].filter((item) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  return (
    <View style={{ backgroundColor: "#000" }}>
      <BrandText style={[fontSemibold16, { color: secondaryColor }]}>
        Add a friend
      </BrandText>
      <BrandText style={[fontSemibold13, { color: neutralA3 }]}>
        You can find a friend using .tori directory service.
      </BrandText>
      <SpacerColumn size={2} />
      <FlexRow>
        <TextInputCustomBorder
          placeHolder="Search..."
          style={{ backgroundColor: "#000" }}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        <SpacerRow size={1} />
        <TouchableOpacity>
          <TertiaryBox
            mainContainerStyle={{
              backgroundColor: primaryColor,
              paddingVertical: 12,
              paddingHorizontal: 15,
            }}
          >
            <BrandText style={[fontSemibold14, { color: primaryTextColor }]}>
              Find a friend
            </BrandText>
          </TertiaryBox>
        </TouchableOpacity>
      </FlexRow>
      <SpacerColumn size={2} />
      <Separator horizontal={false} color={neutral33} />
      <SpacerColumn size={1} />
      {filteredData.length > 0 ? (
        filteredData.map((item) => (
          <AddFriendList
            key={item.id}
            avatar={item.avatar}
            name={item.name}
            isOnline={item.isOnline}
          />
        ))
      ) : (
        <>
          <SpacerColumn size={12} />
          <SVG source={nullIcon} style={{ alignSelf: "center" }} />
        </>
      )}
      <SpacerColumn size={2} />
    </View>
  );
};
