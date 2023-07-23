import React, { Dispatch, SetStateAction, useState } from "react";
import { View, TouchableOpacity, ScrollView, Platform } from "react-native";

import avatar from "../../../../assets/icons/avatar.svg";
import nullIcon from "../../../../assets/icons/illustration.svg";
import { BrandText } from "../../../components/BrandText";
import FlexRow from "../../../components/FlexRow";
import { SVG } from "../../../components/SVG";
import { Separator } from "../../../components/Separator";
import { SeparatorGradient } from "../../../components/SeparatorGradient";
import ScreenShare from "../../../components/ShareScreen/ShareScreen";
import data from "../../../components/ShareScreen/data";
import { TertiaryBox } from "../../../components/boxes/TertiaryBox";
import { TextInputCustom } from "../../../components/inputs/TextInputCustom";
import ModalBase from "../../../components/modals/ModalBase";
import { SearchInput } from "../../../components/sorts/SearchInput";
import { SpacerColumn, SpacerRow } from "../../../components/spacer";
import {
  neutral00,
  neutral33,
  neutral77,
  primaryTextColor,
} from "../../../utils/style/colors";
import { fontSemibold14 } from "../../../utils/style/fonts";

interface ShareScreenProps {
  setShowTertiaryBox: Dispatch<SetStateAction<boolean>>;
}

const ShareScreen = ({ setShowTertiaryBox }: ShareScreenProps) => {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredData = data.filter((item) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  return (
    <ModalBase
      label="Screen share"
      onClose={() => setShowTertiaryBox(false)}
      visible
      hideMainSeparator
      width={457}
      closeButtonStyle={{ height: 300 }}
      // containerStyle={{ height: 300 }}
    >
      <SeparatorGradient />

      <SpacerColumn size={2} />

      {/* <FlexRow style={{ width: "100%" }}>
        <SVG source={avatar} height={40} width={40} style={{ width: "20%" }} />
        <SpacerRow size={1} />
        <TextInputCustom
          name="Groupname"
          label="Group name"
          placeHolder="Type group name here"
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
          placeholderTextColor={neutral77}
          squaresBackgroundColor={neutral17}
        />
      </FlexRow> */}
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
          placeholderTextColor={neutral77}
          squaresBackgroundColor={neutral00}
          fullWidth
          width={Platform.OS === "web" ? 370 : 305}
        />
      </FlexRow>

      <SpacerColumn size={2} />
      <TouchableOpacity onPress={() => setShowTertiaryBox(false)}>
        <TertiaryBox
          height={40}
          mainContainerStyle={{
            backgroundColor: "#16BBFF",
          }}
          fullWidth
        >
          <BrandText style={[fontSemibold14, { color: primaryTextColor }]}>
            Create my group
          </BrandText>
        </TertiaryBox>
      </TouchableOpacity>
      <SpacerColumn size={2} />
      <Separator />
      <SpacerColumn size={2} />
      {/* <TextInputCustomBorder
        placeHolder="Search..."
        style={{ backgroundColor: "#000" }}
        value={searchQuery}
        onChangeText={setSearchQuery}
      /> */}
      <SearchInput borderRadius={12} handleChangeText={setSearchQuery} />
      <SpacerColumn size={2} />
      <View style={{ maxHeight: 200 }}>
        <ScrollView showsVerticalScrollIndicator={false}>
          {filteredData.length > 0 ? (
            filteredData.map((item) => (
              <ScreenShare
                key={item.id}
                avatar={item.avatar}
                name={item.name}
                isOnline
              />
            ))
          ) : (
            <>
              <SpacerColumn size={12} />

              <SVG source={nullIcon} style={{ alignSelf: "center" }} />
            </>
          )}
        </ScrollView>
      </View>
      <Separator color={neutral33} />
      <SpacerColumn size={2} />

      <BrandText style={[fontSemibold14, { color: neutral77 }]}>
        Or copy and send invite via link
      </BrandText>
      <SpacerColumn size={2} />
      <TextInputCustom
        name="Groupname"
        placeHolder="https://teritori.djkfhuisd/hjf"
        // // onChangeText={setName}
        // // value={name || ""}
        // textInputStyle={{ width: 20 }}
        boxMainContainerStyle={{
          paddingVertical: 5,
          width: "100%",
        }}
        rules={{ required: true }}
        placeholderTextColor={neutral77}
        squaresBackgroundColor={neutral00}
        label=""
      />
      <SpacerColumn size={2} />
    </ModalBase>
  );
};
export default ShareScreen;
