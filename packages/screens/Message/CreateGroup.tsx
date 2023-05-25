import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Platform,
} from "react-native";

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
  neutral00,
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
      width={450}
      // containerStyle={{ height: 900 }}
      closeButtonStyle={{ height: 300 }}
    >
      <SeparatorGradient />

      <SpacerColumn size={2} />

      <FlexRow justifyContent="space-between">
        <SVG source={avatar} />

        <SpacerRow size={1} />

        <TextInputCustom
          name="Groupname"
          label="Group name"
          placeHolder="Group name"
          // style={{ width: "95%" }}
          // // onChangeText={setName}
          // // value={name || ""}
          // textInputStyle={{ width: 20 }}
          boxMainContainerStyle={{
            paddingVertical: 2,
          }}
          // variant="regular"
          rules={{ required: true }}
          placeholderTextColor={secondaryColor}
          squaresBackgroundColor={neutral00}
          fullWidth
          width={Platform.OS == "web" ? 370 : 305}
        />
      </FlexRow>

      <SpacerColumn size={2} />

      <SearchInput borderRadius={12} />
      <SpacerColumn size={2} />
      <View style={{ maxHeight: 200 }}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <CheckboxGroup items={items} onChange={handleChange} />
        </ScrollView>
      </View>

      <Separator color={neutral33} />
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
