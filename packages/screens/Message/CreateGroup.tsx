import React from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";

import CheckboxGroup from "./MessengerHomeCreateChatDropdown/FriendNameDropdown";
import avatar from "../../../assets/icons/avatar.svg";
import { BrandText } from "../../components/BrandText";
import FlexRow from "../../components/FlexRow";
import { SVG } from "../../components/SVG";
import { Separator } from "../../components/Separator";
import { SeparatorGradient } from "../../components/SeparatorGradient";
import { TertiaryBox } from "../../components/boxes/TertiaryBox";
import { TextInputCustom } from "../../components/inputs/TextInputCustom";
import ModalBase from "../../components/modals/ModalBase";
import { SearchInput } from "../../components/sorts/SearchInput";
import { SpacerColumn, SpacerRow } from "../../components/spacer";
import {
  neutral17,
  neutral33,
  primaryTextColor,
  secondaryColor,
} from "../../utils/style/colors";
import { fontSemibold14 } from "../../utils/style/fonts";
const items = [
  { name: "Kristin Watson", checked: false },
  { name: "Kristin Watson", checked: false },
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
    <ModalBase
      label="Create a group chat"
      onClose={() => setShowTertiaryBox(false)}
      visible
      hideMainSeparator
      width={457}
      containerStyle={{ height: 900 }}
      closeButtonStyle={{ backgroundColor: "red", height: 300 }}
    >
      <SeparatorGradient />

      <SpacerColumn size={2} />

      <FlexRow style={{ width: "100%" }}>
        <SVG source={avatar} height={40} width={40} style={{ width: "20%" }} />
        <SpacerRow size={1} />
        <TextInputCustom
          name="Groupname"
          label="Group name"
          placeHolder="Group name"
          style={{ width: "93%" }}
          // // onChangeText={setName}
          // // value={name || ""}
          // textInputStyle={{ width: 20 }}
          boxMainContainerStyle={{
            paddingVertical: 5,
            width: "100%",
          }}
          variant="regular"
          rules={{ required: true }}
          placeholderTextColor={secondaryColor}
          squaresBackgroundColor={neutral17}
        />
      </FlexRow>

      <SpacerColumn size={2} />

      <SearchInput borderRadius={12} />
      <SpacerColumn size={2} />
      <View style={{ maxHeight: 200 }}>
        <ScrollView>
          <CheckboxGroup items={items} onChange={handleChange} />
        </ScrollView>
      </View>

      <Separator color={neutral33} style={{ right: 20, width: 500 }} />
      <SpacerColumn size={2} />
      <TouchableOpacity onPress={() => setShowTertiaryBox(false)}>
        <TertiaryBox
          height={50}
          mainContainerStyle={{
            backgroundColor: "#16BBFF",
          }}
          fullWidth
        >
          <BrandText style={[fontSemibold14, { color: primaryTextColor }]}>
            Create group
          </BrandText>
        </TertiaryBox>
      </TouchableOpacity>
      <SpacerColumn size={2} />
    </ModalBase>
  );
};
export default CreateGroup;
