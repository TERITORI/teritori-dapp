import React from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";

import avator from "../../../assets/icons/avatar.svg";
import close from "../../../assets/icons/close.svg";
import FlexRow from "../../components/FlexRow";
import { SVG } from "../../components/SVG";
import { Separator } from "../../components/Separator";
import { TertiaryBox } from "../../components/boxes/TertiaryBox";
import { TextInputCustom } from "../../components/inputs/TextInputCustom";
import { TextInputCustomBorder } from "../../components/inputs/TextInputCustomBorder";
import { SpacerColumn, SpacerRow } from "../../components/spacer";
import { neutral17 } from "../../utils/style/colors";
import CheckboxGroup from "./MessengerHomeCreateChatDropdown/FriendNameDropdown";
const items = [
  { name: "Kristin Watson", checked: false },
  { name: "Kristin Watson", checked: false },
  { name: "Kristin Watson", checked: false },
  { name: "Kristin Watson", checked: false },
  { name: "Kristin Watson", checked: false },
];

const CreateGroup = ({ setShowTertiaryBox }) => {
  const handleChange = (items: CheckboxItem[]) => {
    console.log(items);
  };
  return (
    <View>
      <TertiaryBox>
        <View style={{ padding: 20 }}>
          <FlexRow style={{ justifyContent: "space-between" }}>
            <Text style={{ color: "#fff" }}>Create a group chat</Text>
            <TouchableOpacity onPress={() => setShowTertiaryBox(false)}>
              <SVG source={close} height={20} width={20} />
            </TouchableOpacity>
          </FlexRow>
          <SpacerColumn size={2} />
          <Separator />

          <SpacerColumn size={2} />
          <FlexRow style={{ justifyContent: "space-between" }}>
            <SVG source={avator} height={50} width={50} />

            <TextInputCustom<{ label: string }>
              name="name"
              label="Group name"
              placeHolder="Group name"
              style={{ backgroundColor: "#000" }}
              // onChangeText={setName}
              // value={name || ""}
              boxMainContainerStyle={{
                paddingVertical: 5,
                paddingHorizontal: 10,
                width: 260,
              }}
              placeholderTextColor="#fff"
              // squaresBackgroundColor={neutral17}
            />
          </FlexRow>
          <SpacerColumn size={2} />
          <TextInputCustomBorder
            placeHolder="Search..."
            style={{
              backgroundColor: "#000",
              height: 40,
              minHeight: 40,
              maxHeight: 40,
            }}
          />
          <SpacerColumn size={2} />
          <CheckboxGroup items={items} onChange={handleChange} />
          <SpacerColumn size={2} />
          <TouchableOpacity>
            <TertiaryBox
              height={40}
              mainContainerStyle={{
                backgroundColor: "#16BBFF",
                padding: 12,
                flex: 1,
                alignItems: "center",
              }}
              fullWidth
            >
              <Text
                style={{ color: "#2B0945", fontSize: 14, fontWeight: "600" }}
              >
                Create group
              </Text>
            </TertiaryBox>
          </TouchableOpacity>
        </View>
      </TertiaryBox>
    </View>
  );
};
export default CreateGroup;
